document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    const profileForm = document.getElementById('edit-profile-form');
    const notification = document.getElementById('notification');

    // ניהול מודל החזרה
    const backBtn = document.getElementById('btn-back');
    const modal = document.getElementById('back-modal');
    const confirmBtn = document.getElementById('confirm-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    // פונקציית עזר להצגת הודעות בדף
    function showNotification(message, type) {
        if (notification) {
            notification.textContent = message;
            notification.className = `notification-box ${type}`; // 'success' או 'error'
            notification.classList.remove('hidden');
            notification.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // 1. טעינת נתונים אוטומטית בעליית הדף
    if (userId) {
        fetch(`http://localhost:5000/api/users/${userId}`)
            .then(res => res.json())
            .then(user => {
                document.getElementById('full-name').value = user.full_name || '';
                document.getElementById('email').value = user.email || '';
                document.getElementById('email').disabled = true;
                document.getElementById('phone').value = user.phone || '';
                
                // עדכון בחירה בתיבת select
                const carSelect = document.getElementById('car-model');
                if (carSelect && user.car_model) {
                    carSelect.value = user.car_model.toLowerCase();
                }
            })
            .catch(err => {
                console.error("Error loading profile:", err);
                showNotification("Failed to load profile data.", "error");
            });
    }

    // 2. שמירת נתונים
    if (profileForm) {
        profileForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const password = document.getElementById('new-password').value;
            const oldPassword = document.getElementById('old-password').value;

            // בדיקת פורמט סיסמה (8 תווים, אות גדולה, קטנה, מספר)
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (password && !passwordRegex.test(password)) {
                showNotification('Password must be 8+ chars, with uppercase, lowercase, and a number.', 'error');
                return;
            }

            const updatedData = {
                full_name: document.getElementById('full-name').value,
                phone: document.getElementById('phone').value,
                car_model: document.getElementById('car-model').value,
                password: password,
                oldPassword: oldPassword
            };

            fetch(`http://localhost:5000/api/users/update/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                return data;
            })
            .then(data => {
                showNotification("Profile updated successfully!", "success");
                setTimeout(() => { window.location.href = 'MainMenu.html'; }, 1500);
            })
            .catch(err => {
                showNotification(err.message, "error");
            });
        });
    }

    // 3. לוגיקת כפתור החזרה (Back Button)
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            if (modal) modal.classList.remove('hidden');
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
});