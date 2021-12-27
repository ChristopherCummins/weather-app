function readLocation() {
    let searchInput = document.getElementById("searchInput").value;
    return searchInput;
}

async function getLatitude(city) {
    let key = "459b582a130dd8242e0ba23f2fd860ea";
    let url = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + key
    const response = await fetch (url, {mode: "cors"});
    const cityData = await response.json();
    let latitude = cityData[0].lat;
    return latitude;
}

async function getLongitude(city) {
    let key = "459b582a130dd8242e0ba23f2fd860ea";
    let url = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + key
    const response = await fetch (url, {mode: "cors"});
    const cityData = await response.json();
    let longitude = cityData[0].lon;
    return longitude;
}

async function getWeatherData() {
    const longitude = await getLongitude("london");
    const latitude = await getLatitude("london");
    let key = "459b582a130dd8242e0ba23f2fd860ea";
    let url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + "&appid=" + key
    const response = await fetch (url, {mode: "cors"});
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
}

async function displayNewWeatherData() {
    const longitude = await getLongitude(readLocation());
    const latitude = await getLatitude(readLocation());
    let key = "459b582a130dd8242e0ba23f2fd860ea";
    let url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + "&appid=" + key
    const response = await fetch (url, {mode: "cors"});
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
}


async function parseWeatherData() {
    let domCurrentTemp = document.getElementById("currentTemp");

    const weatherData = await getWeatherData();
    let currentTemp = weatherData.current.temp;
    let currentFeelsLike = weatherData.current.feels_like;
    let currentHumidity = weatherData.current.humidity;
    let todaysLow = weatherData.daily[0].temp.min;
    let todaysHigh = weatherData.daily[0].temp.max;
    let todaysSunset = new Date (weatherData.current.sunset).toLocaleTimeString("en-US");

    console.log("Current Temp: " + currentTemp, 
                "Current Humidity: " + currentHumidity, 
                "Todays' Low: " + todaysLow, 
                "Today's High: " + todaysHigh);
}

parseWeatherData();

