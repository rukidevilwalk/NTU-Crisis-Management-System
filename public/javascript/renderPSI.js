/* Author(s): Chiam Jack How */
var psiArr = []

/*** Socket io ***/

// Request to the server to return data
function getPSIData() {
    client.emit('getPSIData', function (data) {
        displayPSIMarkers(data)
    })
}

 /*** Create and display PSI markers ***/
	function displayPSIMarkers(psiData) {

	     // On init, call renderMaps function to clear all existing markers
	     clearMarkers(psiArr)
	     psiArr=[]

	    for (let data of psiData) {

	        var location = { lat: data.lat, lng: data.lng }

	  switch (data.region) {
	        case "west":
	            labelContent = "WEST"
		            break

	        case "east":
	            labelContent = "EAST"
	            break

	        case "central":
	            labelContent = "CENTRAL"
	            break

	        case "south":
	            labelContent = "SOUTH"
	            break

	        case "north":
	            labelContent = "NORTH"
	            break

	        case "national":
	            displayOverallPSI(data)
	            break
	        }

	        var iconOptions = {
	            url: "images/psilabel.png",
	            scaledSize: new google.maps.Size(75, 40)
	        }

	        var psiMarker = new google.maps.Marker({
	            position: location,
	            label:labelContent,
	            map: psi_map,
	            icon: iconOptions
	        })

	     

	        google.maps.event.addListener(psiMarker, "click", (function (psiMarker) {

	            return function () {

	                if (global_infowindow) 
	                    global_infowindow.close()

	                var contentBody = "<span><b>PSI Information</b></span><br/>" +
	          "<span>Region: " + data.region + "</span><br/>" +
	          "<span>Updated on: " + data.updateDate + "</span><br/>" +
	          "<span>PSI 24 Hourly: " + data.psi_twenty_four_hourly + "</span><br/>" +
	          "<span>NO2 One Hour Max: " + data.no2_one_hour_max + "</span><br/>" +
	          "<span>O3 Sub Index: " + data.o3_sub_index + "</span><br/>" +
	          "<span>O3 8 Hour Max: " + data.o3_eight_hour_max + "</span><br/>" +
	          "<span>PM10 24 Hourly: " + data.pm10_twenty_four_hourly + "</span><br/>" +
	          "<span>PM10 Sub Index: " + data.pm10_sub_index + "</span><br/>" +
	          "<span>PM25 24 Hourly: " + data.pm25_twenty_four_hourly + "</span><br/>" +
	          "<span>PM25 Sub Index: " + data.pm25_sub_index + "</span><br/>" +
	          "<span>CO Sub Index: " + data.co_sub_index + "</span><br/>" +
	          "<span>CO 8 Hour Max: " + data.co_eight_hour_max + "</span><br/>" +
	          "<span>SO2 Sub Index: " + data.so2_sub_index + "</span><br/>" +
	          "<span>SO2 24 Hourly: " + data.so2_twenty_four_hourly + "</span><br/>"

	                global_infowindow = new google.maps.InfoWindow({
	                    content: contentBody
	                })
	                global_infowindow.open(map, psiMarker)

	            }

	        })(psiMarker))
	        psiArr.push(psiMarker)
	    }
	     // Call function in renderMaps to display created markers
	    showMarkers(psi_map,psiArr)

	      //Init listener and functions of location search box for this map
         mapSearch(psi_map,"psiSearch")
	}

/*** Map toggle functions ***/

	$("#togglePSI").click(function () {
	    if (global_infowindow)
	        global_infowindow.close()
	})

/*** Display 24hr PSI text information ***/

	function displayOverallPSI(data) {
	    $("#psi-panel-stats-unit").empty().append(data.psi_twenty_four_hourly)
	    $("#psi-panel-stats-wrapper").empty().append("Updated on " + data.updateDate)
	}


