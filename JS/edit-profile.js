document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    const profileForm = document.getElementById('edit-profile-form');
    const notification = document.getElementById('notification');

    // שליפת כפתור השמירה מתוך הטופס לניהול מצבי טעינה
    const submitBtn = profileForm ? profileForm.querySelector('.submit-btn') : null;

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
        fetch(`${API_URL}/api/users/${userId}`)
            .then(res => res.json())
            .then(user => {
                document.getElementById('full-name').value = user.full_name || '';
                document.getElementById('email').value = user.email || '';
                document.getElementById('email').disabled = true; // אימייל יישאר נעול לעריכה
                document.getElementById('phone').value = user.phone || '';
                
                // עדכון בחירה בתיבת select של דגם הרכב
                const carSelect = document.getElementById('car-model');
                if (carSelect && user.car_model) {
                    carSelect.value = user.car_model;
                }
            })
            .catch(err => {
                console.error("Error loading profile:", err);
                showNotification("Failed to load profile data.", "error");
            });
    }

    // 2. שמירת נתונים (עריכת פרופיל)
    if (profileForm) {
        profileForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const password = document.getElementById('new-password').value;
            const oldPassword = document.getElementById('old-password').value;

            // א) בדיקת פורמט סיסמה חדשה (8 תווים, אות גדולה, קטנה, מספר)
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (password && !passwordRegex.test(password)) {
                showNotification('Password must be 8+ chars, with uppercase, lowercase, and a number.', 'error');
                return;
            }

            // ב) בדיקה שהסיסמה החדשה אינה זהה לסיסמה הנוכחית
            if (password && password === oldPassword) {
                showNotification('New password cannot be the same as your current password.', 'error');
                return; // עוצר את שליחת הטופס לשרת ומציג שגיאה בדפדפן
            }

            // ג) העברת הכפתור למצב טעינה ונטרול לחיצות רק לאחר שכל הוולידציות עברו בהצלחה
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Updating profile... ⏳';
            }

            const updatedData = {
                full_name: document.getElementById('full-name').value,
                phone: document.getElementById('phone').value,
                car_model: document.getElementById('car-model').value,
                password: password,
                oldPassword: oldPassword
            };

            fetch(`${API_URL}/api/users/update/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message); // תפיסת שגיאות מהשרת (כמו סיסמה ישנה שגויה)
                return data;
            })
            .then(data => {
                // חיווי ויזואלי ישיר על גבי הכפתור ברגע שהעדכון הצליח בשרת
                if (submitBtn) {
                    submitBtn.textContent = '✓ Profile Updated! 🎉';
                }

                showNotification("Profile updated successfully!", "success");
                
                // השהייה קלה של שנייה וחצי כדי שהמשתמש יספיק לראות את האנימציות לפני המעבר למסך הראשי
                setTimeout(() => { 
                    window.location.href = 'MainMenu.html'; 
                }, 1500);
            })
            .catch(err => {
                // במקרה של שגיאה (למשל סיסמה נוכחית שגויה מה-DB), נחזיר את הכפתור לפעילות
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Save Changes';
                }
                showNotification(err.message, "error"); // יציג את הריבוע האדום עם השגיאה המדויקת מהשרת
            });
        });
    }

    // 3. לוגיקת מודל חזרה (Back Button Confirmation)
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