document.addEventListener('DOMContentLoaded', () => {

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    const stationName = localStorage.getItem('selectedStationName');
        if (stationName) {
            const formTitle = document.getElementById('form-title');
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
    const form = document.getElementById('reservation-form');    
    if(!form)
        return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const fullName = document.getElementById('full-name').value.trim();
        const email = document.getElementById("email").value.trim();
        const  time = document.getElementById('arrival-time').value;
        const phone = document.getElementById('phone').value.trim();
        const carModel = document.getElementById('car-type').value;
        const connectorType = document.getElementById('connector-type').value;

        const namePattern = /^[a-zA-Z\s]+$/;
        if (!namePattern.test(fullName)) {
            alert('Please enter a valid full name (letters and spaces only).');
                return;
        }
        const phonePattern = /^[0-9]{9,10}$/;
        if(!phonePattern.test(phone)) {
            alert('Please enter a valid phone number (9-10 digits only).');
                return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
                return;
        }
        if (!time) {
            alert('Please select an arrival time.');
                return;
        }
        if (!carModel) {
            alert('Please select a car model.');
                return;
        }
        if (!connectorType) {
            alert('Please select a connector type.');
                return;
        }


    const mainContent = document.querySelector('.main-content');

    mainContent.innerHTML = `
        <div class="welcome-section" style="text-align: center; background-color: #2170FF; color: white; padding: 40px; border-radius: 15px; margin-top: 30px;">
        <h1>🎉 Reservation Confirmed!</h1>

        <p>Thank you, <strong>${fullName}</strong>. Your spot has been successfully booked.</p>

        <p style="margin-top: 10px;">
            Your reservation time: <strong>${time}</strong>
        </p>

        <p style="margin-top: 10px; font-size: 0.9em;">
            A confirmation email was sent to: ${email}
        </p>

        <button class="back-btn" onclick="location.href='MainMenu.html'" style="margin-top: 25px; background-color: white; color: #2170FF; padding: 10px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
            Back to Main Menu
        </button>
    </div>
    `;
  });

});