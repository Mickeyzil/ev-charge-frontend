document.addEventListener("DOMContentLoaded", () => {
    const logoContainer = document.querySelector(".logo-container");

    if (logoContainer) {
        logoContainer.style.cursor = "pointer";

        logoContainer.addEventListener("click", () => {
            window.location.href = "MainMenu.html";
        });
    }

    document.body.classList.add("page-loaded");
});