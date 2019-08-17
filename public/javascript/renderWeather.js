/* Author(s): Chiam Jack How */
var weatherArr=[]

/*** Socket io ***/

// Request to the server to return data
function get2hrWeather() {
    client.emit('get2hrWeather', function (data) {
        display2hrWeather(data)
    })
}
// Request to the server to return data
function get24hrWeather() {
    client.emit('get24hrWeather', function (data) {
        display24hrWeather(data)
    })
}

 /*** Create and display 2hr weather markers ***/
function display2hrWeather(weatherData) {

    // On init, call renderMaps function to clear all existing markers
    clearMarkers(weatherArr)
    weatherArr=[]

    for (let data of weatherData) {

        var location = { lat: data.lat, lng: data.lng }

        var weatherMarker = new google.maps.Marker({
            position: location,
            map: weather_map
        })

        google.maps.event.addListener(weatherMarker, "click", (function (weatherMarker) {

            return function () {

                if (global_infowindow) {
                    global_infowindow.close()
                }

                var contentBody = "<span><b>2hr Weather Information</b></span><br/>" +
          "<span>Area: " + data.area + "</span><br/>" +
          "<span>Forecast: " + data.forecast + "</span><br/>" +
          "<span>Updated on: " + data.timestamp + "</span><br/>"

                global_infowindow = new google.maps.InfoWindow({
                    content: contentBody
                })
                global_infowindow.open(weather_map, weatherMarker)

            }

        })(weatherMarker))
        weatherArr.push(weatherMarker)
    }
       // Call function in renderMaps to display created markers
    showMarkers(weather_map,weatherArr)

      //Init listener and functions of location search box for this map
         mapSearch(weather_map,"weatherSearch")
}

/*** Map toggle functions ***/

$("#toggleWeather").click(function () {
    if (global_infowindow)
        global_infowindow.close()
})

/*** Display 24hr weather text information ***/

function display24hrWeather(weatherData) {
    $("#24hr-panel-stats-unit").empty().append(weatherData.forecast)
    $("#temperature-panel-stats-wrapper").empty().append(weatherData.temperature_low + "-" + weatherData.temperature_high + "&#8451;")
    $("#humidity-panel-stats-wrapper").empty().append(weatherData.relative_humidity_low + "-" + weatherData.relative_humidity_high + "%")
    $("#wind-panel-stats-wrapper").empty().append(weatherData.wind_direction + " " + weatherData.wind_speed_low + " to " + weatherData.wind_speed_high + " km/h")
}




