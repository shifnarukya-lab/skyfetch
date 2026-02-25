const API_KEY = "e7ee2695e33add918e7f9d4a750dd972";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");

// =============================
// Get Weather (Async/Await)
// =============================
async function getWeather(city) {

    showLoading();

    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        displayWeather(response.data);

    } catch (error) {

        if (error.response && error.response.status === 404) {
            showError("City not found. Please check spelling and try again.");
        } else {
            showError("Something went wrong. Please try again later.");
        }

    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "🔍 Search";
    }
}

// =============================
// Display Weather
// =============================
function displayWeather(data) {

    const weatherHTML = `
        <div class="weather-card">
            <h2>${data.name}, ${data.sys.country}</h2>
            <div class="temperature">${Math.round(data.main.temp)}°C</div>
            <p><strong>Condition:</strong> ${data.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        </div>
    `;

    weatherDisplay.innerHTML = weatherHTML;

    cityInput.focus();
}

// =============================
// Show Loading
// =============================
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Fetching weather data...</p>
        </div>
    `;
}

// =============================
// Show Error
// =============================
function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error-message">
            ❌ <strong>Error:</strong> ${message}
        </div>
    `;
}

// =============================
// Event Listeners
// =============================

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    if (city.length < 2) {
        showError("City name must be at least 2 characters.");
        return;
    }

    getWeather(city);
    cityInput.value = "";
});

cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});