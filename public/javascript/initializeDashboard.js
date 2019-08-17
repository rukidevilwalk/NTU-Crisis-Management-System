/* Author(s): Chiam Jack How */
var map
var incident_map
var psi_map
var dengue_map
var weather_map
var lat = 1.3460857
var lng = 103.8201931
var global_infowindow = null
var searchboxArr = []

/*** Initialize maps and functions ***/

initMap = function () {
    return new Promise(function (resolve, reject) {
         mapArgs = {
            zoom: 12,
            mapTypeControl: true,
            center: new google.maps.LatLng(lat, lng),
            streetViewControl: false,
            gestureHandling: "auto"
        }

        map = new google.maps.Map(document.getElementById("default_map"), mapArgs)
        dengue_map = new google.maps.Map(document.getElementById("dengue_map"), mapArgs)
        psi_map = new google.maps.Map(document.getElementById("psi_map"), mapArgs)
        weather_map = new google.maps.Map(document.getElementById("weather_map"), mapArgs)
        incident_map = new google.maps.Map(document.getElementById("incident_map"), mapArgs)

        // Set google maps autocomplete incident input form
         incidentFormLocation = document.getElementById("form_location")
         incidentAutocomplete = new google.maps.places.Autocomplete(incidentFormLocation, {
            componentRestrictions: {
                country: "SG"
            }
        })


        originCenter = map.getCenter()
        originZoom = map.getZoom()
        //Init listener and functions of location search box for default map
        mapSearch(map, "defaultSearch")

        resolve(incident_map)

    }).catch(err => {
        console.log(err)
    })
}

/*** Socket io ***/

//Instantiate client of socket.io
var client = io()

// Show connected user
client.emit('showConnectedUser', {
    name: document.getElementById('loggedInUser').getAttribute("name")
}, function () {})

// On client connection, server tells client to request for data to render in map
client.on('getInitData', function (msg) {
    console.log(msg)

    //Wait for google library to load and maps to be generated
    initMap().then(function (result) {
        // Client requests server to return data then callback to render data on map
        getIncidents()
        getDengueClusters()
        getPSIData()
        get2hrWeather()
        get24hrWeather()
    })


})

//On successful updating of db, Scheduler calls client to request for new API data
client.on('getAPIUpdates', function (msg) {
    console.log(msg)
    getDengueClusters()
    getPSIData()
    get2hrWeather()
    get24hrWeather()
})

// Server tells client to request for new resources data
client.on('getResourcesUpdate', function (msg) {
    console.log(msg)
    // Request to the server to return resources data then display data
    client.emit('getResources', function (resourcesData) {
        createResourcesSelect(resourcesData)
    })
})

function createResourcesSelect(resourcesData) {

    // Clear existing dropdown
    $('#select').empty()

    // Create dropdown body
    selectList = document.createElement("select")
    selectList.id = "Resource"
    $('#select').append(selectList)

    // Create dropdown default value
    option = document.createElement("option")
    option.text = "Resources"
    option.id = "init_resource"
    selectList.appendChild(option)

    // Create dropdown options 
    for (let resource of resourcesData) {
        option = document.createElement("option")
        option.id = resource.resource_name
        option.text = resource.resource_name
        selectList.appendChild(option);
    }

    $('#Resource').change(function () {
        if (this.selectedIndex !== 0) {
            if ($('#sms_contact').val().length == 0) {
                let text = this.value

                $('#sms_contact').val(text)
            } else {
                let text = $('#sms_contact').val()
                text = text + ", " + this.value
                $('#sms_contact').val(text)
            }
        }

    })
}

/*** Toggle visibility of map markers ***/

// Sets the map on all markers in the array.
function setMapOnAll(map, markerArray) {
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(map)
    }
}

// Removes the markers from the map and clear array
function clearMarkers(markerArray) {
    setMapOnAll(null, markerArray)
}


// Shows any markers currently in the array.
function showMarkers(map, markerArray) {
    setMapOnAll(map, markerArray)
}

/*** Map search box ***/

// Configure search box to display location results in map; Resets to original state when input is cleared
function mapSearch(map, searchboxName) {

    //Save the id of all search boxes into array

    var searchMarkersArr = []
    //Save original map state


    // Create the search box for map location search and link it to the UI element
    var mapLocation = document.getElementById(searchboxName)
    var searchBox = new google.maps.places.SearchBox(mapLocation)

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds())

        //On location result, set location name to form location search box
        $("#form_location").val($("#" + searchboxName).val())

    })

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces()

        if (places.length == 0) {
            return
        }

        // Clear out all the old markers.
        clearMarkers(searchMarkersArr)
        searchMarkersArr = []

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds()
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry")
                return
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            }

            // Create a marker for each place.
            searchMarkersArr.push(new google.maps.Marker({
                map: map,

                title: place.name,
                position: place.geometry.location
            }))

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport)
            } else {
                bounds.extend(place.geometry.location)
            }
        })
        map.fitBounds(bounds)
    })

    // Listen to search box input action
    $("#" + searchboxName).on('input', function () {

        //If search box input is emptied
        if (!this.value) {

            $("#form_location").val("")

            // Clear out the old markers for current map
            clearMarkers(searchMarkersArr)
            searchMarkersArr = []

            // Reset the map's position
            map.setCenter(originCenter)
            map.setZoom(originZoom)
        }

    })

}