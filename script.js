
function readLocation() {
    let searchInput = document.getElementById("searchInput").value;
    return searchInput;
}

async function getCityInfo(city) {
    let key = "459b582a130dd8242e0ba23f2fd860ea";
    let url = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + key;
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
    try {   
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

    let description = capitalize(weatherData.current.weather[0].description);
    let cityName = cityData[0].name;
    let currentTemp = Math.round(weatherData.current.temp);
    let todaysLow = Math.round(weatherData.daily[0].temp.min);
    let todaysHigh = Math.round(weatherData.daily[0].temp.max);
    let currentFeelsLike = Math.round(weatherData.current.feels_like);
    let currentHumidity = Math.round(weatherData.current.humidity);
    let chanceOfRain = Math.round(((weatherData.daily[0].pop) * 100));
    let sunsetTime = weatherData.current.sunset;
    let phaseOfMoon = (weatherData.daily[0].moon_phase);
    let currentDate = weatherData.current.dt;
    let weeklyHighs = weatherData.daily;
    let weeklyLows = weatherData.daily;
    let currentForecastIcon = weatherData.current.weather[0].icon;
    let weeklyIcons = weatherData.daily;

    domDescription.innerHTML = description;
    domCityName.innerHTML = cityName;
    if (!converted) {
        domCurrentTemp.innerHTML = currentTemp + "&#176;F";
    }
    else {
        domCurrentTemp.innerHTML = currentTemp + "&#176;C";
    }
    domTodaysLow.innerHTML = "Low: " + todaysLow + "&#176;";
    domTodaysHigh.innerHTML = "High: " + todaysHigh + "&#176;";
    domCurrentFeelsLike.innerHTML = currentFeelsLike + "&#176;";
    domCurrentHumidity.innerHTML = currentHumidity + " %"
    domChanceOfRain.innerHTML = chanceOfRain + " %";
    domSunsetTime.innerHTML = getSunsetTime(sunsetTime);
    domPhaseOfMoon.innerHTML = getMoonPhase(phaseOfMoon);
    fillMoonPhaseIcon(phaseOfMoon);
    fillWeeklyDaysOfWeek(currentDate);
    fillWeeklyHIghs(weeklyHighs);
    fillWeeklyLows(weeklyLows);
    fillCurrentForecastIcon(getForecastIconSVGString(currentForecastIcon));
    fillWeeklyForecastIcons(weeklyIcons)
    document.getElementById("searchForm").reset();
    }
    catch(e) {
        if (e instanceof TypeError) {
            alert("Enter a valid city or country");
            document.getElementById("searchForm").reset();
        }
    }
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

function fillMoonPhaseIcon(phaseOfMoon) {
    let moonPhaseIcon = document.getElementById("moonPhaseIcon");
    let moonPhase = getMoonPhase(phaseOfMoon).replace(/\s+/g, '');
    
    moonPhaseIcon.src = "assets/" + moonPhase + ".png";
}

function fillCurrentForecastIcon(SVGString) {
    if (document.getElementsByTagName("image").length > 0) {
       d3.select("#mainIcon").remove();
    }
    let iconContainer = d3.select("#iconContainer");
    iconContainer.append("svg:image")
    .attr('href', 'data:image/svg+xml;base64, ' + SVGString)
    .style("filter", "brightness(0) saturate(100%) invert(0%) sepia(10%) saturate(7462%) hue-rotate(130deg) brightness(85%) contrast(108%)")
    .attr('id', 'mainIcon')
    .attr('width', 130)
    .attr('height', 130)
    // .attr('x', 5)
    .attr('y', 10)
}

function getForecastIconSVGString(currentForecastIcon) {
    let encodedValue = ""
    if ((currentForecastIcon == "01d") || (currentForecastIcon == "01n")){
        encodedValue = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgZmlsbD0iI2Y1ZjVmNSIgdmlld0JveD0iMyAzIDI2IDI2Ij4KPHRpdGxlPnN1bjwvdGl0bGU+CjxwYXRoIGQ9Ik0xNiA5Yy0zLjg1OSAwLTcgMy4xNDEtNyA3czMuMTQxIDcgNyA3IDctMy4xNDEgNy03YzAtMy44NTktMy4xNDEtNy03LTd6TTE2IDIxYy0yLjc2MiAwLTUtMi4yMzgtNS01czIuMjM4LTUgNS01IDUgMi4yMzggNSA1LTIuMjM4IDUtNSA1ek0xNiA3YzAuNTUyIDAgMS0wLjQ0OCAxLTF2LTJjMC0wLjU1Mi0wLjQ0OC0xLTEtMXMtMSAwLjQ0OC0xIDF2MmMwIDAuNTUyIDAuNDQ4IDEgMSAxek0xNiAyNWMtMC41NTIgMC0xIDAuNDQ4LTEgMXYyYzAgMC41NTIgMC40NDggMSAxIDFzMS0wLjQ0OCAxLTF2LTJjMC0wLjU1Mi0wLjQ0OC0xLTEtMXpNMjMuNzc3IDkuNjM1bDEuNDE0LTEuNDE0YzAuMzkxLTAuMzkxIDAuMzkxLTEuMDIzIDAtMS40MTRzLTEuMDIzLTAuMzkxLTEuNDE0IDBsLTEuNDE0IDEuNDE0Yy0wLjM5MSAwLjM5MS0wLjM5MSAxLjAyMyAwIDEuNDE0czEuMDIzIDAuMzkxIDEuNDE0IDB6TTguMjIzIDIyLjM2NWwtMS40MTQgMS40MTRjLTAuMzkxIDAuMzkxLTAuMzkxIDEuMDIzIDAgMS40MTRzMS4wMjMgMC4zOTEgMS40MTQgMGwxLjQxNC0xLjQxNGMwLjM5MS0wLjM5MiAwLjM5MS0xLjAyMyAwLTEuNDE0cy0xLjAyMy0wLjM5Mi0xLjQxNCAwek03IDE2YzAtMC41NTItMC40NDgtMS0xLTFoLTJjLTAuNTUyIDAtMSAwLjQ0OC0xIDFzMC40NDggMSAxIDFoMmMwLjU1MiAwIDEtMC40NDggMS0xek0yOCAxNWgtMmMtMC41NTIgMC0xIDAuNDQ4LTEgMXMwLjQ0OCAxIDEgMWgyYzAuNTUyIDAgMS0wLjQ0OCAxLTFzLTAuNDQ4LTEtMS0xek04LjIyMSA5LjYzNWMwLjM5MSAwLjM5MSAxLjAyNCAwLjM5MSAxLjQxNCAwczAuMzkxLTEuMDIzIDAtMS40MTRsLTEuNDE0LTEuNDE0Yy0wLjM5MS0wLjM5MS0xLjAyMy0wLjM5MS0xLjQxNCAwcy0wLjM5MSAxLjAyMyAwIDEuNDE0bDEuNDE0IDEuNDE0ek0yMy43NzkgMjIuMzYzYy0wLjM5Mi0wLjM5MS0xLjAyMy0wLjM5MS0xLjQxNCAwcy0wLjM5MiAxLjAyMyAwIDEuNDE0bDEuNDE0IDEuNDE0YzAuMzkxIDAuMzkxIDEuMDIzIDAuMzkxIDEuNDE0IDBzMC4zOTEtMS4wMjMgMC0xLjQxNGwtMS40MTQtMS40MTR6Ii8+Cjwvc3ZnPg==";
        return encodedValue;
    }
    else if (currentForecastIcon == "02d") {
        encodedValue = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgZmlsbD0iI2Y1ZjVmNSIgdmlld0JveD0iMCAwIDMyIDMyIj4KPHRpdGxlPmNsb3VkeS1kYXk8L3RpdGxlPgo8cGF0aCBkPSJNMTMgNGMwLjU1MiAwIDEtMC40NDggMS0xdi0yYzAtMC41NTItMC40NDgtMS0xLTFzLTEgMC40NDgtMSAxdjJjMCAwLjU1MiAwLjQ0OCAxIDEgMXpNMjAuNzc3IDYuNjM1bDEuNDE0LTEuNDE0YzAuMzkxLTAuMzkxIDAuMzkxLTEuMDIzIDAtMS40MTRzLTEuMDIzLTAuMzkxLTEuNDE0IDBsLTEuNDE0IDEuNDE0Yy0wLjM5MSAwLjM5MS0wLjM5MSAxLjAyMyAwIDEuNDE0czEuMDIzIDAuMzkxIDEuNDE0IDB6TTEgMTRoMmMwLjU1MiAwIDEtMC40NDggMS0xcy0wLjQ0OC0xLTEtMWgtMmMtMC41NTIgMC0xIDAuNDQ4LTEgMXMwLjQ0OCAxIDEgMXpNMjIgMTNjMCAwLjU1MiAwLjQ0OCAxIDEgMWgyYzAuNTUyIDAgMS0wLjQ0OCAxLTFzLTAuNDQ4LTEtMS0xaC0yYy0wLjU1MiAwLTEgMC40NDgtMSAxek01LjIyMSA2LjYzNWMwLjM5MSAwLjM5MSAxLjAyNCAwLjM5MSAxLjQxNCAwczAuMzkxLTEuMDIzIDAtMS40MTRsLTEuNDE0LTEuNDE0Yy0wLjM5MS0wLjM5MS0xLjAyMy0wLjM5MS0xLjQxNCAwcy0wLjM5MSAxLjAyMyAwIDEuNDE0bDEuNDE0IDEuNDE0ek0yNSAxNmMtMC4zMzIgMC0wLjY2IDAuMDIzLTAuOTg3IDAuMDcwLTEuMDQ4LTEuNDMtMi40NDUtMi41MjEtNC4wMjktMy4yMTktMC4wODEtMy43ODktMy4xNzYtNi44NTItNi45ODQtNi44NTItMy44NTkgMC03IDMuMTQxLTcgNyAwIDEuMDkwIDAuMjcxIDIuMTA5IDAuNzE5IDMuMDI3LTMuNzI3IDAuMTUyLTYuNzE5IDMuMjExLTYuNzE5IDYuOTczIDAgMy44NTkgMy4xNDEgNyA3IDcgMC44NTYgMCAxLjY5My0wLjE1NiAyLjQ4Mi0wLjQ1OCAxLjgxIDEuNTc4IDQuMTEyIDIuNDU4IDYuNTE4IDIuNDU4IDIuNDA5IDAgNC43MDgtMC44OCA2LjUxOC0yLjQ1OCAwLjc4OSAwLjMwMiAxLjYyNiAwLjQ1OCAyLjQ4MiAwLjQ1OCAzLjg1OSAwIDctMy4xNDEgNy03cy0zLjE0MS03LTctN3pNMTMgOGMyLjQ4OCAwIDQuNTM1IDEuODIzIDQuOTE5IDQuMjAzLTAuNjI2LTAuMTI1LTEuMjY2LTAuMjAzLTEuOTE5LTAuMjAzLTIuODcxIDAtNS41MzEgMS4yMzgtNy4zOTggMy4zMjgtMC4zNzEtMC42OTgtMC42MDItMS40ODItMC42MDItMi4zMjggMC0yLjc2MiAyLjIzOC01IDUtNXpNMjUgMjhjLTEuMDcwIDAtMi4wNTctMC4zNDQtMi44NzEtMC45MTctMS40NjcgMS43NjgtMy42NTIgMi45MTctNi4xMjkgMi45MTdzLTQuNjYyLTEuMTQ4LTYuMTI5LTIuOTE3Yy0wLjgxMyAwLjU3My0xLjgwMSAwLjkxNy0yLjg3MSAwLjkxNy0yLjc2MiAwLTUtMi4yMzgtNS01czIuMjM4LTUgNS01YzAuNDg0IDAgMC45NDEgMC4wOTEgMS4zODMgMC4yMjEgMC4xNzYgMC4wNDkgMC4zNTQgMC4wODkgMC41MiAwLjE1OCAwLjI3My0wLjUzNSAwLjYxNy0xLjAyNSAwLjk5OS0xLjQ4NCAxLjQ2MS0xLjc1OCAzLjYzNC0yLjg5NSA2LjA5OS0yLjg5NSAwLjYzMyAwIDEuMjQgMC4wOTEgMS44MjggMC4yMzIgMC42NiAwLjE1NiAxLjI4NCAwLjM5MyAxLjg2NSAwLjcwNiAxLjQ1NiAwLjc3MyAyLjY1MSAxLjk3MSAzLjQwNCAzLjQ0MSAwLjU4Ny0wLjI0MiAxLjIyOS0wLjM3OSAxLjkwNC0wLjM3OSAyLjc2MiAwIDUgMi4yMzggNSA1cy0yLjIzOCA1LTUgNXoiLz4KPC9zdmc+";
   return encodedValue;
    }
    else if (currentForecastIcon == "02n") {
        encodedValue = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgZmlsbD0iI2Y1ZjVmNSIgdmlld0JveD0iMCAyLjQyIDMyIDI5LjU3Ij4KPHRpdGxlPmNsb3VkeS1uaWdodDwvdGl0bGU+CjxwYXRoIGQ9Ik0yNy4xOTEgMTYuMzg1YzAuMzA1LTAuMjI3IDAuNjEzLTAuNDQ5IDAuODg5LTAuNzI1IDAuODI2LTAuODI3IDEuNDU0LTEuODMzIDEuODYyLTIuOTkxIDAuMTMtMC4zNjIgMC4wMzgtMC43NjgtMC4yMzYtMS4wMzktMC4yNzItMC4yNzMtMC42NzYtMC4zNjYtMS4wMzktMC4yMzctMi4yMTIgMC43ODEtNC42MDUgMC4yNS02LjI0NC0xLjM5MS0xLjY0MS0xLjY0MS0yLjE3NC00LjAzMy0xLjM5MS02LjI0NCAwLjEyOC0wLjM2MyAwLjAzNi0wLjc2Ny0wLjIzNy0xLjA0MC0wLjI3MS0wLjI3MS0wLjY3Ni0wLjM2NS0xLjAzOS0wLjIzNy0xLjE1OSAwLjQxMS0yLjE2NCAxLjAzOS0yLjk5IDEuODY0LTIuMDk2IDIuMDk0LTIuNzQ5IDUuMDYzLTIuMDMwIDcuNzM3LTIuNzAzIDAuMzQ1LTUuMTMzIDEuNzgxLTYuNzUxIDMuOTg3LTAuMzI3LTAuMDQ3LTAuNjU1LTAuMDcwLTAuOTg3LTAuMDcwLTMuODU5IDAtNyAzLjE0MS03IDdzMy4xNDEgNyA3IDdjMC44NTYgMCAxLjY5My0wLjE1NiAyLjQ4Mi0wLjQ1OCAxLjgxIDEuNTc4IDQuMTEyIDIuNDU4IDYuNTE4IDIuNDU4IDIuNDA5IDAgNC43MDgtMC44OCA2LjUxOC0yLjQ1OCAwLjc4OSAwLjMwMiAxLjYyNiAwLjQ1OCAyLjQ4MiAwLjQ1OCAzLjg1OSAwIDctMy4xNDEgNy03IDAtMy4wOTAtMi4wMjYtNS42ODktNC44MDktNi42MTV6TTE4LjE4MiA1Ljc2YzAuMTU5LTAuMTYxIDAuMzI5LTAuMzExIDAuNTA5LTAuNDUyLTAuMTQxIDIuMjQ5IDAuNjcxIDQuNDYxIDIuMzE5IDYuMTA4IDEuNjQ4IDEuNjQ4IDMuODYxIDIuNDU4IDYuMTA5IDIuMzE5LTAuODYyIDEuMDk5LTIuMDUwIDEuNzgzLTMuMzIgMi4wNzQtMS43MTEtMi4xNzItNC4yMjUtMy41MzktNi45OTctMy43NjItMC43NjctMi4xMjItMC4zMTgtNC41OSAxLjM4LTYuMjg4ek0yNSAyOGMtMS4wNzAgMC0yLjA1Ny0wLjM0NC0yLjg3MS0wLjkxNy0xLjQ2NyAxLjc2OC0zLjY1MiAyLjkxNy02LjEyOSAyLjkxN3MtNC42NjItMS4xNDgtNi4xMjktMi45MTdjLTAuODEzIDAuNTczLTEuODAxIDAuOTE3LTIuODcxIDAuOTE3LTIuNzYyIDAtNS0yLjIzOC01LTVzMi4yMzgtNSA1LTVjMC42NzYgMCAxLjMxNiAwLjEzNyAxLjkwMiAwLjM3OSAxLjI2Mi0yLjQ2IDMuNzM0LTQuMTgxIDYuNjQ1LTQuMzQ2IDAuMTUyLTAuMDA5IDAuMzAxLTAuMDMzIDAuNDUzLTAuMDMzIDAuODA3IDAgMS41ODIgMC4xMjYgMi4zMTMgMC4zNDkgMC45ODcgMC4zMDIgMS44ODcgMC43OTQgMi42NjggMS40MjggMC43NDYgMC42MDUgMS4zNzEgMS4zNDggMS44NjMgMi4xODEgMC4wODMgMC4xNDEgMC4xNzcgMC4yNzMgMC4yNTMgMC40MjEgMC41ODctMC4yNDIgMS4yMjktMC4zNzkgMS45MDQtMC4zNzkgMi43NjIgMCA1IDIuMjM4IDUgNXMtMi4yMzggNS01IDV6Ii8+Cjwvc3ZnPg==";
        return encodedValue;
    }
    else if ((currentForecastIcon == "03d") || (currentForecastIcon == "03n")) {
        encodedValue = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgZmlsbD0iI2Y1ZjVmNSIgdmlld0JveD0iMCA2IDMyIDIwIj4KPHRpdGxlPmNsb3VkPC90aXRsZT4KPHBhdGggZD0iTTI1IDEwYy0wLjMzMiAwLTAuNjYgMC4wMjMtMC45ODcgMC4wNzAtMS44NjctMi41NDQtNC44MTQtNC4wNzAtOC4wMTMtNC4wNzBzLTYuMTQ1IDEuNTI2LTguMDEzIDQuMDcwYy0wLjMyNy0wLjA0Ny0wLjY1NS0wLjA3MC0wLjk4Ny0wLjA3MC0zLjg1OSAwLTcgMy4xNDEtNyA3czMuMTQxIDcgNyA3YzAuODU2IDAgMS42OTMtMC4xNTYgMi40ODItMC40NTggMS44MSAxLjU3OCA0LjExMiAyLjQ1OCA2LjUxOCAyLjQ1OCAyLjQwOSAwIDQuNzA4LTAuODggNi41MTgtMi40NTggMC43ODkgMC4zMDIgMS42MjYgMC40NTggMi40ODIgMC40NTggMy44NTkgMCA3LTMuMTQxIDctN3MtMy4xNDEtNy03LTd6TTI1IDIyYy0xLjA3MCAwLTIuMDU3LTAuMzQ0LTIuODcxLTAuOTE3LTEuNDY3IDEuNzY4LTMuNjUyIDIuOTE3LTYuMTI5IDIuOTE3cy00LjY2Mi0xLjE0OC02LjEyOS0yLjkxN2MtMC44MTMgMC41NzMtMS44MDEgMC45MTctMi44NzEgMC45MTctMi43NjIgMC01LTIuMjM4LTUtNXMyLjIzOC01IDUtNWMwLjY3NiAwIDEuMzE2IDAuMTM4IDEuOTAyIDAuMzggMS4zMjctMi41ODggMy45OTEtNC4zOCA3LjA5OC00LjM4czUuNzcxIDEuNzkyIDcuMDk2IDQuMzhjMC41ODctMC4yNDIgMS4yMjktMC4zOCAxLjkwNC0wLjM4IDIuNzYyIDAgNSAyLjIzOCA1IDVzLTIuMjM4IDUtNSA1eiIvPgo8L3N2Zz4=";
        return encodedValue;
    }
    else if  ((currentForecastIcon == "04d") || (currentForecastIcon == "04n")){
        encodedValue = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgZmlsbD0iI2Y1ZjVmNSIgdmlld0JveD0iMCA2LjU3IDMyIDI1LjQzIj4KPHRpdGxlPmNsb3VkeTwvdGl0bGU+CjxwYXRoIGQ9Ik0zMiAxNWMwLTMuMDczLTIuNS01LjU3Mi01LjU3My01LjU3Mi0wLjE1IDAtMC4yOTggMC4wMDctMC40NDcgMC4wMTgtMS40NDUtMS44MDMtMy42MjQtMi44NzQtNS45OC0yLjg3NC0yLjM1NSAwLTQuNTM1IDEuMDcwLTUuOTggMi44NzQtMC4xNDgtMC4wMTItMC4yOTgtMC4wMTgtMC40NDktMC4wMTgtMy4wNzAtMC01LjU3IDIuNDk5LTUuNTcgNS41NzIgMCAwLjMyMiAwLjA0MyAwLjYzMSAwLjA5NCAwLjk0LTAuMDM0IDAuMDQ0LTAuMDc0IDAuMDg1LTAuMTA3IDAuMTMtMC4zMjctMC4wNDctMC42NTUtMC4wNzAtMC45ODctMC4wNzAtMy44NTkgMC03IDMuMTQxLTcgN3MzLjE0MSA3IDcgN2MwLjg1NiAwIDEuNjkzLTAuMTU2IDIuNDgyLTAuNDU4IDEuODEgMS41NzggNC4xMTIgMi40NTggNi41MTggMi40NTggMi40MDkgMCA0LjcwOC0wLjg4IDYuNTE4LTIuNDU4IDAuNzg5IDAuMzAyIDEuNjI2IDAuNDU4IDIuNDgyIDAuNDU4IDMuODU5IDAgNy0zLjE0MSA3LTcgMC0xLjYwNS0wLjU2NS0zLjA2OC0xLjQ3OS00LjI1IDAuOTExLTAuOTk0IDEuNDc5LTIuMzAyIDEuNDc5LTMuNzV6TTI1IDI4Yy0xLjA3MCAwLTIuMDU3LTAuMzQ0LTIuODcxLTAuOTE3LTEuNDY3IDEuNzY4LTMuNjUyIDIuOTE3LTYuMTI5IDIuOTE3cy00LjY2Mi0xLjE0OC02LjEyOS0yLjkxN2MtMC44MTMgMC41NzMtMS44MDEgMC45MTctMi44NzEgMC45MTctMi43NjIgMC01LTIuMjM4LTUtNXMyLjIzOC01IDUtNWMwLjY3NiAwIDEuMzE2IDAuMTM3IDEuOTAyIDAuMzc5IDAuMDM1LTAuMDY2IDAuMDc4LTAuMTI1IDAuMTEzLTAuMTg5IDAuMzUyLTAuNjQyIDAuNzg1LTEuMjMgMS4yOTItMS43NTMgMS40NDMtMS40OTUgMy40NDgtMi40MzggNS42OTMtMi40MzggMy4xMDcgMCA1Ljc3MSAxLjc5MiA3LjA5NiA0LjM3OSAwLjM1My0wLjE0NSAwLjcyOS0wLjIzOCAxLjExNy0wLjMwMWwwLjc4Ny0wLjA3OGMwLjc3MSAwIDEuNDkyIDAuMTkgMi4xNDUgMC41IDAuNzA3IDAuMzM4IDEuMzE0IDAuODM2IDEuNzkgMS40NDkgMC42NTYgMC44NDUgMS4wNjUgMS44OTcgMS4wNjUgMy4wNTEgMCAyLjc2Mi0yLjIzOCA1LTUgNXpNMjkuMDk4IDE3LjM1MmMtMS4xNTUtMC44NDEtMi41NjMtMS4zNTItNC4wOTgtMS4zNTItMC4zMzIgMC0wLjY2IDAuMDIzLTAuOTg3IDAuMDcwLTEuODY3LTIuNTQ0LTQuODE0LTQuMDcwLTguMDEzLTQuMDcwLTIuMTMzIDAtNC4xNDUgMC42OS01LjgwOSAxLjg5NiAwLjQ2Ny0xLjQyOCAxLjc5Ni0yLjQ2NyAzLjM3OS0yLjQ2NyAwLjQ4NCAwIDAuOTQxIDAuMDk4IDEuMzU5IDAuMjcxIDAuOTQ5LTEuODQ4IDIuODUyLTMuMTI2IDUuMDcwLTMuMTI2czQuMTIyIDEuMjc5IDUuMDY4IDMuMTI2YzAuNDIxLTAuMTczIDAuODgtMC4yNzEgMS4zNTktMC4yNzEgMS45NzQgMCAzLjU3MyAxLjU5OSAzLjU3MyAzLjU3MiAwIDAuOTA1LTAuMzQ4IDEuNzIxLTAuOTAyIDIuMzUxeiIvPgo8L3N2Zz4=";
        return encodedValue;
    }
    else if ((currentForecastIcon == "09d") || (currentForecastIcon == "09n")) {
        encodedValue = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgZmlsbD0iI2Y1ZjVmNSIgdmlld0JveD0iMCAwIDMyIDMyIj4KPHRpdGxlPnJhaW55PC90aXRsZT4KPHBhdGggZD0iTTI1IDRjLTAuMzMyIDAtMC42NiAwLjAyMy0wLjk4NyAwLjA3MC0xLjg2Ny0yLjU0NC00LjgxNC00LjA3MC04LjAxMy00LjA3MHMtNi4xNDUgMS41MjYtOC4wMTMgNC4wNzBjLTAuMzI3LTAuMDQ3LTAuNjU1LTAuMDcwLTAuOTg3LTAuMDcwLTMuODU5IDAtNyAzLjE0MS03IDdzMy4xNDEgNyA3IDdjMC44NTYgMCAxLjY5My0wLjE1NiAyLjQ4Mi0wLjQ1OCAxLjgxIDEuNTc4IDQuMTEyIDIuNDU4IDYuNTE4IDIuNDU4IDIuNDA5IDAgNC43MDgtMC44OCA2LjUxOC0yLjQ1OCAwLjc4OSAwLjMwMiAxLjYyNiAwLjQ1OCAyLjQ4MiAwLjQ1OCAzLjg1OSAwIDctMy4xNDEgNy03cy0zLjE0MS03LTctN3pNMjUgMTZjLTEuMDcwIDAtMi4wNTctMC4zNDQtMi44NzEtMC45MTctMS40NjcgMS43NjgtMy42NTIgMi45MTctNi4xMjkgMi45MTdzLTQuNjYyLTEuMTQ4LTYuMTI5LTIuOTE3Yy0wLjgxMyAwLjU3My0xLjgwMSAwLjkxNy0yLjg3MSAwLjkxNy0yLjc2MiAwLTUtMi4yMzgtNS01czIuMjM4LTUgNS01YzAuNjc2IDAgMS4zMTYgMC4xMzggMS45MDIgMC4zOCAxLjMyNy0yLjU4OCAzLjk5MS00LjM4IDcuMDk4LTQuMzhzNS43NzEgMS43OTIgNy4wOTYgNC4zOGMwLjU4Ny0wLjI0MiAxLjIyOS0wLjM4IDEuOTA0LTAuMzggMi43NjIgMCA1IDIuMjM4IDUgNXMtMi4yMzggNS01IDV6TTE0LjA2MyAzMGMwIDEuMTA1IDAuODk1IDIgMiAyczItMC44OTUgMi0yLTItNC0yLTQtMiAyLjg5NS0yIDR6TTIyIDI4YzAgMS4xMDUgMC44OTUgMiAyIDJzMi0wLjg5NSAyLTItMi00LTItNC0yIDIuODk1LTIgNHpNNiAyNGMwIDEuMTA1IDAuODk0IDIgMiAyczItMC44OTUgMi0yLTItNC0yLTQtMiAyLjg5NS0yIDR6Ii8+Cjwvc3ZnPg==";
        return encodedValue;
    }
    else if ((currentForecastIcon == "10d") || (currentForecastIcon == "10n")) {
        encodedValue = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgZmlsbD0iI2Y1ZjVmNSIgdmlld0JveD0iMCAwIDMyIDMyIj4KPHRpdGxlPnJhaW55PC90aXRsZT4KPHBhdGggZD0iTTI1IDRjLTAuMzMyIDAtMC42NiAwLjAyMy0wLjk4NyAwLjA3MC0xLjg2Ny0yLjU0NC00LjgxNC00LjA3MC04LjAxMy00LjA3MHMtNi4xNDUgMS41MjYtOC4wMTMgNC4wNzBjLTAuMzI3LTAuMDQ3LTAuNjU1LTAuMDcwLTAuOTg3LTAuMDcwLTMuODU5IDAtNyAzLjE0MS03IDdzMy4xNDEgNyA3IDdjMC44NTYgMCAxLjY5My0wLjE1NiAyLjQ4Mi0wLjQ1OCAxLjgxIDEuNTc4IDQuMTEyIDIuNDU4IDYuNTE4IDIuNDU4IDIuNDA5IDAgNC43MDgtMC44OCA2LjUxOC0yLjQ1OCAwLjc4OSAwLjMwMiAxLjYyNiAwLjQ1OCAyLjQ4MiAwLjQ1OCAzLjg1OSAwIDctMy4xNDEgNy03cy0zLjE0MS03LTctN3pNMjUgMTZjLTEuMDcwIDAtMi4wNTctMC4zNDQtMi44NzEtMC45MTctMS40NjcgMS43NjgtMy42NTIgMi45MTctNi4xMjkgMi45MTdzLTQuNjYyLTEuMTQ4LTYuMTI5LTIuOTE3Yy0wLjgxMyAwLjU3My0xLjgwMSAwLjkxNy0yLjg3MSAwLjkxNy0yLjc2MiAwLTUtMi4yMzgtNS01czIuMjM4LTUgNS01YzAuNjc2IDAgMS4zMTYgMC4xMzggMS45MDIgMC4zOCAxLjMyNy0yLjU4OCAzLjk5MS00LjM4IDcuMDk4LTQuMzhzNS43NzEgMS43OTIgNy4wOTYgNC4zOGMwLjU4Ny0wLjI0MiAxLjIyOS0wLjM4IDEuOTA0LTAuMzggMi43NjIgMCA1IDIuMjM4IDUgNXMtMi4yMzggNS01IDV6TTE0LjA2MyAzMGMwIDEuMTA1IDAuODk1IDIgMiAyczItMC44OTUgMi0yLTItNC0yLTQtMiAyLjg5NS0yIDR6TTIyIDI4YzAgMS4xMDUgMC44OTUgMiAyIDJzMi0wLjg5NSAyLTItMi00LTItNC0yIDIuODk1LTIgNHpNNiAyNGMwIDEuMTA1IDAuODk0IDIgMiAyczItMC44OTUgMi0yLTItNC0yLTQtMiAyLjg5NS0yIDR6Ii8+Cjwvc3ZnPg==";
        return encodedValue;
    }
    else if ((currentForecastIcon == "11d") || (currentForecastIcon == "11n")) {
        encodedValue = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgZmlsbD0iI2Y1ZjVmNSIgdmlld0JveD0iMCAwIDMyIDMyIj4KPHRpdGxlPmxpZ2h0bmluZzwvdGl0bGU+CjxwYXRoIGQ9Ik0xMiAyNGwyIDItMiA2IDYtNi0yLTIgMi00LTYgNHpNMzIgOC40MjdjMC0zLjA3Mi0yLjUtNS41Ny01LjU3My01LjU3LTAuMTUgMC0wLjI5OCAwLjAwNS0wLjQ0NyAwLjAxNy0xLjQ0NS0xLjgwMi0zLjYyNC0yLjg3NC01Ljk4LTIuODc0LTIuMzU1IDAtNC41MzUgMS4wNzItNS45OCAyLjg3NC0wLjE0OC0wLjAxMi0wLjI5OC0wLjAxNy0wLjQ0OS0wLjAxNy0zLjA3MCAwLTUuNTcgMi40OTktNS41NyA1LjU3IDAgMC4zMjIgMC4wNDMgMC42MzMgMC4wOTQgMC45NC0wLjAzNCAwLjA0NC0wLjA3NCAwLjA4NS0wLjEwNyAwLjEzLTAuMzI3LTAuMDQ3LTAuNjU1LTAuMDcwLTAuOTg3LTAuMDcwLTMuODU5IDAtNyAzLjE0MS03IDdzMy4xNDEgNyA3IDdjMC44NTYgMCAxLjY5My0wLjE1NiAyLjQ4Mi0wLjQ1OCAwLjA2OSAwLjA2MCAwLjE1MSAwLjEwMiAwLjIyMSAwLjE2bDEuNzctMS4xOGMtMC41OS0wLjQxOC0xLjE0MS0wLjg4My0xLjYwMi0xLjQzOC0wLjgxMyAwLjU3Mi0xLjgwMSAwLjkxNS0yLjg3MSAwLjkxNS0yLjc2MiAwLTUtMi4yMzctNS01IDAtMi43NiAyLjIzOC01IDUtNSAwLjY3NiAwIDEuMzE2IDAuMTM4IDEuOTAyIDAuMzggMC4wMzUtMC4wNjggMC4wNzgtMC4xMjUgMC4xMTMtMC4xOSAwLjM1Mi0wLjY0MiAwLjc4NS0xLjIyOSAxLjI5Mi0xLjc1MyAxLjQ0My0xLjQ5MyAzLjQ0OC0yLjQzOCA1LjY5My0yLjQzOCAzLjEwNyAwIDUuNzcxIDEuNzkyIDcuMDk2IDQuMzggMC4zNTMtMC4xNDYgMC43MjktMC4yNCAxLjExNy0wLjMwMmwwLjc4Ny0wLjA3OGMwLjc3MSAwIDEuNDkyIDAuMTkgMi4xNDUgMC41IDAuNzA3IDAuMzM5IDEuMzE0IDAuODM2IDEuNzkgMS40NSAwLjY1NiAwLjg0NSAxLjA2NSAxLjg5NiAxLjA2NSAzLjA1MCAwIDIuNzYzLTIuMjM4IDUtNSA1LTEuMDcwIDAtMi4wNTctMC4zNDQtMi44NzEtMC45MTUtMC44NzUgMS4wNTUtMi4wMjcgMS44NDgtMy4zMjIgMi4zNDhsLTAuMzc0IDAuNzQ2IDEuMTQxIDEuMTQxYzEuMDY2LTAuNDE1IDIuMDY0LTEuMDEyIDIuOTQ0LTEuNzc3IDAuNzg5IDAuMzAyIDEuNjI2IDAuNDU4IDIuNDgyIDAuNDU4IDMuODU5IDAgNy0zLjE0MSA3LTcgMC0xLjYwNC0wLjU2NS0zLjA2OC0xLjQ3OS00LjI1IDAuOTExLTAuOTkyIDEuNDc5LTIuMzAxIDEuNDc5LTMuNzV6TTI5LjA5OCAxMC43NzljLTEuMTU1LTAuODQtMi41NjMtMS4zNTItNC4wOTgtMS4zNTItMC4zMzIgMC0wLjY2IDAuMDIzLTAuOTg3IDAuMDcwLTEuODY3LTIuNTQzLTQuODE0LTQuMDcwLTguMDEzLTQuMDcwLTIuMTMzIDAtNC4xNDUgMC42OTEtNS44MDkgMS44OTcgMC40NjctMS40MjggMS43OTYtMi40NjcgMy4zNzktMi40NjcgMC40ODQgMCAwLjk0MSAwLjA5OCAxLjM1OSAwLjI3MSAwLjk0OS0xLjg0OSAyLjg1Mi0zLjEyOCA1LjA3MC0zLjEyOHM0LjEyMiAxLjI3OSA1LjA2OCAzLjEyOGMwLjQyMS0wLjE3MyAwLjg4LTAuMjcxIDEuMzU5LTAuMjcxIDEuOTc0IDAgMy41NzMgMS41OTkgMy41NzMgMy41NyAwIDAuOTA2LTAuMzQ4IDEuNzIzLTAuOTAyIDIuMzUyeiIvPgo8L3N2Zz4=";
        return encodedValue;
    }
    else if ((currentForecastIcon == "13d") || (currentForecastIcon == "13n")) {
        encodedValue = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgZmlsbD0iI2Y1ZjVmNSIgdmlld0JveD0iMC41IDEgNDcuMDEgNDcuMDEiPgo8dGl0bGU+c25vdzwvdGl0bGU+CjxwYXRoIGQ9Ik0xNC41IDI0LjUwMmMwIDEgMC4xNiAxLjk3IDAuNDQgMi44NzFsLTQuMDgwIDIuMzUtNy4yNi0xLjk0Yy0xLjMxLTAuMzUtMi42NiAwLjQzLTMuMDIwIDEuNzI5LTAuMzUgMS4zMTEgMC40MyAyLjY1IDEuNzUgM2w1Ljg3IDEuNTctMS41OCA1Ljg0Yy0wLjM1IDEuMzAxIDAuNDMgMi42NSAxLjc0IDMgMS4zMiAwLjM1IDIuNjctMC40MyAzLjAyMC0xLjczOGwxLjk0LTcuMjIxIDQuMjctMi40NTFjMS4xMSAxLjAxMCAyLjQ2IDEuNzcxIDMuOTUgMi4xNzJ2NS41bC01LjMyIDQuNDg4Yy0wLjk2IDAuOTktMC45NiAyLjU5IDAgMy41OSAwLjk2IDAuOTkgMi41MiAwLjk5IDMuNDggMGw0LjMtNC40MzkgNC4zIDQuNDM5YzAuOTYgMC45OSAyLjUyIDAuOTkgMy40NzkgMCAwLjk2MS0xIDAuOTYxLTIuNiAwLTMuNTlsLTUuMzE5LTQuNDg4di01LjVjMS40OS0wLjQgMi44NC0xLjE2MiAzLjk1LTIuMTcybDQuMjcgMi40NTEgMS45NCA3LjIyMWMwLjM1IDEuMzA5IDEuNjk5IDIuMDg4IDMuMDIwIDEuNzM4IDEuMzExLTAuMzUgMi4wOTEtMS42OTkgMS43NC0zbC0xLjU4LTUuODQgNS44Ny0xLjU3YzEuMzItMC4zNSAyLjEtMS42ODkgMS43NS0zLTAuMzU5LTEuMjk5LTEuNzEtMi4wNzgtMy4wMjAtMS43MjlsLTcuMjYxIDEuOTM5LTQuMDc5LTIuMzVjMC4yNzktMC45IDAuNDM5LTEuODcxIDAuNDM5LTIuODcxcy0wLjE2LTEuOTctMC40MzktMi44OGw0LjA3OS0yLjM0IDcuMjYxIDEuOTRjMS4zMSAwLjM1IDIuNjYtMC40MzEgMy4wMjAtMS43MyAwLjM1LTEuMzEtMC40My0yLjY1LTEuNzUtM2wtNS44Ny0xLjU3IDEuNTgtNS44NGMwLjM1MS0xLjMtMC40My0yLjY0OS0xLjc0LTMtMS4zMi0wLjM1LTIuNjcgMC40My0zLjAyMCAxLjc0bC0xLjk0IDcuMjItNC4yNyAyLjQ1Yy0xLjExLTEuMDEwLTIuNDYtMS43Ny0zLjk1LTIuMTd2LTQuNWw1LjMxOS01LjQ5YzAuOTYxLTAuOTkgMC45NjEtMi41OSAwLTMuNTktMC45Ni0wLjk5LTIuNTItMC45OS0zLjQ3OSAwbC00LjMgNC40NDItNC4zLTQuNDRjLTAuOTYtMC45OS0yLjUyLTAuOTktMy40OCAwLTAuOTYgMS0wLjk2IDIuNiAwIDMuNTlsNS4zMiA1LjQ5djQuNWMtMS40OSAwLjQtMi44NCAxLjE2LTMuOTUgMi4xN2wtNC4yNy0yLjQ1LTEuOTQtNy4yMmMtMC4zNS0xLjMxMS0xLjctMi4wOTAtMy4wMjAtMS43NC0xLjMxIDAuMzUxLTIuMDkwIDEuNy0xLjc0IDNsMS41OCA1Ljg0LTUuODcgMS41N2MtMS4zMiAwLjM1LTIuMSAxLjY5LTEuNzUgMyAwLjM2IDEuMyAxLjcxIDIuMDgwIDMuMDIwIDEuNzNsNy4yNi0xLjk0IDQuMDgwIDIuMzRjLTAuMjggMC45MS0wLjQ0IDEuODc5LTAuNDQgMi44Nzl6TTI0IDI5LjAwMmMtMi40OSAwLTQuNS0yLjAxMC00LjUtNC41czIuMDEwLTQuNSA0LjUtNC41IDQuNSAyLjAxMCA0LjUgNC41YzAgMi40OS0yLjAxMCA0LjUtNC41IDQuNXoiLz4KPC9zdmc+";
        return encodedValue;
    }
    else if ((currentForecastIcon == "50d") || (currentForecastIcon == "50n")) {
        encodedValue = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgZmlsbD0iI2Y1ZjVmNSIgdmlld0JveD0iMS45NCA1Ljk0IDMwIDE4Ij4KPHRpdGxlPm1pc3Q8L3RpdGxlPgo8cGF0aCBkPSJNMzAuOTM4IDEzLjkzOGgtNS4xMDJjLTAuNTA0LTQuNDg3LTQuMjc3LTgtOC44OTgtOC0zLjExMyAwLTUuODU5IDEuNTkxLTcuNDc3IDRoLTYuNTIzYy0wLjU1MiAwLTEgMC40NDgtMSAxczAuNDQ4IDEgMSAxaDUuNTUyYy0wLjIyNiAwLjYzOC0wLjM3NCAxLjMwNi0wLjQ1IDJoLTMuMTAyYy0wLjU1MiAwLTEgMC40NDgtMSAxczAuNDQ4IDEgMSAxaDMuMTAyYzAuMDc3IDAuNjkzIDAuMjI0IDEuMzYzIDAuNDUgMmgtNS4zN2MtMC42NTQgMC0xLjE4MiAwLjQ0OC0xLjE4MiAxczAuNTI5IDEgMS4xODIgMWg2LjM0MWMxLjYxNyAyLjQxIDQuMzYzIDQgNy40NzcgNHM1Ljg1OS0xLjU5IDcuNDc3LTRoMi4zNDFjMC42NTQgMCAxLjE4Mi0wLjQ0OCAxLjE4Mi0xcy0wLjUyOS0xLTEuMTgyLTFoLTEuMzdjMC4yMjctMC42MzcgMC4zNzItMS4zMDcgMC40NTEtMmg1LjEwMmMwLjU1MiAwIDEtMC40NDggMS0xcy0wLjQ0OC0xLTEtMXpNMTAuNjM5IDExLjkzOGg2LjI5OGMwLjU1MiAwIDEtMC40NDggMS0xcy0wLjQ0OC0xLTEtMWgtNC44ODRjMS4yNjMtMS4yMzMgMi45ODMtMiA0Ljg4NC0yIDMuNTE4IDAgNi40MDkgMi42MTcgNi44OTggNmgtMTMuNzk3YzAuMTAyLTAuNzA3IDAuMzAyLTEuMzc4IDAuNi0yek0xNi45MzggMjEuOTM4Yy0xLjkwMSAwLTMuNjIxLTAuNzY4LTQuODg0LTJoOS43NjdjLTEuMjYyIDEuMjMyLTIuOTgyIDItNC44ODMgMnpNMjMuMjM0IDE3LjkzOGgtMTIuNTk1Yy0wLjI5OC0wLjYyMi0wLjQ5OS0xLjI5My0wLjYtMmgxMy43OTdjLTAuMTAyIDAuNzA3LTAuMzAyIDEuMzc4LTAuNjAyIDJ6Ii8+Cjwvc3ZnPg==";
        return encodedValue;
    }
}

function fillWeeklyForecastIcons(weeklyIcons) {

    function addWeeklyIcon(d,i) {
        d3.select(this)
            .append("svg:image")
            .attr('href', 'data:image/svg+xml;base64, ' + getForecastIconSVGString(weeklyIcons[i].weather[0].icon))
            .style("filter", "brightness(0) saturate(100%) invert(0%) sepia(10%) saturate(7462%) hue-rotate(130deg) brightness(85%) contrast(108%)")
            .attr('id', 'currentIcon')
            .attr('width', 40)
            .attr('height', 40)
            .attr('y', 15)
    }
    d3.selectAll("#currentIcon").remove();

    d3.selectAll(".weeklyIcon").each(addWeeklyIcon);
}

function getSunsetTime(unixTime) {
    let date = new Date(unixTime * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
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

function fillWeeklyHIghs(weeklyHighs) {
    let domWeeklyHighs = document.getElementsByClassName("high");

    for (i = 0; i < domWeeklyHighs.length; i++) {
        domWeeklyHighs[i].innerHTML = Math.round(weeklyHighs[i + 1].temp.max) + "&#176;";
    }
}

function fillWeeklyLows(weeklyLows) {
    let domWeeklyLows = document.getElementsByClassName("low");

    for (i = 0; i < domWeeklyLows.length; i++) {
        domWeeklyLows[i].innerHTML = Math.round(weeklyLows[i + 1].temp.min) + "&#176;";
    }
}

function capitalize(words) {
    const separateWord = words.toLowerCase().split(' ');
    for (let i = 0; i < separateWord.length; i++) {
      separateWord[i] =
        separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
    }
    return separateWord.join(' ');
  }

  async function renderDefaultData() {
    const cityData = await(getCityInfo("nyc"));
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

    let description = capitalize(weatherData.current.weather[0].description);
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
    let weeklyHighs = weatherData.daily;
    let weeklyLows = weatherData.daily;
    let currentForecastIcon = weatherData.current.weather[0].icon;
    let weeklyIcons = weatherData.daily;

    domDescription.innerHTML = description;
    domCityName.innerHTML = cityName;
    domCurrentTemp.innerHTML = currentTemp + "&#176;F";
    domTodaysLow.innerHTML = "Low: " + todaysLow + "&#176;";
    domTodaysHigh.innerHTML = "High: " + todaysHigh + "&#176;";
    domCurrentFeelsLike.innerHTML = currentFeelsLike + "&#176;";
    domCurrentHumidity.innerHTML = currentHumidity + " %"
    domChanceOfRain.innerHTML = chanceOfRain + " %";
    domSunsetTime.innerHTML = getSunsetTime(sunsetTime);
    domPhaseOfMoon.innerHTML = getMoonPhase(phaseOfMoon);
    fillMoonPhaseIcon(phaseOfMoon);
    fillWeeklyDaysOfWeek(currentDate);
    fillWeeklyHIghs(weeklyHighs);
    fillWeeklyLows(weeklyLows);
    fillCurrentForecastIcon(getForecastIconSVGString(currentForecastIcon));
    fillWeeklyForecastIcons(weeklyIcons)
    console.log(sunsetTime);
    console.log(currentForecastIcon);
}

renderDefaultData();


function changeDomUnits() {
    let allTemps = document.getElementsByClassName("temp");
    let mainLowTemp = document.getElementsByClassName("todaysLow")[0];
    let mainHighTemp = document.getElementsByClassName("todaysHigh")[0];
    let mainCurrentTemp = document.getElementsByClassName("temperature")[0];

    for (i = 0; i < allTemps.length; i ++) {
        let originalTemp = allTemps[i].innerHTML.replace(/[^0-9.-]/g, '');
        if (!converted) {
            let newTemp = convertImperialToMetric(originalTemp);
            allTemps[i].innerHTML= newTemp + "&#176;";
        }
        else {
            let newTemp = convertMetricToImperial(originalTemp);
            allTemps[i].innerHTML= newTemp + "&#176;";
        }
    }
    currentTemp = mainCurrentTemp.innerHTML;
    lowTemp = mainLowTemp.innerHTML;
    mainLowTemp.innerHTML = "Low: " + lowTemp;
    highTemp = mainHighTemp.innerHTML;
    mainHighTemp.innerHTML = "High: " + highTemp;

    if (converted) {
        mainCurrentTemp.innerHTML = currentTemp + "F";
    }
    else {
        mainCurrentTemp.innerHTML = currentTemp + "C";
    }
}

function convertMetricToImperial(temp) {
    temp = Math.round((temp * (9/5) + 32));
    return temp;
}

function convertImperialToMetric(temp) {
    temp = Math.round((temp - 32) * (5/9));
    return temp;
}

let convertButton = document.getElementById("unitBtn");
let converted = false;

convertButton.addEventListener("click", () => {
        changeDomUnits();
        if (! converted) {
            converted = true;
            convertButton.innerHTML = "Convert to &#176;F"
        }
        else {
            converted = false;
            convertButton.innerHTML = "Convert to &#176;C"
        }
        console.log("hi");
    });

    