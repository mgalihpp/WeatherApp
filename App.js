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

// make group the day
const DAYS_OF_THE_WEEK = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"]
const calcDayWiseForecast = (hourlyForecast) => {
    let dayWiseForecast = new Map();
    for(let forecast of hourlyForecast) {
        const [date] = forecast.dt_txt.split(" ");
        const dayOfTheWeek = DAYS_OF_THE_WEEK[new Date(date).getDay()]
        console.log(dayOfTheWeek);
        if(dayWiseForecast.has(dayOfTheWeek)){
            let forecastForTheDay = dayWiseForecast.get(dayOfTheWeek);
            forecastForTheDay.push(forecast);
            dayWiseForecast.set(dayOfTheWeek, forecastForTheDay);
        }else {
            dayWiseForecast.set(dayOfTheWeek, [forecast]);
        }
    }
    console.log(dayWiseForecast);
    for (let [key, value] of dayWiseForecast) {
        let temp_min = Math.min(...Array.from(value, val => val.temp_min));
        let temp_max = Math.min(...Array.from(value, val => val.temp_max));
        
        dayWiseForecast.set(key, {temp_min, temp_max, icon: value.find(v=> v.icon).icon})
    }
    console.log(dayWiseForecast);
    return dayWiseForecast
}

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

const loadHourlyForecast = ({main: {temp: tempNow}, weather: [{icon: iconNow}]}, hourlyForecast) => {
    const timeFormat = Intl.DateTimeFormat("en-Us", {
        hour24:true, hour:"numeric"
    })
    let dataFor12Hours = hourlyForecast.slice(2, 14);
    const hourlyContainer = document.querySelector(".hourly-container");
    let InnerHTMLString = `
    <article>
    <h3 class="time">Sekarang</h3>
    <img class="icon" src="${iconUrl(iconNow)}" alt="" />
    <p class="hourly-temp">${formatTemp(tempNow)}</p>
    </article>`;

    for (let {temp, icon, dt_txt} of dataFor12Hours){
        InnerHTMLString += `
        <article>
            <h3 class="time">${timeFormat.format(new Date(dt_txt))}</h3>
            <img class="icon" src="${iconUrl(icon)}" alt="" />
            <p class="hourly-temp">${formatTemp(temp)}</p>
        </article>`
    }
    hourlyContainer.innerHTML = InnerHTMLString;
}

const loadFiveDayForecast = (hourlyForecast) => {
    console.log(hourlyForecast)
    const dayWiseForecast = calcDayWiseForecast(hourlyForecast);
    const container = document.querySelector(".five-day-forecast-container");
    let dayWiseInfo = "";
    Array.from(dayWiseForecast).map(([day, {temp_max, temp_min, icon}], index) => {
        
        if(index <5) {
            dayWiseInfo += `
            <article class="day-wise-forecast">
            <h3 class="day">${index === 0? "Hari Ini": day}</h3>
            <img class="icon" src="${iconUrl(icon)}" alt="" />
        <p class="min-temp">${formatTemp(temp_min)}</p>
        <p class="max-temp">${formatTemp(temp_max)}</p>
      </article>`;
    }
    });
    container.innerHTML = dayWiseInfo;
}

// make load data end

// render data
document.addEventListener("DOMContentLoaded", async () => {
    const currentWeather = await getCurrentWeatherData();
    const hourlyForecast = await getHourlyForecast(currentWeather);
    // load 
    loadCurrentForecast(currentWeather);
    loadHourlyForecast(currentWeather, hourlyForecast);
    loadFiveDayForecast(hourlyForecast);
})
// render data end