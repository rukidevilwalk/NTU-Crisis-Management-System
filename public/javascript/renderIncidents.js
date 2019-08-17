/* Author(s): Chiam Jack How */
var caseLetter = ""
var incidentArr = []
var locationArr = []
var heatmapArr = []
var isHeatmapSelected = false
var updateList = []
var lv0heatmapArr = []
var lv1heatmapArr = []
var lv2heatmapArr = []
var lv3heatmapArr = []
var crisisLevelNotSet
/*** Socket io ***/

//On successful updating of new incident, server calls client to request for new incidents data
client.on('getIncidentUpdate', function (msg) {
    console.log(msg)
    getIncidents()
})

// Request to the server to return incidents then display data
function getIncidents() {
    client.emit('getIncidents', function (incidentsData) {
        displayIncidents(incidentsData)
    })
}

// Update incident db with new incident from input form 
function uploadIncident(incidentData) {
    client.emit('uploadIncident', incidentData, function () {})
}

// Update crisis level of incident 
// then server will tell client to request for the updated incident data
function updateCrisisLevel(updateList) {
    client.emit('updateCrisisLevel', {
        updateList: updateList
    }, function () {})
}

// Change status of incident to resolved 
// then server will tell client to request for the updated incident data
function updateIncidentStatus(updateList) {
    client.emit('updateIncidentStatus', {
        updateList: updateList
    }, function () {})
}

/*** Create normal and heatmap incident markers and populate incidents table ***/

function displayIncidents(incidentsData) {

    // On init, call renderMaps function to clear all existing markers
    clearMarkers(incidentArr)
    clearMarkers(heatmapArr)

    //Then empty all existing markers data in arrays
    incidentArr = []
    locationArr = []
    lv0heatmapArr = []
    lv1heatmapArr = []
    lv2heatmapArr = []
    lv3heatmapArr = []

    //Then empty all existing table data
    $('#updateTable').empty()
    $('#ongoingTable').empty()
    $('#resolvedTable').empty()

    // Reset counter for incidents with crisis level not set
    crisisLevelNotSet = 0

    for (let data of incidentsData) {

        // Create incident markers on the map
        displayIncidentMarkers(data)

        // Populate incidents for ongoing, resolved and to be updated tables
        populateIncidentsTable(data)

    }

    // Set indicator for number of incidents with crisis level not set
    if (crisisLevelNotSet > 0)
        $("#updateCrisisLevel").html("<span>Update Crisis Level </span><span style='color: red'>(" + crisisLevelNotSet + ")</span>")
    else
        $("#updateCrisisLevel").html("<span>Update Crisis Level </span><span style='color: green'>(" + crisisLevelNotSet + ")</span>")

    // Create heatmap markers on the map
    displayHeatmapMarkers(locationArr)

    // Toggle between normal markers or heatmap
    if (isHeatmapSelected) {
        showMarkers(incident_map, heatmapArr)
    } else {
        showMarkers(incident_map, incidentArr)
    }

    //Init listener and functions of location search box for this map
    mapSearch(incident_map, "incidentSearch")
}

/*** Create and display incident markers ***/

function displayIncidentMarkers(data) {

    if (data.incident_status !== "RESOLVED") {

        // Crisis level 0 = not set yet
        let crisis_level = data.incident_crisis_level === 0 ? "Not Set" : data.incident_crisis_level

        var location = {
            lat: data.incident_lat,
            lng: data.incident_lng
        }

        switch (data.incident_crisis_level) {
            case 0:
                lv0heatmapArr.push(new google.maps.LatLng(data.incident_lat, data.incident_lng))
                break
            case 1:
                lv1heatmapArr.push(new google.maps.LatLng(data.incident_lat, data.incident_lng))
                break
            case 2:
                lv2heatmapArr.push(new google.maps.LatLng(data.incident_lat, data.incident_lng))
                break
            case 3:
                lv3heatmapArr.push(new google.maps.LatLng(data.incident_lat, data.incident_lng))
                break
        }


        locationArr.push(new google.maps.LatLng(data.incident_lat, data.incident_lng))

        var marker = new google.maps.Marker({
            position: location,
            icon: "/images/map_icons/letter_" + data.incident_name.charAt(0).toLowerCase() + ".png",
            crisis_level: crisis_level
        })

        google.maps.event.addListener(marker, "click", (function (marker) {

            return function () {

                if (global_infowindow) {
                    global_infowindow.close()
                }

                var contentBody = "<span>Incident name: " + data.incident_name + "</span><br/>" +
                    "<span>Crisis Level: " + crisis_level + "</span><br/>" +
                    "<span>Location: " + data.incident_location + "</span><br/>" +
                    "<span>Description: " + data.incident_description + "</span><br/>" +
                    "<span>Date Of Creation: " + data.incident_date_created + "</span><br/>" +
                    "<span>Resources Dispatched: " + data.incident_activities + "</span><br/>"

                global_infowindow = new google.maps.InfoWindow({
                    content: contentBody
                })
                global_infowindow.open(incident_map, marker)
                //$("#infotext").empty().append(contentBody)
            }

        })(marker))
        incidentArr.push(marker)

    }

}

