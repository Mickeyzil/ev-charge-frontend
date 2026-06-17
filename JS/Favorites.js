document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("favorites-container");
    const backBtn = document.getElementById("back-main-btn");

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "MainMenu.html";
        });
    }

    if (!container) {
        console.error("favorites-container not found");
        return;
    }

    fetch("./data/Stations.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Stations.json not found");
            }

            return response.json();
        })
        .then(stations => {
            container.innerHTML = "";

            stations.slice(0, 3).forEach(station => {
                const card = document.createElement("div");
                card.className = "favorite-station-card";

                const connectorsHTML = station.connectors
                    .map(connector => `<span>${connector}</span>`)
                    .join(" ");

                const amenitiesHTML = station.amenities
                    .map(amenity => `<span>${amenity}</span>`)
                    .join(" ");

                card.innerHTML = `
                    <div class="favorite-card-header">
                        <h2 class="favorite-card-title">${station.name}</h2>
                        <span class="favorite-status-dot" style="background-color:${station.statusColor};"></span>
                    </div>

                    <div class="favorite-card-info">
                        <div>
                            <span class="favorite-info-value">${station.available}</span>
                            <span class="favorite-info-label">AVAILABLE</span>
                        </div>

                        <div>
                            <span class="favorite-info-value">⚡ ${station.power}</span>
                            <span class="favorite-info-label">POWER</span>
                        </div>
                    </div>

                    <div class="favorite-price-row">
                        <span class="favorite-dollar">$</span>
                        <span>${station.price}</span>
                    </div>

                    <div class="favorite-detail-row">
                        <span>🔌</span>
                        <div class="favorite-tags">${connectorsHTML}</div>
                    </div>

                    <div class="favorite-detail-row">
                        <span>📶</span>
                        <div class="favorite-tags">${amenitiesHTML}</div>
                    </div>

                    <div class="favorite-actions">
                        <button class="favorite-reserve-btn" type="button">
                            📅 Make a Reservation
                        </button>
                    </div>
                `;

                const reserveBtn = card.querySelector(".favorite-reserve-btn");

                reserveBtn.addEventListener("click", () => {
                    localStorage.setItem("selectedStationName", station.name);
                    window.location.href = "Reservation.html";
                });

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error loading favorite stations:", error);
        });
});