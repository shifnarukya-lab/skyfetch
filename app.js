// ==============================
// WeatherApp Constructor
// ==============================

function WeatherApp(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = "https://api.openweathermap.org/data/2.5/weather";
    this.forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

    this.searchBtn = document.getElementById("search-btn");
    this.cityInput = document.getElementById("city-input");
    this.weatherDisplay = document.getElementById("weather-display");

    this.init();
}

// ==============================
// Initialize App
// ==============================

WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
    this.showWelcome();
};

// ==============================
// Welcome Message
// ==============================

WeatherApp.prototype.showWelcome = function () {
    this.weatherDisplay.innerHTML = `
        <div class="weather-card">
            <h2>Welcome to SkyFetch 🌤️</h2>
            <p>Search for a city to see current weather and 5-day forecast.</p>
        </div>
    `;
};

// ==============================
// Handle Search
// ==============================

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("Please enter a city name.");
        return;
    }

    this.getWeather(city);
};

// ==============================
// Fetch Weather + Forecast
// ==============================

WeatherApp.prototype.getWeather = async function (city) {
    try {
        this.showLoading();

        const weatherPromise = fetch(
            `${this.apiUrl}?q=${city}&units=metric&appid=${this.apiKey}`
        );

        const forecastPromise = fetch(
            `${this.forecastUrl}?q=${city}&units=metric&appid=${this.apiKey}`
        );

        const [weatherRes, forecastRes] = await Promise.all([
            weatherPromise,
            forecastPromise,
        ]);

        if (!weatherRes.ok || !forecastRes.ok) {
            throw new Error("City not found.");
        }

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        this.displayWeather(weatherData);
        const processedForecast = this.processForecastData(forecastData.list);
        this.displayForecast(processedForecast);

    } catch (error) {
        this.showError(error.message);
    }
};

// ==============================
// Process Forecast (Get 5 days at 12:00)
// ==============================

WeatherApp.prototype.processForecastData = function (forecastList) {
    const dailyForecasts = forecastList.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    return dailyForecasts.slice(0, 5);
};

// ==============================
// Display Current Weather
// ==============================

WeatherApp.prototype.displayWeather = function (data) {
    const icon = data.weather[0].icon;

    this.weatherDisplay.innerHTML = `
        <div class="weather-card">
            <h2>${data.name}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" />
            <h3>${data.main.temp}°C</h3>
            <p>${data.weather[0].description}</p>
        </div>
        <h3>5-Day Forecast</h3>
        <div class="forecast-container" id="forecast-container"></div>
    `;
};

// ==============================
// Display Forecast Cards
// ==============================

WeatherApp.prototype.displayForecast = function (forecastData) {
    const container = document.getElementById("forecast-container");

    forecastData.forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        container.innerHTML += `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
                <p>${day.main.temp}°C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    });
};

// ==============================
// Loading State
// ==============================

WeatherApp.prototype.showLoading = function () {
    this.weatherDisplay.innerHTML = `
        <div class="loading">
            <p>Loading weather data...</p>
        </div>
    `;
};

// ==============================
// Error Handling
// ==============================

WeatherApp.prototype.showError = function (message) {
    this.weatherDisplay.innerHTML = `
        <div class="error">
            <p>${message}</p>
        </div>
    `;
};

// ==============================
// Create App Instance
// ==============================

const app = new WeatherApp("e7ee2695e33add918e7f9d4a750dd972");