/*** Create and display heatmap markers ***/
function displayHeatmapMarkers(latlngArr) {
    heatmapArr = []
    // Using the same latlng as the markers to create heatmap layers
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: latlngArr,
        radius: 20
    })

    heatmapArr.push(heatmap)
}

/*** Populate ongoing and resolved incidents table ***/
function populateIncidentsTable(data) {


    //format date
    date_started = data.incident_date_created.replace(/(\d{4})\-(\d{2})\-(\d{2}).*/, '$3-$2-$1')
    date_resolved = data.incident_date_resolved.replace(/(\d{4})\-(\d{2})\-(\d{2}).*/, '$3-$2-$1')

    // Use email if contact number of reporter is empty
    reporterContact = (data.reporter_contact_number == "" ? data.reporter_email : data.reporter_contact_number)

    // Display crisis level 0 as "Not set"
    if (data.incident_crisis_level === 0 && data.incident_status == "ONGOING") {
        crisis_level = "Not Set"
        // Show popup that there are incidents with crisis levels not set yet
        crisisLevelNotSet += 1
    } else {
        crisis_level = data.incident_crisis_level
    }
    tr = document.createElement('tr')
    tr.setAttribute("onclick", "display_broadcast(this)")

    // Ongoing table
    if (data.incident_status == "ONGOING") {
        incident =
            "<td class='incident_id'><p>" + data.incident_id + "</p></td>" +
            "<td class='incident_name'><p>" + data.incident_name + "</p></td>" +
            "<td class='incident_description'><p>" + data.incident_description + "</p></td>" +
            "<td class='incident_location'><p>" + data.incident_location + "</p></td>" +
            "<td class='incident_date_created'><p>" + date_started + "</p></td>" +
            "<td class='ongoing_crisis_level'><p>" + crisis_level + "</p></td>" +
            "<td class='reporter_name'><p>" + data.reporter_name + "</p></td>" +
            "<td class='reporter_contact'><p>" + reporterContact + "</p></td>" +
            "<td class='incident_activities'><p>" + data.incident_activities + "</p></td>" +
            "<td class='ongoing_select' style='text-align:center';><input type='checkbox'></td>";


        tr.innerHTML = incident
        $('#ongoingTable').append(tr)

        //  Update Crisis Level Table
        if (data.incident_crisis_level === 0) {
            tr = document.createElement('tr')

            var incident =
                "<td class='incident_id'><p>" + data.incident_id + "</p></td>" +
                "<td class='incident_name'><p>" + data.incident_name + "</p></td>" +
                "<td class='incident_description'><p>" + data.incident_description + "</p></td>" +
                "<td class='incident_location'><p>" + data.incident_location + "</p></td>" +
                "<td class='incident_date_created'><p>" + date_started + "</p></td>" +
                "<td class='incident_activities'><p>" + data.incident_activities + "</p></td>" +
                "<td class='reporter_name'><p>" + data.reporter_name + "</p></td>" +
                "<td class='reporter_contact'><p>" + reporterContact + "</p></td>" +
                "<td class='select_crisis_level'><div class='select'><select class='update_crisis_level'>" +
                "<option id='allCrisis'>Select the crisis level</option>" +
                "<option id='l1Crisis'>Level 1</option>" +
                "<option id='l2Crisis'>Level 2</option>" +
                "<option id='l3Crisis'>Level 3</option>" +
                "</select></div></td>";

            tr.innerHTML = incident
            $('#updateTable').append(tr)
        }


        // Resolved table
    } else if (data.incident_status == "RESOLVED") {

        incident =
            "<td class='incident_id'><p>" + data.incident_id + "</p></td>" +
            "<td class='incident_name'><p>" + data.incident_name + "</p></td>" +
            "<td class='incident_description'><p>" + data.incident_description + "</p></td>" +
            "<td class='incident_location'><p>" + data.incident_location + "</p></td>" +
            "<td class='incident_date_created'><p>" + date_started + "</p></td>" +
            "<td class='incident_date_resolved'><p>" + date_resolved + "</p></td>" +
            "<td class='resolved_crisis_level'><p>" + crisis_level + "</p></td>" +
            "<td class='reporter_name'><p>" + data.reporter_name + "</p></td>" +
            "<td class='reporter_contact'><p>" + reporterContact + "</p></td>" +
            "<td class='incident_activities'><p>" + data.incident_activities + "</p></td>";

        tr.innerHTML = incident
        $('#resolvedTable').append(tr)

    }



}

