document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const messageBox = document.getElementById("register-message");
    const backLoginBtn = document.getElementById("back-login-btn");
    const settingsBtn = document.getElementById('settings-btn');
    const contactBtn = document.getElementById('contact-btn');

    // 1. ניווט בכפתורי ה-Header (עובד מיד עם טעינת העמוד)
    if (settingsBtn) {
        settingsBtn.addEventListener("click", () => {
            window.location.href = "Settings.html";
        });
    }

    if (contactBtn) {
        contactBtn.addEventListener("click", () => {
            window.location.href = "Contact.html";
        });
    }

    if (backLoginBtn) {
        backLoginBtn.addEventListener("click", () => {
            window.location.href = "Login.html";
        });
    }

    // 2. ניהול טופס ההרשמה
    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // שליפת ערכים
            const fullName = document.getElementById("full-name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const password = document.getElementById("password").value.trim();
            const confirmPassword = document.getElementById("confirm-password").value.trim();
            const carModel = document.getElementById("car-model").value; 

            // תבניות בדיקה (Regex)
            const namePattern = /^[A-Za-z\s]{2,}$/;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phonePattern = /^\+?[0-9\s-]{9,15}$/; 
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

            hideMessage();

            // וולידציה
            if (!fullName || !email || !phone || !password || !confirmPassword || !carModel) {
                showMessage("Please fill all fields.", "error");
                return;
            }

            if (!namePattern.test(fullName)) {
                showMessage("Full name must contain only letters and spaces.", "error");
                return;
            }

            if (!emailPattern.test(email)) {
                showMessage("Please enter a valid email address.", "error");
                return;
            }

            if (!phonePattern.test(phone)) {
                showMessage("Please enter a valid phone number.", "error");
                return;
            }

            if (!passwordPattern.test(password)) {
                showMessage("Password must be at least 8 characters, with uppercase, lowercase and a number.", "error");
                return;
            }

            if (password !== confirmPassword) {
                showMessage("Passwords do not match.", "error");
                return;
            }

            // שמירה זמנית ב-LocalStorage
            localStorage.setItem("registeredFullName", fullName);
            localStorage.setItem("registeredEmail", email);
            localStorage.setItem("registeredPhone", phone);
            localStorage.setItem("registeredCarModel", carModel); 

            // הצגת הודעת הצלחה (עונה על דרישות הפרויקט ללא alert)
            showMessage("Account created successfully! Redirecting to login...", "success");

            // מעבר עמוד חלקה לאחר 1.2 שניות
            setTimeout(() => {
                window.location.href = "Login.html";
            }, 1200);
        });
    }

    // 3. פונקציות עזר להצגת הודעות (נמצאות בתוך ה-scope של ה-DOM)
    function showMessage(message, type) {
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.className = `register-message ${type}`;
        }
    }

    function hideMessage() {
        if (messageBox) {
            messageBox.className = "register-message hidden";
            messageBox.textContent = "";
        }
    }
});