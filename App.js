const API_KEY = "78e6e7cc4debbb107ac22d94b22de759";
const formatTemp = (temp) => `${temp?.toFixed(1)}°`;
const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

// get data
const getCurrentWeatherData = async () => {
    const city = 'jakarta';
    const respone = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    return respone.json();
} 

const getHourlyForecast = async ({name: city}) => {
    const respone = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
    const data = await respone.json();
    return data.list.map(forecast => {
        const {main: {temp, temp_max, temp_min}, dt, dt_txt, weather: [{ description, icon}]} = forecast;
        return {temp, temp_max, temp_min, dt, dt_txt, description, icon};
    })
}
// get data end

// make load data
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
    humidity_container.querySelector(".temp").textContent = `${humidity} %`;
}

const loadHourlyForecast = (hourlyForecast) => {
    let dataFor12Hours = hourlyForecast.slice(1, 13);
    const hourlyContainer = document.querySelector(".hourly-container");
    let InnerHTMLString = ``;

    for (let {temp, icon, dt_txt} of dataFor12Hours){
        InnerHTMLString += `
        <article>
            <h3 class="time">${dt_txt.split(" ")[1]}</h3>
            <img class="icon" src="${iconUrl(icon)}" alt="" />
            <p class="hourly-temp">${formatTemp(temp)}</p>
        </article>`
    }
    hourlyContainer.innerHTML = InnerHTMLString;
}

// make load data end

// render data
document.addEventListener("DOMContentLoaded", async () => {
    const currentWeather = await getCurrentWeatherData();
    const hourlyForecast = await getHourlyForecast(currentWeather);
    // load 
    loadCurrentForecast(currentWeather);
    loadHourlyForecast(hourlyForecast);
})
// render data end