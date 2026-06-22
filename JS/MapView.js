document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    const backBtn = document.getElementById("back-main-btn");
    const reserveBtn = document.getElementById("map-reserve-btn");
    const favoriteBtn = document.getElementById("map-favorite-btn"); 

    const searchInput = document.getElementById("map-search");
    const statusFilter = document.getElementById("status-filter");

    const stationName = document.getElementById("station-name");
    const stationDetails = document.getElementById("station-details");
    const stationAvailable = document.getElementById("station-available");
    const stationPower = document.getElementById("station-power");
    const stationPrice = document.getElementById("station-price");

    let selectedStation = null;
    let stationsData = [];
    let markerObjects = [];
    let userFavorites = []; 

    const userId = localStorage.getItem("userId");

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "MainMenu.html";
        });
    }

    // אתחול המפה על מרכז הארץ
    const map = L.map("leaflet-map").setView([31.8, 35.0], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap"
    }).addTo(map);

    // טעינת המועדפים מהשרת
    if (userId) {
        fetch(`${API_URL}/api/favorites/${userId}`)
            .then(res => res.json())
            .then(favorites => {
                userFavorites = favorites.map(fav => fav.favorite_id);
            })
            .catch(err => console.error("Error loading user favorites:", err));
    }

    // משיכת כל התחנות להצגה על המפה
    fetch(`${API_URL}/api/stations`)
        .then(response => response.json())
        .then(stations => {
            stationsData = stations; 

            stationsData.forEach(station => {
                const status = getStationStatus(station);

                const icon = L.divIcon({
                    className: "",
                    html: `<div class="custom-marker marker-${status}">⚡</div>`,
                    iconSize: [42, 42],
                    iconAnchor: [21, 21]
                });

                if (station.latitude && station.longitude) {
                    const marker = L.marker([station.latitude, station.longitude], { icon }).addTo(map);

                    marker.on("click", () => {
                        selectStation(station);
                    });

                    markerObjects.push({
                        marker,
                        station,
                        status
                    });
                }
            });

            if (searchInput) {
                searchInput.addEventListener("input", filterStations);
            }

            if (statusFilter) {
                statusFilter.addEventListener("change", filterStations);
            }
        })
        .catch(error => {
            console.error("Error loading map stations from server:", error);
        });

    function getStationStatus(station) {
        const parts = station.available.split("/");
        const available = Number(parts[0]);
        const total = Number(parts[1]);

        if (available === 0) {
            return "full";
        }
        if (available < total) {
            return "partial";
        }
        return "available";
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

    // פונקציית בחירת תחנה מהמפה
    function selectStation(station) {
        selectedStation = station;

        stationName.textContent = station.name;
        stationDetails.textContent = `${station.connectors.join(", ")} · ${station.amenities.join(", ")}`;
        stationAvailable.textContent = station.available;
        stationPower.textContent = station.power;
        stationPrice.textContent = station.price;

        const isFull = station.available.startsWith("0");
        reserveBtn.disabled = isFull;
        reserveBtn.textContent = isFull ? "Fully Booked" : "Make a Reservation";

        // עדכון דינמי של כפתור המועדפים בהתאם לתחנה שנבחרה
        if (userFavorites.includes(station.station_id)) {
            favoriteBtn.innerHTML = "⭐ Remove from Favorites";
            favoriteBtn.classList.add("active");
        } else {
            favoriteBtn.innerHTML = "☆ Add to Favorites";
            favoriteBtn.classList.remove("active");
        }
    }

    function filterStations() {
        const searchValue = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;

        markerObjects.forEach(item => {
            const matchesSearch = item.station.name.toLowerCase().includes(searchValue);
            const matchesStatus = statusValue === "all" || item.status === statusValue;

            if (matchesSearch && matchesStatus) {
                item.marker.addTo(map);
            } else {
                map.removeLayer(item.marker);
            }
        });
    }

    if (reserveBtn) {
        reserveBtn.addEventListener("click", () => {
            if (!selectedStation) return;

            localStorage.setItem("selectedStationId", selectedStation.station_id);
            localStorage.setItem("selectedStationName", selectedStation.name);
            localStorage.setItem("comingFrom", "map");
            
            window.location.href = "Reservation.html";
        });
    }

    // 🌟 הטיפול בכפתור המועדפים ללא שום alert() 
    if (favoriteBtn) {
        favoriteBtn.addEventListener("click", () => {
            if (!selectedStation) return;
            
            // 1. הגנה במקרה שהמשתמש לא מחובר - שינוי זמני של מראה הכפתור
            if (!userId) {
                const originalHtml = favoriteBtn.innerHTML;
                favoriteBtn.innerHTML = "⚠️ Please Log In First";
                favoriteBtn.style.color = "#D32F2F";
                favoriteBtn.style.borderColor = "#D32F2F";
                
                setTimeout(() => {
                    favoriteBtn.innerHTML = originalHtml;
                    favoriteBtn.style.color = "";
                    favoriteBtn.style.borderColor = "";
                }, 2500);
                return;
            }

            const isAlreadyFavorite = userFavorites.includes(selectedStation.station_id);
            
            const targetUrl = isAlreadyFavorite 
                ? `${API_URL}/api/favorites/remove` 
                : `${API_URL}/api/favorites/add`;
                
            const targetMethod = isAlreadyFavorite ? "DELETE" : "POST";

            fetch(targetUrl, {
                method: targetMethod,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, station_id: selectedStation.station_id })
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Server responded with status ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (isAlreadyFavorite) {
                    userFavorites = userFavorites.filter(id => id !== selectedStation.station_id);
                    favoriteBtn.innerHTML = "☆ Add to Favorites";
                    favoriteBtn.classList.remove("active");
                } else {
                    userFavorites.push(selectedStation.station_id);
                    favoriteBtn.innerHTML = "⭐ Remove from Favorites";
                    favoriteBtn.classList.add("active");
                }
            })
            .catch(err => {
                console.error("Error updating favorites:", err);
                
                // 2. הגנה במקרה של שגיאת תקשורת/שרת - חיווי אדום זמני על הכפתור
                const originalHtml = favoriteBtn.innerHTML;
                favoriteBtn.innerHTML = "⚠️ Connection Error";
                favoriteBtn.style.color = "#D32F2F";
                favoriteBtn.style.borderColor = "#D32F2F";
                
                setTimeout(() => {
                    favoriteBtn.innerHTML = originalHtml;
                    favoriteBtn.style.color = "";
                    favoriteBtn.style.borderColor = "";
                }, 2500);
            });
        });
    }
});