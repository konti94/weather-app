const cities = ['Budapest', 'Győr', 'Debrecen', 'Miskolc', 'Pécs', 'Sopron', 'Szeged', 'Gyékényes'];

function renderSelect() {
    let selectValues = document.getElementById('cities');

    for (let city in cities) {
        selectValues.innerHTML += `
            <option value="${cities[city]}">${cities[city]}</option>
        `;
    }
}

renderSelect();

let city = '';
let temperature = 0;
let lon = 0;
let lat = 0;
let pressure = 0;
let humidity = 0;
let windSpeed = 0;
let windDirection = '';
let amountOfRain = 'A következő 1 órában nem várható csapadék';
let description = '';
let update = '0000.00.00. 00:00:00';

renderWeatherInformations();

document.getElementById('search').addEventListener('submit',(event) => {
    event.preventDefault();

    const apiKey = '46d4b7c5d34fa20f4e66d522546c5d5f';
    let actualCity = getSelectBoxValue('cities')
    let urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${actualCity}&appid=${apiKey}&units=metric`;
    let urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${actualCity}&appid=${apiKey}&units=metric`;

    getWeatherByLocation(urlWeather);
    getForecastByLocation(urlForecast);
});

function getSelectBoxValue(id) {
    return document.getElementById(id).options[document.getElementById(id).selectedIndex].value;
}

async function getWeatherByLocation(url) {
    const response = await fetch(url);
    const responseData = await response.json();

    city = String(responseData.name);
    temperature = Math.round(responseData.main.temp);
    lon = responseData.coord.lon;
    lat = responseData.coord.lat;
    pressure = responseData.main.pressure;
    humidity = responseData.main.humidity;
    windSpeed = Math.round(responseData.wind.speed * 3.6);
    calculateWindDirection(responseData.wind.deg);
    calculateRainfall(responseData);
    description = responseData.weather[0].description;
    update = formatDateTime(responseData.dt);

    renderWeatherInformations();
}

async function getForecastByLocation(url) {
    const response = await fetch(url);
    const responseData = await response.json();
    document.getElementById('forecast').innerHTML = '';

    responseData.list.forEach(element => {
        if (String(element.dt_txt).substring(11, 13) == '12') {
            let dayname = new Date(element.dt * 1000).toLocaleDateString("hu", {
                weekday: "long",
            });
            let temperature = Math.round(element.main.temp);
            let desc = element.weather[0].description;
            renderForecast(desc, capitalize(dayname), temperature);
        }
    });
}

function calculateWindDirection(windDeg) {
    if (windDeg < 45 || windDeg >= 315) windDirection = 'Északi';
    if (windDeg >= 45 && windDeg < 135) windDirection = 'Keleti';
    if (windDeg >= 135 && windDeg < 225) windDirection = 'Déli';
    if (windDeg >= 225 && windDeg < 315) windDirection = 'Nyugati';
    return windDirection;
}

function calculateRainfall(responseData) {
    if (responseData.rain) amountOfRain = 'A következő 1 órában: ' + responseData.rain['1h'] + 'mm eső várható';
    if (responseData.snow) amountOfRain = 'A következő 1 órában: ' + responseData.snow['1h'] + 'mm hó várható';
    return amountOfRain;
}

function renderWeatherInformations() {
    document.getElementById('weather-icon').innerHTML = createWeatherIcon(description);
    document.getElementById('city').innerHTML = city;
    document.getElementById('temperature').innerHTML = temperature;
    document.getElementById('lon').innerHTML = lon;
    document.getElementById('lat').innerHTML = lat;
    document.getElementById('pressure').innerHTML = pressure;
    document.getElementById('humidity').innerHTML = humidity;
    document.getElementById('windSpeed').innerHTML = windSpeed;
    document.getElementById('windDirection').innerHTML = windDirection;
    document.getElementById('amountOfRain').innerHTML = amountOfRain;
    document.getElementById('description').innerHTML = description;
    document.getElementById('update').innerHTML = update;
}

function formatDateTime(unixTimeStamp) {
    let milliseconds = unixTimeStamp * 1000;
    let dateObject = new Date(milliseconds);
    let dateFormat = dateObject.toLocaleString();
    
    return dateFormat;
}

function createWeatherIcon(data) {
    let img = `<img src="./assets/sun.png" alt="sun" />`;

    if (data.includes('cloud')) img = `<img src="./assets/cloud.png" alt="cloud" />`;
    if (data.includes('rain')) img = `<img src="./assets/rain.png" alt="rain" />`;
    if (data.includes('snow')) img = `<img src="./assets/snow.png" alt="snow" />`;
    if (data.includes('freeze')) img = `<img src="./assets/snowflake.png" alt="snowflake" />`;
    if (data.includes('storm')) img = `<img src="./assets/storm.png" alt="storm" />`;

    return img;
}

function renderForecast(desc, dayname, temperature) {
    document.getElementById('forecast-wrapper').classList.add('visible');
    let icon = createWeatherIcon(desc);
    document.getElementById('forecast').innerHTML += `
        <div class="forecast-card">
            <div id="forecast-icon" class="forecast-icon">${icon}</div>
            <p id="forecast-day">${dayname}</p>
            <p id="forecast-temperature">${temperature} &#8451;</p>
        </div>
    `;
}

function capitalize(string) {
    return string && string[0].toUpperCase() + string.slice(1);
}
