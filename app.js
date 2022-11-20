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
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${actualCity}&appid=${apiKey}&units=metric`;

    getWeatherByLocation(url);
});

function getSelectBoxValue(id) {
    return document.getElementById(id).options[document.getElementById(id).selectedIndex].value;
}

async function getWeatherByLocation(url) {
     
    const response = await fetch(url);
    const responseData = await response.json();

    city = String(responseData.name);
    temperature = Math.floor(responseData.main.temp);
    lon = responseData.coord.lon;
    lat = responseData.coord.lat;
    pressure = responseData.main.pressure;
    humidity = responseData.main.humidity;
    windSpeed = Math.floor(responseData.wind.speed * 3.6);
    calculateWindDirection(responseData.wind.deg);
    calculateRainfall(responseData);
    description = responseData.weather[0].description;
    update = formatDateTime(responseData.dt);

    renderWeatherInformations();
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
    createWeatherIcon();
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

function createWeatherIcon() {
    if (description.includes('cloud')) document.getElementById('weather-icon').innerHTML = `<img src="./assets/cloud.png" alt="cloud" />`;
    if (description.includes('rain')) document.getElementById('weather-icon').innerHTML = `<img src="./assets/rain.png" alt="rain" />`;
    if (description.includes('snow')) document.getElementById('weather-icon').innerHTML = `<img src="./assets/snow.png" alt="snow" />`;
    if (description.includes('freeze')) document.getElementById('weather-icon').innerHTML = `<img src="./assets/snowflake.png" alt="snowflake" />`;
    if (description.includes('storm')) document.getElementById('weather-icon').innerHTML = `<img src="./assets/storm.png" alt="storm" />`;
    if (description.includes('sun')) document.getElementById('weather-icon').innerHTML = `<img src="./assets/sun.png" alt="sun" />`;
}
