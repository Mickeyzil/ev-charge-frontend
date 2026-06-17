document.addEventListener("DOMContentLoaded", () => {

    // Edit Profile
    const profileBtn = document.getElementById("profile-btn");
    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            // בעתיד מעבר ל-Profile
        });
    }

    // Favorites
    const favoritesBtn = document.getElementById("favorites-btn");
    if (favoritesBtn) {
        favoritesBtn.addEventListener("click", () => {
            // בעתיד מעבר ל-Favorites
        });
    }

    // Find nearby stations
    const stationsBtn = document.getElementById("stations-btn");
    if (stationsBtn) {
        stationsBtn.addEventListener("click", () => {
            window.location.href = "NearbyStations.html";
        });
    }

    // Map View
    const mapBtn = document.getElementById("map-btn");
    if (mapBtn) {
        mapBtn.addEventListener("click", () => {
            // בעתיד מעבר למפה
        });
    }

    // Log Out
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            window.location.href = "Login.html";
        });
    }

});