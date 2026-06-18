document.addEventListener('DOMContentLoaded', () => {const backMainBtn = document.getElementById("back-main-btn");

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

if (backMainBtn) {
    backMainBtn.addEventListener("click", () => {
        window.location.href = "MainMenu.html";
    });
}
const contactBtn = document.getElementById("contact-btn");

if (contactBtn) {
    contactBtn.addEventListener("click", () => {
        window.location.href = "Contact.html";
    });
}

const settingsBtn = document.getElementById("settings-btn");

if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
        window.location.href = "Settings.html";
    });
}
    fetch('./data/Stations.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('stations-container');

            if (!container) {
                return;
            }
            

            container.innerHTML = '';

            data.forEach(station => {
                const card = document.createElement('div');
                card.className = 'station-display-card';

                const connectorsHTML = station.connectors
                    .map(connector => `<span class="tag-item">${connector}</span>`)
                    .join(' ');

                const amenitiesHTML = station.amenities
                    .map(amenity => `<span class="tag-item">${amenity}</span>`)
                    .join(' ');

                const isFull = station.available[0] === '0';

                card.innerHTML = `
                    <div class="station-card-header">
                        <h2 class="station-card-title">${station.name}</h2>
                        <span class="status-dot" style="background-color: ${station.statusColor};"></span>
                    </div>

                    <div class="station-card-body">
                        <div class="info-row-main">
                            <div class="info-block">
                                <span class="info-label">AVAILABLE</span>
                                <span class="info-value-strong">${station.available}</span>
                            </div>

                            <div class="info-block align-right">
                                <span class="info-label">POWER</span>
                                <span class="info-value-highlight">⚡ ${station.power}</span>
                            </div>
                        </div>

                        <div class="price-row">
                            <span class="price-icon">💲</span>
                            <span class="price-value">${station.price}</span>
                        </div>

                        <div class="spec-row">
                            <span class="spec-icon">🔌</span>
                            <div class="tags-container">${connectorsHTML}</div>
                        </div>

                        <div class="spec-row">
                            <span class="spec-icon">📶</span>
                            <div class="tags-container">${amenitiesHTML}</div>
                        </div>

                        <p class="station-message hidden"></p>

                        <div class="card-actions">
                            <button class="btn-secondary favorite-btn" type="button">
                                ❤️ Add to Favorites
                            </button>

                            <button class="btn-primary reserve-btn ${isFull ? 'disabled-btn' : ''}" type="button" ${isFull ? 'disabled' : ''}>
                                ${isFull ? '❌ Fully Booked' : '📅 Make a Reservation'}
                            </button>
                        </div>
                    </div>
                `;

                const reserveBtn = card.querySelector('.reserve-btn');
                const messageBox = card.querySelector('.station-message');

                reserveBtn.addEventListener('click', () => {
                    if (isFull) {
                        messageBox.textContent = `${station.name} is fully booked. Please choose another station.`;
                        messageBox.classList.remove('hidden');
                        return;
                    }

                    localStorage.setItem('selectedStationName', station.name);
                    window.location.href = 'Reservation.html';
                });

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error loading stations:', error);
        });
});
