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
    const weatherData = await displayNewWeatherData();

    let domCurrentTemp = document.getElementsByClassName("temperature")[0];
    let domCurrentFeelsLike = document.getElementsByClassName("rightDescription")[0];
    let domCurrentHumidity = document.getElementsByClassName("rightDescription")[1];
    let domTodaysLow = document.getElementsByClassName("todaysLow");
    let domTodaysHigh = document.getElementsByClassName("todaysHigh");
    let domChanceOfRain = document.getElementsByClassName("rightDescription")[2];
    let domPhaseOfMoon = document.getElementsByClassName("rightDescription")[4];

    let currentTemp = Math.round(weatherData.current.temp);
    let currentFeelsLike = Math.round(weatherData.current.feels_like);
    let currentHumidity = Math.round(weatherData.current.humidity);
    let todaysLow = Math.round(weatherData.daily[0].temp.min);
    let todaysHigh = Math.round(weatherData.daily[0].temp.max);
    let chanceOfRain = ((weatherData.daily[0].pop) * 100);
    let phaseOfMoon = (weatherData.daily[0].moon_phase);
    //let todaysSunset = new Date (weatherData.current.sunset).toLocaleTimeString("en-US");

    domCurrentTemp.innerHTML = currentTemp + "&#176;";
    domCurrentFeelsLike.innerHTML = currentFeelsLike + "&#176;";
    domCurrentHumidity.innerHTML = currentHumidity + " %"
    domTodaysLow.innerHTML = todaysLow + "&#176;";
    domTodaysHigh.innerHTML = todaysHigh + "&#176;";
    domChanceOfRain.innerHTML = chanceOfRain + " %";
    domPhaseOfMoon.innerHTML = getMoonPhase(phaseOfMoon);

    console.log("Current Temp: " + currentTemp, 
                "Current Humidity: " + currentHumidity, 
                "Todays' Low: " + todaysLow, 
                "Today's High: " + todaysHigh,
                "Phase of Moon: " + phaseOfMoon);
}


function getMoonPhase(number) {
        if ((number == 0) || (number == 1)) {
            return "New Moon";
        }
        else if (number < .25) {
            return "Waxing Crescent";
        }
        else if (number == .25) {
            return "First Quarter";
        }
        else if ((number > .25) && (number < .5)) {
            return "Waxing Gibbous";
        }
        else if (number == .5) {
            return "Full Moon";
        }
        else if ((number > .5) && (number < .75)) {
            return "Waning Gibbous";
        }
        else if (number == .75) {
            return "Last Quarter";
        }
        else if ((number > .75) && (number < 1)) {
            return "Waning Crescent";
        }
}

getWeatherData();

