const API_KEY = "d503c866eb7afee32d6265eee3a2eeba"; 

const iconMap = {
    "01d": "wi-day-sunny",
    "01n": "wi-night-clear",
    "02d": "wi-day-cloudy",
    "02n": "wi-night-alt-cloudy",
    "03d": "wi-cloud",
    "03n": "wi-cloud",
    "04d": "wi-cloudy",
    "04n": "wi-cloudy",
    "09d": "wi-showers",
    "09n": "wi-showers",
    "10d": "wi-day-rain",
    "10n": "wi-night-alt-rain",
    "11d": "wi-thunderstorm",
    "11n": "wi-thunderstorm",
    "13d": "wi-snow",
    "13n": "wi-snow",
    "50d": "wi-fog",
    "50n": "wi-fog"
};

function fetchWeather() {
    const city = document.getElementById("city").value;

    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            updateTodayWeather(data);
            fetchForecast(data.coord.lat, data.coord.lon);
        })
        .catch(error => alert("City not found or API error"));
}

function updateTodayWeather(data) {
    const today = new Date().toISOString().split("T")[0];
    const iconClass = iconMap[data.weather[0].icon] || "wi-na";

    document.getElementById("city-date").innerText = `${data.name} (${today})`;
    const tempCelsius = data.main.temp - 273.15;
    document.getElementById("temperature").innerText = `Temperature: ${tempCelsius.toFixed(2)}°C`;
    document.getElementById("wind").innerText = `Wind: ${data.wind.speed} M/S`;
    document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    document.getElementById("condition").innerHTML = `
    <i class="wi ${iconClass}" style="font-size: 48px;"></i>
    <span style="display:block;">${data.weather[0].description}</span>
`;
}

function fetchForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=32&appid=${API_KEY}&units=metric`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => updateForecast(data.list))
        .catch(error => console.error("Forecast fetch error", error));
}

function updateForecast(forecastList) {
    const forecastDays = [7, 15, 23, 31];
    for (let i = 0; i < 4; i++) {
        const dayData = forecastList[forecastDays[i]];
        const iconClass = iconMap[dayData.weather[0].icon] || "wi-na";
        const card = document.getElementById(`forecast-day-${i + 1}`);

        card.innerHTML = `
            <h4>${dayData.dt_txt.split(" ")[0]}</h4>
            <i class="wi ${iconClass}" style="font-size: 36px;"></i>
            <p>Temp: ${dayData.main.temp}°C</p>
            <p>Wind: ${dayData.wind.speed} M/S</p>
            <p>Humidity: ${dayData.main.humidity}%</p>
        `;
    }
}

function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function fetchWeatherByCoords(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            updateTodayWeather(data);
            fetchForecast(lat, lon);
        })
        .catch(error => alert("Location fetch error"));
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
