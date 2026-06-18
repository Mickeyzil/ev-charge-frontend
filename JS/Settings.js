document.addEventListener("DOMContentLoaded", () => {
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

    

    notificationsToggle.checked = localStorage.getItem("notifications") === "true";
    darkToggle.checked = localStorage.getItem("darkMode") === "true";
    favoritesToggle.checked = localStorage.getItem("saveFavorites") === "true";

    saveBtn.addEventListener("click", () => {
        localStorage.setItem("notifications", notificationsToggle.checked);
        localStorage.setItem("darkMode", darkToggle.checked);
        localStorage.setItem("saveFavorites", favoritesToggle.checked);

        result.textContent = "Settings saved successfully!";
        result.style.color = "green";
        result.classList.remove("hidden");
    });

    backBtn.addEventListener("click", () => {
        window.location.href = "MainMenu.html";
    });
});