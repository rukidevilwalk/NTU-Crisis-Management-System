/* Author(s): Chiam Jack How */
var dengueClusterArr = []

/*** Socket io ***/

// Request to the server to return data
function getDengueClusters() {
    client.emit('getDengueClusters', function (data) {
        displayDengueClusters(data)
    })
}

 /*** Create and display dengue cluster markers ***/
function displayDengueClusters(dengueClustersData) {

     // On init, call renderMaps function to clear all existing markers
     clearMarkers(dengueClusterArr)
dengueClusterArr =[]
  
     for (let cluster of dengueClustersData) {
        var clusterArr = []
        for (var i = 0; i < cluster.coordinates.length; i += 2) {
            clusterArr.push({ lat: cluster.coordinates[i][0], lng: cluster.coordinates[i + 1][0] })
        }
        var dengueCluster = new google.maps.Polygon({
            paths: clusterArr,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: "#FF0000",
            fillOpacity: 0.35
        })
        dengueClusterArr.push(dengueCluster)

        google.maps.event.addListener(dengueCluster, "click", function (event) {

            if (global_infowindow) {
                global_infowindow.close()
            }
            global_infowindow = new google.maps.InfoWindow

            var contentString = "<b>Dengue Cluster Information</b><br>" +
            "<b>Location:</b> " + cluster.location + "<br>" +
            "<b>Number of cases:</b> " + cluster.numOfCases + "<br>" +
            "<b>Updated on:</b> " + cluster.timestamp + "<br>"

            global_infowindow.setContent(contentString)
            global_infowindow.setPosition(event.latLng)

            global_infowindow.open(dengue_map)
        })

    }
    // Call function in renderMaps to display created markers
    showMarkers(dengue_map,dengueClusterArr)

     //Init listener and functions of location search box for this map
         mapSearch(dengue_map,"dengueSearch")
}

/*** Map toggle functions ***/

$("#toggleDengueClusters").click(function () {
    if (global_infowindow)
        global_infowindow.close()
})







