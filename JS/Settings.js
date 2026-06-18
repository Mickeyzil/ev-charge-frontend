document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    const contactBtn = document.getElementById("contact-btn");
    const saveBtn = document.getElementById("save-settings-btn");
    const backBtn = document.getElementById("back-btn");
    const result = document.getElementById("settings-result");

    const notificationsToggle = document.getElementById("notifications-toggle");
    const darkToggle = document.getElementById("dark-toggle");
    const favoritesToggle = document.getElementById("favorites-toggle");

    if (contactBtn) {
        contactBtn.addEventListener("click", () => {
            window.location.href = "Contact.html";
        });
    }

    // 1. טעינת המצב הקיים מה-localStorage בזמן פתיחת הדף
    notificationsToggle.checked = localStorage.getItem("notifications") === "true";
    darkToggle.checked = localStorage.getItem("darkMode") === "true";
    favoritesToggle.checked = localStorage.getItem("saveFavorites") === "true";

    // אם הדארק מוד כבר היה שמור מקודם - נפעיל אותו על עמוד ההגדרות עצמו בטעינה
    if (darkToggle.checked) {
        document.body.classList.add("dark-mode");
    }

    // 2. האזנה ללחיצה על כפתור השמירה (רק כאן השינוי ננעל ומיושם!)
    saveBtn.addEventListener("click", () => {
        // שמירת המצבים בזיכרון של הדפדפן בשביל שאר הדפים
        localStorage.setItem("notifications", notificationsToggle.checked);
        localStorage.setItem("darkMode", darkToggle.checked);
        localStorage.setItem("saveFavorites", favoritesToggle.checked);

        // החלת/הסרת ה-Dark Mode מהעמוד הנוכחי מיד עם השמירה
        if (darkToggle.checked) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }

        // הצגת הודעת הצלחה טקסטואלית יפה (בלי alert!)
        result.textContent = "Settings saved successfully and applied to all pages!";
        result.style.color = "green";
        result.classList.remove("hidden");
    });

    // 3. עדכון כפתור החזרה לעבודה דינמית עם היסטוריית הדפדפן
    backBtn.addEventListener("click", () => {
        window.history.back();
    });
});