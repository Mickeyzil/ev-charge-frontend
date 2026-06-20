document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const messageBox = document.getElementById("register-message");
    const backLoginBtn = document.getElementById("back-login-btn");

    if (backLoginBtn) {
        backLoginBtn.addEventListener("click", () => {
            window.location.href = "Login.html";
        });
    }

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const fullName = document.getElementById("full-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        const namePattern = /^[A-Za-z\s]{2,}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[0-9]{9,10}$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        hideMessage();

        if (!fullName || !email || !phone || !password || !confirmPassword) {
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
            showMessage("Phone number must contain 9-10 digits.", "error");
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

        localStorage.setItem("registeredFullName", fullName);
        localStorage.setItem("registeredEmail", email);
        localStorage.setItem("registeredPhone", phone);

        showMessage("Account created successfully! Redirecting to login...", "success");

        setTimeout(() => {
            window.location.href = "Login.html";
        }, 1200);
    });

    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = `register-message ${type}`;
    }

    function hideMessage() {
        messageBox.className = "register-message hidden";
        messageBox.textContent = "";
    }
});