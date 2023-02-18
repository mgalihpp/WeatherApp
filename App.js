const API_KEY = "78e6e7cc4debbb107ac22d94b22de759";

// data
const getCurrentWeatherData = async () => {
    const city = 'jakarta';
    const respone = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    return respone.json();
} 

const formatTemp = (temp) => `${temp?.toFixed(1)}°`;
const iconUrl = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`;

const loadCurrentForecast = ({ name, main: {temp, temp_min, temp_max, feels_like, humidity}, weather: [{ description, icon }]}) => {
    const currentForecastElement = document.querySelector("#current-forecast");
    const feels_like_container = document.querySelector("#feels-like");
    const humidity_container = document.querySelector("#humidity");
    
    // current forecast
    currentForecastElement.querySelector(".city").textContent = name;
    currentForecastElement.querySelector(".temp").textContent = formatTemp(temp);
    currentForecastElement.querySelector(".description").textContent = description;
    currentForecastElement.querySelector(".min-max-temp").textContent = `H: ${formatTemp(temp_max)} L:${formatTemp(temp_min)}`;
    currentForecastElement.querySelector(".icon").src = iconUrl(icon);

    // feels_like

    feels_like_container.querySelector(".temp").textContent = formatTemp(feels_like);

    // humidity 
    humidity_container.querySelector(".temp").textContent = `${humidity} %`
} 

document.addEventListener("DOMContentLoaded", async () => {
    const currentWeather = await getCurrentWeatherData();

    // load 

    loadCurrentForecast(currentWeather);
})