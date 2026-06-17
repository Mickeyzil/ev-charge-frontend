document.addEventListener("DOMContentLoaded", () => {

    // Edit Profile
    const profileBtn = document.getElementById("profile-btn");

    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            // Future Profile Page
        });
    }

    // Favorites
    const favoritesBtn = document.getElementById("favorites-btn");

    if (favoritesBtn) {
        favoritesBtn.addEventListener("click", () => {
            window.location.href = "Favorites.html";
        });
    }

    // Find Nearby Stations
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
            // Future Map Page
        });
    }

    // Log Out
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {

            const confirmLogout = confirm(
                "Are you sure you want to log out?"
            );

            if (confirmLogout) {
                localStorage.clear();
                window.location.href = "Login.html";
            }

        });
    }

});