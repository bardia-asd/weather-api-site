const WEATHER_API_KEY = "1f0e8218104847a2aea180227253108";
const baseURL = "http://api.weatherapi.com/v1";

const placeholder = document.getElementById("placeholder");
const weatherContainer = document.getElementById("weather-container");
const errorContainer = document.getElementById("error-message");
const form = document.getElementById("weather-form");
const searchInput = document.getElementById("search-city");
const submitBtn = document.getElementById("submit-btn");
const cityNameElem = document.getElementById("city-name");
const cityLocationElem = document.getElementById("location");
const dateElem = document.getElementById("date-time");
const iconElem = document.getElementById("weather-icon");
const temperatureElem = document.getElementById("temperature");
const conditionElem = document.getElementById("weather-condition");
const feelsLikeElem = document.getElementById("feels-like");
const windSpeedElem = document.getElementById("wind-speed");
const humidityElem = document.getElementById("humidity");
const pressureElem = document.getElementById("pressure");
const cloudElem = document.getElementById("cloud-cover");
const uvIndexElem = document.getElementById("UV");
console.log(weatherContainer)

submitBtn.disabled = true;

async function fetchCurrentWeather() {
    const city = searchInput.value.trim().toLowerCase();
    if (!city) return;

    try {
        const res = await fetch(
            `${baseURL}/current.json?key=${WEATHER_API_KEY}&q=${city}`
        );

        if (!res.ok) throw new Error("City not found");

        const weatherData = await res.json();
        updateWeatherUI(weatherData);

        showWeather();
    } catch (err) {
        showError()
    }
}

function updateWeatherUI(weatherObj) {
    const { country, name, localtime } = weatherObj.location;
    const {
        condition,
        temp_c,
        feelslike_c,
        wind_kph,
        humidity,
        pressure_mb,
        cloud,
        uv,
    } = weatherObj.current;

    cityNameElem.textContent = name;
    cityLocationElem.textContent = `${name}, ${country}`;
    dateElem.textContent = formatLocalTime(localtime);
    iconElem.setAttribute("src", condition.icon);
    iconElem.setAttribute("alt", condition.text);
    temperatureElem.textContent = `${temp_c.toFixed(0)}°C`;
    conditionElem.textContent = condition.text;
    feelsLikeElem.textContent = `Feels like ${feelslike_c.toFixed(0)}°C`;
    windSpeedElem.textContent = `${wind_kph} km/h`;
    humidityElem.textContent = `${humidity}%`;
    pressureElem.textContent = `${pressure_mb} mb`;
    cloudElem.textContent = `${cloud}%`;
    uvIndexElem.textContent = uv;
}

function formatLocalTime(localtime) {
    const dateObj = new Date(localtime.replace(" ", "T"));
    if (isNaN(dateObj)) return localtime; // fallback
    return dateObj.toLocaleString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    });
}

function showWeather() {
    placeholder.classList.add("hidden");
    weatherContainer.classList.remove("hidden");
    weatherContainer.classList.add("block");
    errorContainer.classList.add("hidden");
}

function showError() {
    placeholder.classList.add("hidden");
    weatherContainer.classList.add("hidden");
    errorContainer.classList.remove("hidden");
    errorContainer.classList.add("flex");
}

searchInput.addEventListener("input", (e) => {
    if (searchInput.value.trim() !== "") {
        submitBtn.disabled = false; // Enable if there is text
    } else {
        submitBtn.disabled = true; // Disable if empty
    }
});
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        fetchCurrentWeather();
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchCurrentWeather();
});
