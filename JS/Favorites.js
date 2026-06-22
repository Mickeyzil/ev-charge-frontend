document.addEventListener("DOMContentLoaded", () => {

    // הפעלת Dark Mode במידה ונבחר ב-Settings
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

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

    // שליפת ה-ID של המשתמש המחובר מה-localStorage
    const userId = localStorage.getItem("userId");

    // חסימת גישה והעברה לעמוד ה-Login אם המשתמש לא מחובר
    if (!userId || userId === "undefined" || userId === "null") {
        window.location.href = "Login.html";
        return;
    }

    // פנייה לשרת ה-Node.js לקבלת המועדפים מה-Database
    fetch(`http://localhost:5000/api/favorites/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch favorite stations from server");
            }
            return response.json();
        })
        .then(stations => {
            container.innerHTML = "";

            if (!stations || stations.length === 0) {
                container.innerHTML = "<p class='no-favorites'>You haven't added any favorites yet. ❤️</p>";
                return;
            }

            stations.forEach(station => {
                const card = document.createElement("div");
                card.className = "station-display-card"; 

                let connectors = [];
                let amenities = [];

                try {
                    if (typeof station.connectors === 'string') {
                        if (station.connectors.trim().startsWith('[')) {
                            connectors = JSON.parse(station.connectors);
                        } else {
                            connectors = station.connectors.split(',').map(item => item.trim()).filter(Boolean);
                        }
                    } else if (Array.isArray(station.connectors)) {
                        connectors = station.connectors;
                    }
                } catch (e) {
                    connectors = station.connectors ? [station.connectors] : ["Type 2"];
                }

                try {
                    if (typeof station.amenities === 'string') {
                        if (station.amenities.trim().startsWith('[')) {
                            amenities = JSON.parse(station.amenities);
                        } else {
                            amenities = station.amenities.split(',').map(item => item.trim()).filter(Boolean);
                        }
                    } else if (Array.isArray(station.amenities)) {
                        amenities = station.amenities;
                    }
                } catch (e) {
                    amenities = station.amenities ? [station.amenities] : ["WiFi"];
                }

                const connectorsHTML = connectors
                    .map(connector => `<span class="tag-item">${connector}</span>`)
                    .join(' ');

                const amenitiesHTML = amenities
                    .map(amenity => `<span class="tag-item">${amenity}</span>`)
                    .join(' ');

                const availableSlots = station.available_slots !== undefined ? parseInt(station.available_slots) : 0;
                const totalSlots = station.total_slots !== undefined ? parseInt(station.total_slots) : 0;
                
                const isFull = availableSlots === 0;

                let statusColor = '#FFB300'; 
                
                if (availableSlots === 0) {
                    statusColor = '#E53935'; 
                } else if (availableSlots == totalSlots) {
                    statusColor = '#00B050'; 
                }

                card.innerHTML = `
                    <div class="station-card-header">
                        <h2 class="station-card-title">${station.name || 'Unknown Station'}</h2>
                        <span class="status-dot" style="background-color: ${statusColor};"></span>
                    </div>

                    <div class="station-card-body">
                        <div class="info-row-main">
                            <div class="info-block">
                                <span class="info-label">AVAILABLE</span>
                                <span class="info-value-strong">${availableSlots}/${totalSlots}</span>
                            </div>

                            <div class="info-block align-right">
                                <span class="info-label">POWER</span>
                                <span class="info-value-highlight">⚡ ${station.power || '50'}</span>
                            </div>
                        </div>

                        <div class="price-row">
                            <span class="price-icon">💲</span>
                            <span class="price-value">${station.price || '0.0'}</span>
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

                            <button class="btn-primary reserve-btn ${isFull ? 'disabled-btn' : ''}" type="button" ${isFull ? 'disabled' : ''}>
                                ${isFull ? '❌ Fully Booked' : '📅 Make a Reservation'}
                            </button>
                        </div>
                    </div>
                `;

                // קישור כפתור ההזמנה
                const reserveBtn = card.querySelector('.reserve-btn');
                const messageBox = card.querySelector('.station-message');

                reserveBtn.addEventListener('click', () => {
                    if (isFull) {
                        messageBox.textContent = `${station.name} is fully booked. Please choose another station.`;
                        messageBox.classList.remove('hidden');
                        return;
                    }

                    localStorage.setItem('selectedStationName', station.name);
                    localStorage.setItem('comingFrom', 'Favorites.html');
                    window.location.href = 'Reservation.html';
                });

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error loading favorite stations:", error);
            container.innerHTML = "<p class='error-message'>Error loading favorites. Please try again later.</p>";
        });
});