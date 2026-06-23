document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    const backBtn = document.getElementById("back-stations-btn");
    const form = document.getElementById("reservation-form");

    const fullNameInput = document.getElementById("full-name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const dateInput = document.getElementById("arrival-date");
    const timeInput = document.getElementById("arrival-time");
    const carTypeSelect = document.getElementById("car-type");
    const connectorSelect = document.getElementById("connector-type");

    const stationName = localStorage.getItem("selectedStationName");
    const stationId = localStorage.getItem("selectedStationId");
    const userId = localStorage.getItem("userId");

    if (!userId || userId === "undefined" || userId === "null") {
        alert("Please log in before making a reservation.");
        window.location.href = "Login.html";
        return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (dateInput) {
        dateInput.min = today;
    }

    fetch(`${API_URL}/api/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            fullNameInput.value = user.full_name || "";
            emailInput.value = user.email || "";
            phoneInput.value = user.phone || "";

            fullNameInput.readOnly = true;
            emailInput.readOnly = true;
            phoneInput.readOnly = true;

            if (carTypeSelect && user.car_model) {
                carTypeSelect.value = user.car_model;
            }
        })
        .catch(error => {
            console.error("Error loading user data:", error);
            alert("Failed to load user details. Please login again.");
            window.location.href = "Login.html";
        });

    if (backBtn) {
        const comingFrom = localStorage.getItem("comingFrom");

        if (comingFrom === "Favorites.html") {
            backBtn.innerHTML = "&#9664; Back to favorites";
        } else if (comingFrom === "map") {
            backBtn.innerHTML = "&#9664; Back to Map View";
        } else {
            backBtn.innerHTML = "&#9664; Back to Nearby Stations";
        }

        backBtn.addEventListener("click", () => {
            if (comingFrom === "Favorites.html") {
                localStorage.removeItem("comingFrom");
                window.location.href = "Favorites.html";
            } else if (comingFrom === "map") {
                localStorage.removeItem("comingFrom");
                window.location.href = "MapView.html";
            } else {
                window.location.href = "NearbyStations.html";
            }
        });
    }

    if (stationName) {
        const formTitle = document.getElementById("form-title");

        if (formTitle) {
            formTitle.textContent = `Reservation to ${stationName}`;
        }
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

    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const arrivalDate = dateInput.value;
        const arrivalTime = timeInput.value;
        const carModel = carTypeSelect.value;
        const connectorType = connectorSelect.value;

        if (!stationId || stationId === "undefined" || stationId === "null") {
            alert("Station was not selected correctly. Please choose a station again.");
            window.location.href = "NearbyStations.html";
            return;
        }

        if (!arrivalDate) {
            alert("Please select an arrival date.");
            return;
        }

        if (!arrivalTime) {
            alert("Please select an arrival time.");
            return;
        }

        const now = new Date();
        const selectedDateTime = new Date(`${arrivalDate}T${arrivalTime}`);

        if (selectedDateTime <= now) {
            alert("Please choose a future date and time.");
            return;
        }

        if (!connectorType) {
            alert("Please select a connector type.");
            return;
        }

        if (!carModel) {
            alert("Please select a car model.");
            return;
        }

        fetch(`${API_URL}/api/reservations/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                station_id: stationId,
                full_name: fullName,
                email: email,
                phone: phone,
                arrival_date: arrivalDate,
                arrival_time: arrivalTime,
                car_model: carModel,
                connector_type: connectorType
            })
        })
            .then(response => response.json())
            .then(data => {
                if (!data.reservationId && !data.reservation_id && !data.message?.includes("success")) {
                    alert(data.message || "Failed to create reservation.");
                    return;
                }

                const mainContent = document.querySelector(".main-content");

                mainContent.innerHTML = `
                    <div class="welcome-section" style="text-align: center; background-color: #2170FF; color: white; padding: 40px; border-radius: 15px; margin-top: 30px;">
                        <h1>🎉 Reservation Confirmed!</h1>
                        <p>Thank you, <strong>${fullName}</strong>. Your spot has been successfully booked.</p>
                        <p style="margin-top: 10px;">Station: <strong>${stationName || "Selected Station"}</strong></p>
                        <p style="margin-top: 10px;">Date: <strong>${arrivalDate}</strong></p>
                        <p style="margin-top: 10px;">Time: <strong>${arrivalTime}</strong></p>
                        <p style="margin-top: 10px;">Car: <strong>${carModel}</strong></p>
                        <p style="margin-top: 10px;">Connector: <strong>${connectorType}</strong></p>
                        <p style="margin-top: 10px; font-size: 0.9em;">A confirmation email was sent to: ${email}</p>

                        <button class="back-btn" id="back-main-after-reservation" style="margin-top: 25px; background-color: white; color: #2170FF; padding: 10px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                            Back to Main Menu
                        </button>
                    </div>
                `;

                const backMainBtn = document.getElementById("back-main-after-reservation");

                if (backMainBtn) {
                    backMainBtn.addEventListener("click", () => {
                        window.location.href = "MainMenu.html";
                    });
                }
            })
            .catch(error => {
                console.error("Reservation error:", error);
                alert("Server error. Please try again later.");
            });
    });
});