/*** Map toggle functions ***/

$("#toggleIncidents").click(function () {
    if (global_infowindow)
        global_infowindow.close()

    //Show incident markers and hide heatmap
    isHeatmapSelected = false
    showMarkers(incident_map, incidentArr)
    clearMarkers(heatmapArr)

})

$("#toggleHeatMap").click(function () {
    if (global_infowindow)
        global_infowindow.close()

    if (heatmap.getMap()) {
        isHeatmapSelected = false
        clearMarkers(heatmapArr)
        showMarkers(incident_map, incidentArr)

    } else {
        isHeatmapSelected = true
        showMarkers(incident_map, heatmapArr)
        clearMarkers(incidentArr)
    }

})

$(document).ready(function () {

    //Drop down to filter incidents based on crisis level

    $("#crisis_dropdown").change(function () {

        if (global_infowindow)
            global_infowindow.close()

        clearMarkers(heatmapArr)

        var id = $(this).children(":selected").attr("id")

        switch (id) {

            // Show all crisis level for heatmap or incident markers
            case "allCrisis":

                // Set current heatmap layer based on all incidents' latlng
                displayHeatmapMarkers(locationArr)

                if (isHeatmapSelected) {
                    showMarkers(incident_map, heatmapArr)

                } else {
                    incidentArr.forEach(element => {
                        element.setVisible(true)
                    })
                }

                break

                // Show crisis level not set for heatmap or incident markers
            case "noCrisis":

                // Set current heatmap layer based on array of lvl 1 incidents' latlng
                displayHeatmapMarkers(lv0heatmapArr)

                if (isHeatmapSelected) {
                    showMarkers(incident_map, heatmapArr)
                } else {
                    incidentArr.forEach(element => {
                        if (element.get("crisis_level") === "Not Set")
                            element.setVisible(true)
                        else
                            element.setVisible(false)
                    })
                }

                break

                // Show crisis level 1 for heatmap or incident markers
            case "l1Crisis":

                // Set current heatmap layer based on array of lvl 1 incidents' latlng
                displayHeatmapMarkers(lv1heatmapArr)

                if (isHeatmapSelected) {
                    showMarkers(incident_map, heatmapArr)
                } else {
                    incidentArr.forEach(element => {
                        if (element.get("crisis_level") === 1)
                            element.setVisible(true)
                        else
                            element.setVisible(false)
                    })
                }

                break

                // Show crisis level 2 for heatmap or incident markers
            case "l2Crisis":

                // Set current heatmap layer based on array of lvl 2 incidents' latlng
                displayHeatmapMarkers(lv2heatmapArr)

                if (isHeatmapSelected) {
                    showMarkers(incident_map, heatmapArr)
                } else {
                    incidentArr.forEach(element => {
                        if (element.get("crisis_level") === 2)
                            element.setVisible(true)
                        else
                            element.setVisible(false)
                    })
                }

                break

                // Show crisis level 3 for heatmap or incident markers
            case "l3Crisis":

                // Set current heatmap layer based on array of lvl 3 incidents' latlng
                displayHeatmapMarkers(lv3heatmapArr)

                if (isHeatmapSelected) {
                    showMarkers(incident_map, heatmapArr)
                } else {
                    incidentArr.forEach(element => {
                        if (element.get("crisis_level") === 3)
                            element.setVisible(true)
                        else
                            element.setVisible(false)
                    })
                }
                break

        }

    })
})