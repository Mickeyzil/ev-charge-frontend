document.addEventListener("DOMContentLoaded", () => {

    document.body.style.opacity = "1";

    const logoContainer = document.querySelector(".logo-container");

    if (logoContainer) {
        logoContainer.style.cursor = "pointer";

        logoContainer.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "MainMenu.html";
        });
    }

});