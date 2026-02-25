function WeatherApp() {
  this.apiKey = "e7ee2695e33add918e7f9d4a750dd972";
  this.baseURL = "https://api.openweathermap.org/data/2.5/";

  this.cityInput = document.getElementById("cityInput");
  this.searchBtn = document.getElementById("searchBtn");
  this.weatherDisplay = document.getElementById("weatherDisplay");
  this.forecastContainer = document.getElementById("forecast");
  this.recentContainer = document.getElementById("recentSearches");
  this.clearBtn = document.getElementById("clearHistory");

  this.recentSearches = [];

  this.init();
}

WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", () => {
    const city = this.cityInput.value.trim();
    if (city) this.getWeather(city);
  });

  this.loadRecentSearches();
  this.loadLastCity();

  this.clearBtn.addEventListener("click", () => {
    this.clearHistory();
  });
};

WeatherApp.prototype.getWeather = async function (city) {
  try {
    this.weatherDisplay.innerHTML = "<p>Loading...</p>";

    const weatherRes = await fetch(
      `${this.baseURL}weather?q=${city}&appid=${this.apiKey}&units=metric`
    );
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200) {
      throw new Error(weatherData.message);
    }

    const forecastRes = await fetch(
      `${this.baseURL}forecast?q=${city}&appid=${this.apiKey}&units=metric`
    );
    const forecastData = await forecastRes.json();

    this.displayWeather(weatherData);
    this.displayForecast(forecastData);

    this.saveRecentSearch(city);
    localStorage.setItem("lastCity", city);
  } catch (error) {
    this.weatherDisplay.innerHTML = `<p>Error: ${error.message}</p>`;
  }
};

WeatherApp.prototype.displayWeather = function (data) {
  this.weatherDisplay.innerHTML = `
    <h2>${data.name}</h2>
    <p>${data.weather[0].description}</p>
    <h3>${data.main.temp} °C</h3>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
  `;
};

WeatherApp.prototype.displayForecast = function (data) {
  this.forecastContainer.innerHTML = "";

  const dailyData = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.slice(0, 5).forEach(day => {
    const card = document.createElement("div");
    card.classList.add("forecast-card");

    card.innerHTML = `
      <p>${new Date(day.dt_txt).toDateString()}</p>
      <p>${day.main.temp} °C</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
    `;

    this.forecastContainer.appendChild(card);
  });
};

WeatherApp.prototype.saveRecentSearch = function (city) {
  city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  this.recentSearches = this.recentSearches.filter(
    c => c.toLowerCase() !== city.toLowerCase()
  );

  this.recentSearches.unshift(city);

  if (this.recentSearches.length > 5) {
    this.recentSearches.pop();
  }

  localStorage.setItem(
    "recentSearches",
    JSON.stringify(this.recentSearches)
  );

  this.displayRecentSearches();
};

WeatherApp.prototype.loadRecentSearches = function () {
  const stored = localStorage.getItem("recentSearches");
  if (stored) {
    this.recentSearches = JSON.parse(stored);
    this.displayRecentSearches();
  }
};

WeatherApp.prototype.displayRecentSearches = function () {
  this.recentContainer.innerHTML = "";

  this.recentSearches.forEach(city => {
    const btn = document.createElement("button");
    btn.textContent = city;

    btn.addEventListener("click", () => {
      this.getWeather(city);
    });

    this.recentContainer.appendChild(btn);
  });
};

WeatherApp.prototype.loadLastCity = function () {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    this.getWeather(lastCity);
  }
};

WeatherApp.prototype.clearHistory = function () {
  localStorage.removeItem("recentSearches");
  localStorage.removeItem("lastCity");
  this.recentSearches = [];
  this.recentContainer.innerHTML = "";
};

new WeatherApp();