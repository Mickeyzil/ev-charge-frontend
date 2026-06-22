document.addEventListener('DOMContentLoaded', () => {
    const backMainBtn = document.getElementById("back-main-btn");

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    if (backMainBtn) {
        backMainBtn.addEventListener("click", () => {
            window.location.href = "MainMenu.html";
        });
    }

    // פנייה לשרת בפורט 5000 כפי שביקשת
    fetch('http://localhost:5000/api/stations')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('stations-container');
            if (!container) return;
            container.innerHTML = '';

            data.forEach(station => {
                const card = document.createElement('div');
                card.className = 'station-display-card';

                const connectorsHTML = station.connectors.map(c => `<span class="tag-item">${c}</span>`).join(' ');
                const amenitiesHTML = station.amenities.map(a => `<span class="tag-item">${a}</span>`).join(' ');
                const isFull = station.available[0] === '0';

                card.innerHTML = `
                    <div class="station-card-header">
                        <h2 class="station-card-title">${station.name}</h2>
                        <span class="status-dot" style="background-color: ${station.statusColor};"></span>
                    </div>
                    <div class="station-card-body">
                        <div class="info-row-main">
                            <div class="info-block"><span class="info-label">AVAILABLE</span><span class="info-value-strong">${station.available}</span></div>
                            <div class="info-block align-right"><span class="info-label">POWER</span><span class="info-value-highlight">⚡ ${station.power}</span></div>
                        </div>
                        <div class="price-row"><span class="price-icon">💲</span><span class="price-value">${station.price}</span></div>
                        <div class="spec-row"><span class="spec-icon">🔌</span><div class="tags-container">${connectorsHTML}</div></div>
                        <div class="spec-row"><span class="spec-icon">📶</span><div class="tags-container">${amenitiesHTML}</div></div>
                        <p class="station-message hidden"></p>
                        <div class="card-actions">
                            <button class="btn-secondary favorite-btn" type="button">❤️ Add to Favorites</button>
                            <button class="btn-primary reserve-btn ${isFull ? 'disabled-btn' : ''}" type="button" ${isFull ? 'disabled' : ''}>
                                ${isFull ? '❌ Fully Booked' : '📅 Make a Reservation'}
                            </button>
                        </div>
                    </div>
                `;

                const reserveBtn = card.querySelector('.reserve-btn');
                const favoriteBtn = card.querySelector('.favorite-btn');
                const messageBox = card.querySelector('.station-message');

                // לוגיקת הזמנה
                reserveBtn.addEventListener('click', () => {
                    localStorage.setItem('selectedStationName', station.name);
                    window.location.href = 'Reservation.html';
                });

                // לוגיקת מועדפים מתוקנת
                // לוגיקת מועדפים מתוקנת
                favoriteBtn.addEventListener('click', () => {
                    const userId = localStorage.getItem("userId");
                    if (!userId) {
                        messageBox.textContent = "You must be logged in!";
                        messageBox.classList.remove('hidden');
                        return;
                    }

                    fetch('http://localhost:5000/api/favorites/add', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id: userId,
                            station_id: station.station_id
                        })
                    })
                        .then(async response => {
                            const data = await response.json(); // הפיכת התשובה ל-JSON

                            if (!response.ok) {
                                // אם השרת החזיר שגיאה (למשל 400), נזרוק אותה עם ההודעה מהשרת
                                throw new Error(data.message || "Failed to add to favorites");
                            }
                            return data; // אם הצליח, נחזיר את הנתונים
                        })
                        .then(data => {
                            // הצלחה
                            messageBox.textContent = `⭐ ${data.message || 'Added to favorites!'}`;
                            messageBox.classList.remove('hidden');
                            messageBox.style.color = "green";
                            favoriteBtn.disabled = true;
                            favoriteBtn.textContent = "❤️ Already in Favorites";
                        })
                        .catch(err => {
                            // כאן נתפוס את השגיאה (למשל 'Station already in favorites')
                            messageBox.textContent = err.message;
                            messageBox.classList.remove('hidden');
                            messageBox.style.color = "red"; // נציג את השגיאה באדום

                            // אופציונלי: אם זה כבר במועדפים, אפשר לבטל את הכפתור בכל זאת
                            if (err.message === 'Station already in favorites') {
                                favoriteBtn.disabled = true;
                                favoriteBtn.textContent = "❤️ Already in Favorites";
                            }
                        });
                });
                container.appendChild(card);
            });
        });
});