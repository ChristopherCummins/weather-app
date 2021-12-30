function readLocation() {
    let searchInput = document.getElementById("searchInput").value;
    return searchInput;
}

async function getCityInfo(city) {
    let key = "459b582a130dd8242e0ba23f2fd860ea";
    let url = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + key;
    const response = await fetch (url, {mode: "cors"});
    const cityData = await response.json();
    console.log(cityData);
    return cityData;
}

async function getWeatherData(cityData) {
    const longitude = cityData[0].lon;
    const latitude = cityData[0].lat;
    let key = "459b582a130dd8242e0ba23f2fd860ea";
    let url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + "&appid=" + key
    const response = await fetch (url, {mode: "cors"});
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
}

async function parseWeatherData() {
    const cityData = await(getCityInfo(readLocation()));
    const weatherData = await getWeatherData(cityData);

    let domDescription = document.getElementsByClassName("descriptionText")[0];
    let domCityName = document.getElementsByClassName("cityName")[0];
    let domCurrentTemp = document.getElementsByClassName("temperature")[0];
    let domTodaysLow = document.getElementsByClassName("todaysLow")[0];
    let domTodaysHigh = document.getElementsByClassName("todaysHigh")[0];
    let domCurrentFeelsLike = document.getElementsByClassName("rightDescription")[0];
    let domCurrentHumidity = document.getElementsByClassName("rightDescription")[1];
    let domChanceOfRain = document.getElementsByClassName("rightDescription")[2];
    let domSunsetTime = document.getElementsByClassName("rightDescription")[3];
    let domPhaseOfMoon = document.getElementsByClassName("rightDescription")[4];

    let description = weatherData.current.weather[0].main;
    let cityName = cityData[0].name;
    let currentTemp = Math.round(weatherData.current.temp);
    let todaysLow = Math.round(weatherData.daily[0].temp.min);
    let todaysHigh = Math.round(weatherData.daily[0].temp.max);
    let currentFeelsLike = Math.round(weatherData.current.feels_like);
    let currentHumidity = Math.round(weatherData.current.humidity);
    let chanceOfRain = ((weatherData.daily[0].pop) * 100);
    let sunsetTime = weatherData.current.sunset;
    let phaseOfMoon = (weatherData.daily[0].moon_phase);
    let currentDate = weatherData.current.dt;

    domDescription.innerHTML = description;
    domCityName.innerHTML = cityName;
    domCurrentTemp.innerHTML = currentTemp + "&#176;";
    domTodaysLow.innerHTML = "Low: " + todaysLow + "&#176;";
    domTodaysHigh.innerHTML = "High: " + todaysHigh + "&#176;";
    domCurrentFeelsLike.innerHTML = currentFeelsLike + "&#176;";
    domCurrentHumidity.innerHTML = currentHumidity + " %"
    domChanceOfRain.innerHTML = chanceOfRain + " %";
    domSunsetTime.innerHTML = getSunsetTime(sunsetTime);
    domPhaseOfMoon.innerHTML = getMoonPhase(phaseOfMoon);

    fillWeeklyDaysOfWeek(currentDate);

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

function getSunsetTime(unixTime) {
    let date = new Date(unixTime*1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (hours > 12) {
        hours = hours - 12;
    }
    let sunsetTime = hours + ":" + minutes + " pm";
    return sunsetTime;
}

function getCurrentDayofWeek(unixTime) {
    let date = new Date(unixTime * 1000);
    let currentDayOfWeek = date.getDay();
    return currentDayOfWeek;
}

function convertDayofWeek(numberDayOfWeek) {
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = weekDays[numberDayOfWeek];
    return day;
}

function fillWeeklyDaysOfWeek(unixTime) {
    let domDaysOfWeek = document.getElementsByClassName("date");
    let dayOfWeek = getCurrentDayofWeek(unixTime);

    for (i = 0; i < domDaysOfWeek.length; i++) {
        domDaysOfWeek[i].innerHTML = dayOfWeek + 1;
        dayOfWeek += 1;
    }
    for (i = 0; i <domDaysOfWeek.length; i++) {
        if (domDaysOfWeek[i].innerHTML >= 7) {
            domDaysOfWeek[i].innerHTML = domDaysOfWeek[i].innerHTML - 7;
        }
    }
    for (i = 0; i <domDaysOfWeek.length; i++) {
        domDaysOfWeek[i].innerHTML = convertDayofWeek(domDaysOfWeek[i].innerHTML);
    }
}