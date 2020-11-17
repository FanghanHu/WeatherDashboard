let $search = $('#search');
let $searchBtn = $('#searchBtn');
let $history = $('#history');
let $forecast = $('#forecast');

//Open Weather API Key
const apiKey = "12a86102d69b851ad68961e1b9b10e46";


function createForecastCard(date, weather, temperature, humidity) {
    return $(`
        <div class="card m-2 p-1 bg-primary text-white forecast-card">
            <div class="card-title">${date}</div>
            <div class="card-body">
                <i class="fa fa-cloud"></i>
                <p>Temp: ${temperature} °F</p>
                <p>Humidity: ${humidity}%</p>
            </div>
        </div>
    `);
}

function handleSearch() {
    let searchTerm = $search.val();
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
        getForecast(response.coord);
    }).catch((e) => {
        if(e.status === 404) {
            //TODO: Can not find city

        }
    });
}

function getForecast(coordinates) {
    // noinspection JSUnresolvedVariable
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`

    $.ajax({
        url: url,
        method: "GET"
    }).done((response) => {
        console.log(response);
    });
}

$search.change(handleSearch);
$searchBtn.click(handleSearch);

searchForCity('Houston');