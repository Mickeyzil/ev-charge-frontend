document.addEventListener("DOMContentLoaded", () => {

    const profileBtn = document.getElementById("profile-btn");

    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            // Future Profile Page
            window.location.href="EditProfile.html";
        });
    }

    const favoritesBtn = document.getElementById("favorites-btn");

    if (favoritesBtn) {
        favoritesBtn.addEventListener("click", () => {
            window.location.href = "Favorites.html";
            window.location.href="Favorites.html";
        });
    }

    // Find Nearby Stations
    const stationsBtn = document.getElementById("stations-btn");

    if (stationsBtn) {
        stationsBtn.addEventListener("click", () => {
            window.location.href = "NearbyStations.html";
        });
    }

    const mapBtn = document.getElementById("map-btn");

    if (mapBtn) {
        mapBtn.addEventListener("click", () => {
            // Future Map Page
           
        });
    }

    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
    const logoutModal = document.getElementById("logout-modal");
    const logoutConfirmBtn = document.getElementById("logout-confirm-btn");
    const logoutCancelBtn = document.getElementById("logout-cancel-btn");

    if (logoutBtn && logoutModal) {
        logoutBtn.addEventListener("click", () => {

            const confirmLogout = confirm(
                "Are you sure you want to log out?"
            );

            if (confirmLogout) {
                localStorage.clear();
                window.location.href = "Login.html";
            }

            logoutModal.classList.remove("hidden");
        });
    }

    if (logoutCancelBtn && logoutModal) {
           logoutCancelBtn.addEventListener("click", () => {
            logoutModal.classList.add("hidden");
        });
    }

    if (logoutConfirmBtn) {
        logoutConfirmBtn.addEventListener("click", () => {
            window.location.href = "Login.html";
        });
    }

});