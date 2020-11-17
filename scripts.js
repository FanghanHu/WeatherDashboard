let $search = $('#search');
let $searchBtn = $('#searchBtn');
let $history = $('#history');
let $forecast = $('#forecast');

//current data display:
let $cityName = $('#cityName');
let $temperature = $('#temperature');
let $humidity = $('#humidity');
let $windSpeed = $('#windSpeed');
let $uvIndex = $('#uvIndex');

//Open Weather API Key
const apiKey = "12a86102d69b851ad68961e1b9b10e46";
let savedSearchTerm = [];


function createForecastCard(date, weatherIconCode, temperature, humidity) {
    return $(`
        <div class="card m-2 p-1 bg-primary text-white forecast-card">
            <div class="card-title">${date}</div>
            <div class="card-body text-center">
                <img src="http://openweathermap.org/img/wn/${weatherIconCode}.png" alt="weather">
                <p>Temp: ${temperature} °F</p>
                <p>Humidity: ${humidity}%</p>
            </div>
        </div>
    `);
}

function handleSearch() {
    let searchTerm = $search.val();

    if(searchTerm) {
        searchForCity(searchTerm);
        if(!savedSearchTerm.includes(searchTerm)) {
            $history.prepend($(`<li class="list-group-item">${searchTerm}</li>`));
            savedSearchTerm.unshift(searchTerm);
            localStorage.setItem('searchHistory', JSON.stringify(savedSearchTerm));
        }
    }
}

/**
 * load history search and display it
 */
function loadSavedSearchTerm() {
    $history.empty();
    let temp = localStorage.getItem('searchHistory');
    if(temp) {
        savedSearchTerm = JSON.parse(temp);
    }
    for(let history of savedSearchTerm) {
        $history.append($(`<li class="list-group-item">${history}</li>`));
    }
}

/**
 * @param kelvin temperature in kelvin
 * @returns {number} temperature in fahrenheit
 */
function kelvinToFahrenheit(kelvin) {
    return Math.floor((kelvin - 273) * (9/5) + 32);
}

/**
 * Search for a city
 */
function searchForCity(searchTerm) {
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${searchTerm}`
    $.ajax({
        url: url,
        method: "GET"
    }).done((response) => {
        // noinspection JSUnresolvedVariable
        getForecast(response.coord, response.name);
    }).catch((e) => {
        if(e.status === 404) {
            //TODO: Can not find city
            alert("Cannot find the given city!");
        }
    });
}

/**
 * request the full forecast data with the city coordinates
 */
function getForecast(coordinates, cityName) {
    // noinspection JSUnresolvedVariable
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`

    $.ajax({
        url: url,
        method: "GET"
    }).done((response) => {
        //display current data
        $cityName.text(cityName + "(" + getDate(response.current.dt) + ")");
        $temperature.text(kelvinToFahrenheit(response.current.temp));
        $humidity.text(response.current.humidity);
        $windSpeed.text(response.current.wind_speed);
        $uvIndex.text(response.current.uvi);

        //display forecast data:
        $forecast.empty();
        for (let i = 1; i < response.daily.length && i < 6; i++) {
            let dailyData = response.daily[i];
            $forecast.append(createForecastCard(
                getDate(dailyData.dt),
                dailyData.weather[0].icon,
                kelvinToFahrenheit(dailyData.temp.day),
                dailyData.humidity));
        }
    });
}

//convert unix time to a readable date
function getDate(dt) {
    let date = new Date(dt * 1000);
    return date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
}


//handles the searches
$search.change(handleSearch);
$searchBtn.click(handleSearch);
$history.click('li', function (event) {
    let text = $(event.target).text();
    $search.val(text);
});

loadSavedSearchTerm();
searchForCity('Houston');