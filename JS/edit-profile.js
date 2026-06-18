document.addEventListener('DOMContentLoaded', () => {

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    const profileForm = document.getElementById('edit-profile-form');
    const notification = document.getElementById('notification');
    
    const backBtn = document.getElementById('btn-back');
    const modal = document.getElementById('back-modal');
    const confirmBtn = document.getElementById('confirm-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    if (backBtn && modal) {
        backBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');   
        });
    }

    if (cancelBtn && modal) {
        cancelBtn.addEventListener('click', () => {
            modal.classList.add('hidden'); 
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            window.location.href = 'MainMenu.html'; 
        });
    }

    function showNotification(message, type) {
        if (notification) {
            notification.textContent = message;
            notification.className = `notification-box ${type}`; 
            notification.scrollIntoView({ behavior: 'smooth' }); 
        }
    }

    if (profileForm) {
        profileForm.addEventListener('submit', (event) => {
            event.preventDefault(); // מניעת רענון העמוד

            const fullName = document.getElementById('full-name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const newPassword = document.getElementById('new-password').value;

            const nameRegex = /^[a-zA-Zא-ת\s]{2,}$/;
            if (!nameRegex.test(fullName)) {
                showNotification('Please enter a valid name (letters only, at least 2 characters).', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address (e.g., name@domain.com).', 'error');
                return;
            }

            const phoneRegex = /^05\d-?\d{7}$/;
            if (!phoneRegex.test(phone)) {
                showNotification('Please enter a valid Israeli phone number (e.g., 05XXXXXXXX).', 'error');
                return;
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                showNotification('The new password Must be at least 8 characters, with an uppercase letter, a lowercase letter, and a number.', 'error');
                return;
            }

            showNotification('Profile updated successfully! 🎉', 'success');
        });
    }
});