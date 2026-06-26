document.addEventListener("DOMContentLoaded", () => {

    // 1. הגדרת ה-API_URL בצורה גלובלית ובטוחה מול config.js
    const API_URL = window.API_URL || "https://ev-charge-backend-27a3.onrender.com";

    // 2. טיפול ב-Dark Mode
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    // 3. ניווט לכפתורי תפריט צדדיים
    const contactBtn = document.getElementById("contact-btn");
    const settingsBtn = document.getElementById("settings-btn");

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

    // 4. טיפול בכפתור הרשמה
    const signupBtn = document.getElementById("signup-btn");
    if (signupBtn) {
        signupBtn.addEventListener("click", () => {
            window.location.href = "Register.html";
        });
    }

    // 5. טיפול בטופס ההתחברות (עטוף ב-if בטוח כדי למנוע חסימת קוד)
    const loginForm = document.getElementById("login-form");
    
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // חילוץ האלמנטים בצורה נכונה
            const errorBox = document.getElementById("error-message");
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const spinner = document.getElementById("loading-spinner"); 

            if (errorBox) {
                errorBox.classList.add("hidden");
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

            if (email === "" || password === "") {
                if (errorBox) {
                    errorBox.innerHTML = "Please fill all fields";
                    errorBox.classList.remove("hidden");
                }
                return;
            }

            if (!emailPattern.test(email)) {
                if (errorBox) {
                    errorBox.innerHTML = "Invalid email format";
                    errorBox.classList.remove("hidden");
                }
                return;
            }

            if (!passwordPattern.test(password)) {
                if (errorBox) {
                    errorBox.innerHTML = "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number.";
                    errorBox.classList.remove("hidden");
                }
                return;
            }

            const submitBtn = loginForm.querySelector("button[type='submit']");

            if (spinner) spinner.classList.remove("hidden");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = "0.6";
                submitBtn.innerText = "Logging in...";
            }

            // ביצוע ה-Fetch לשרת ב-Render
            fetch(`${API_URL}/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            .then(res => res.json())
            .then(data => {
                // בדיקה מורחבת: תפיסת טוקן או תפיסת הודעת ההצלחה הטקסטואלית מהשרת
                if (data.token || data.accessToken || data.message === "Login successful!") {
                    
                    // שמירת הטוקן במידה והוא קיים בתוך ה-Response
                    const token = data.token || data.accessToken;
                    if (token) {
                        localStorage.setItem("token", token);
                    }
                    
                    // שמירת נתוני המשתמש
                    if (data.user) {
                        localStorage.setItem("userFullName", data.user.full_name || "Driver");
                        localStorage.setItem("userId", data.user.user_id);
                    } else {
                        localStorage.setItem("userFullName", "Driver");
                        localStorage.setItem("userId", "2"); 
                    }

                    // מעבר מוצלח לעמוד הבא!
                    window.location.href = "MainMenu.html";
                } else {
                    // במקרה של כישלון אמיתי בהתחברות
                    if (spinner) spinner.classList.add("hidden");
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = "1";
                        submitBtn.innerText = "Log In";
                    }
                    if (errorBox) {
                        errorBox.innerHTML = data.message || "Login failed";
                        errorBox.classList.remove("hidden");
                    }
                }
            })
            .catch(err => {
                // במקרה של שגיאת תקשורת/שרת נופל
                if (spinner) spinner.classList.add("hidden");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = "1";
                    submitBtn.innerText = "Log In";
                }
                console.error('Error during login fetch:', err);
                if (errorBox) {
                    errorBox.innerHTML = "Server error, please try again.";
                    errorBox.classList.remove("hidden");
                }
            });
        });
    }
});