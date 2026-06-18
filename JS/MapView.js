document.addEventListener("DOMContentLoaded", () => {
    const backBtn = document.getElementById("back-main-btn");
    const reserveBtn = document.getElementById("map-reserve-btn");

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

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "MainMenu.html";
        });
    }

    const map = L.map("leaflet-map").setView([31.8, 35.0], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap"
    }).addTo(map);

    fetch("./data/Stations.json")
        .then(response => response.json())
        .then(stations => {
            stationsData = addCoordinatesToStations(stations);

            stationsData.forEach(station => {
                const status = getStationStatus(station);

                const icon = L.divIcon({
                    className: "",
                    html: `<div class="custom-marker marker-${status}">⚡</div>`,
                    iconSize: [42, 42],
                    iconAnchor: [21, 21]
                });

                const marker = L.marker([station.lat, station.lng], { icon }).addTo(map);

                marker.on("click", () => {
                    selectStation(station);
                });

                markerObjects.push({
                    marker,
                    station,
                    status
                });
            });

            if (searchInput) {
                searchInput.addEventListener("input", filterStations);
            }

            if (statusFilter) {
                statusFilter.addEventListener("change", filterStations);
            }
        })
        .catch(error => {
            console.error("Error loading map stations:", error);
        });

    function addCoordinatesToStations(stations) {
        return stations.map(station => {
            const coordinates = {
                "Haifa": { lat: 32.7940, lng: 34.9896 },
                "Tel Aviv City Center": { lat: 32.0853, lng: 34.7818 },
                "Modiin Maccabim Reut": { lat: 31.8996, lng: 35.0083 },
                "Jerusalem Central": { lat: 31.7683, lng: 35.2137 },
                "Eilat Beachfront": { lat: 29.5577, lng: 34.9519 }
            };

            return {
                ...station,
                lat: coordinates[station.name].lat,
                lng: coordinates[station.name].lng
            };
        });
    }

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

            localStorage.setItem("selectedStationName", selectedStation.name);
            window.location.href = "Reservation.html";
        });
    }
});