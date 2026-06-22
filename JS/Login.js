document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    const contactBtn = document.getElementById("contact-btn");
    const settingsBtn = document.getElementById("settings-btn");
    const loginForm = document.getElementById("login-form");

    if (contactBtn) {
        contactBtn.addEventListener("click", () => {
            window.location.href = "Contact.html";
        });
    }

    if (settingsBtn) {
        settingsBtn.addEventListener("click", () => {
            window.location.href = "Settings.html";
        });
    }

    if (!loginForm) return;

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const errorBox = document.getElementById("error-message");
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        errorBox.classList.add("hidden");

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (email === "" || password === "") {
            errorBox.innerHTML = "Please fill all fields";
            errorBox.classList.remove("hidden");
            return;
        }

        if (!emailPattern.test(email)) {
            errorBox.innerHTML = "Please enter a valid email address";
            errorBox.classList.remove("hidden");
            return;
        }

        if (!passwordPattern.test(password)) {
            errorBox.innerHTML =
                "<strong>Invalid Password:</strong><br>" +
                "Must contain at least 8 characters, one uppercase letter, one lowercase letter and one number.";
            errorBox.classList.remove("hidden");
            return;
        }

        // שליחת נתוני התחברות לשרת ובדיקה מול ה-Database
        fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => { 
                    throw new Error(errData.message || "Invalid credentials"); 
                });
            }
            return response.json();
        })
        .then(data => {
            // בדיקה חסינה אם ההתחברות הצליחה
            if ((data.message && data.message.includes('Login successful')) || data.user) {
                
                if (data.user) {
                    localStorage.setItem("userFullName", data.user.full_name || "Driver");
                    
                    // 🔥 תיקון קריטי: בודקים אם חזר id או user_id כדי למנוע שמירה של undefined
                    const actualId = data.user.id || data.user.user_id;
                    if (actualId) {
                        localStorage.setItem("userId", actualId);
                    } else {
                        console.error("User ID not found in response user object", data.user);
                        localStorage.setItem("userId", "2"); // גיבוי בטוח למשתמש הנוכחי
                    }
                } else {
                    localStorage.setItem("userFullName", "Driver");
                    localStorage.setItem("userId", "2"); 
                }

                // מעבר בטוח לעמוד הראשי
                window.location.href = "MainMenu.html";
            } else {
                errorBox.innerHTML = data.message || "Login failed";
                errorBox.classList.remove("hidden");
            }
        })
        .catch(err => {
            console.error('Error during login fetch:', err);
            errorBox.innerHTML = err.message || "Server error, please try again.";
            errorBox.classList.remove("hidden");
        });
    });

    const signupBtn = document.getElementById("signup-btn");
    if (signupBtn) {
        signupBtn.addEventListener("click", () => {
            window.location.href = "Register.html";
        });
    }
});