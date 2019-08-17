/* Author(s): Royston Beh Zhi Yang */
const xl = require('excel4node')
var cmsTitleStyle
var cmsSubTitleStyle
var cmsBodyStyle
var noResults

exports.generateReport = function (type, psiArr, incidentsArr, dengueArr) {
	return new Promise(function (resolve, reject) {

		wb = new xl.Workbook()

		// CMS title style
		cmsTitleStyle = wb.createStyle({
			font: {
				bold: true,
				underline: true,
				size: 72
			},
		})

		// CMS subtitle style
		cmsSubTitleStyle = wb.createStyle({
			font: {
				bold: true,
				size: 18
			},
		})

		// CMS subtitle style
		cmsBodyStyle = wb.createStyle({
			font: {
				size: 12
			},

		})

		noResults = wb.createStyle({
			font: {
				size: 20
			},
		})

		// Create a new instance of a Workbook class
		incidentsTotal = sortCrisisLevel(incidentsArr)

		// Add Worksheets to the workbook
		if (type === "ONGOING") {
			var reportName = "Ongoing_Incidents_Report"
			var ws = wb.addWorksheet(reportName);
		} else {
			var reportName = "Resolved_Incidents_Report"
			var ws = wb.addWorksheet(reportName);
		}

		// add title
		ws.cell(1, 1)
			.string(reportName)
			.style(cmsTitleStyle)

		row = 3

		generateGeneralInfo(ws, incidentsTotal, row)

		// incidentsArr = [{'id' : 123,
		// 'incident_status' : 'resolved' ,
		// 'incident_activities' : 'None',
		// 'date_resolved' : '123',
		// 'date_resolved' : '321',
		// 'crisis_level' : 2 } ,
		// {'id' : 321,
		// 'incident_status' : 'none' ,
		// 'incident_activities' : 'lol',
		// 'date_resolved' : '321',
		// 'date_resolved' : '123',
		// 'crisis_level' : 3 }
		// ];

		// add in new info such as the number of the incidents 
		// 
		ws1 = wb.addWorksheet('Incident Level 1 Report')

		row = 1

		ws1.cell(row, 1)
			.string("Incidents Crisis Level 1 Information")
			.style(cmsSubTitleStyle)
		row += 1

		generateTable(ws1, incidentsTotal[0], row)

		// Level 2

		var ws2 = wb.addWorksheet('Incident Level 2 Report');
		row = 1;
		ws2.cell(row, 1)
			.string("Incidents Crisis Level 2 Information")
			.style(cmsSubTitleStyle)
		row += 1
		generateTable(ws2, incidentsTotal[1], row)

		// Level 3

		var ws3 = wb.addWorksheet('Incident Level 3 Report');
		row = 1;
		ws3.cell(row, 1)
			.string("Incidents Crisis Level 3 Information")
			.style(cmsSubTitleStyle)
		row += 1
		generateTable(ws3, incidentsTotal[2], row)

		// add PSI

		var ws4 = wb.addWorksheet('PSI Report');
		row = 1;
		ws4.cell(row, 1)
			.string("PSI Information")
			.style(cmsSubTitleStyle)
		row += 1
		generateTable(ws4, psiArr, row)

		// add Dengue

		var ws5 = wb.addWorksheet('Dengue Report');
		row = 1;
		ws5.cell(row, 1)
			.string("Dengue Information")
			.style(cmsSubTitleStyle)
		row += 1
		generateTable(ws5, dengueArr, row)
		// pull info from incident

		//console.log("Creating report for " + type + " at:" + new Date())

		var finalReportName = reportName.concat('.xlsx')
		wb.write("./reports/"+finalReportName, function (err, stats) {
			if (err) {
				console.error(err)
				reject(err)
			} else {
				// Prints out an instance of a node.js fs.Stats object
				resolve("Manually")
			}
		});
	})
}

function generateGeneralInfo(ws, object, row) {

	// summarise the info
	// state number of incidents at Level 1
	var incidentsCrisis1 = object[0].length
	//console.log('IncidentsCrisis1: ', incidentsCrisis1)
	var incidentsCrisis2 = object[1].length
	//	console.log('IncidentsCrisis2: ', incidentsCrisis2)
	var incidentsCrisis3 = object[2].length
	var totalIncidents = incidentsCrisis1 + incidentsCrisis2 + incidentsCrisis3

	var str1 = ("Number of Level 1 Incidents: ").concat(incidentsCrisis1.toString());
	var str2 = ("Number of Level 2 Incidents: ").concat(incidentsCrisis2.toString());
	var str3 = ("Number of Level 3 Incidents: ").concat(incidentsCrisis3.toString());
	var str4 = ("Total Number of Incidents: ").concat(totalIncidents.toString());


	ws.cell(row, 1)
		.string(str4)
		.style(cmsTitleStyle)

	row += 2

	ws.cell(row, 1)
		.string(str1)
		.style(cmsSubTitleStyle)

	row += 1

	ws.cell(row, 1)
		.string(str2)
		.style(cmsSubTitleStyle)

	row += 1

	ws.cell(row, 1)
		.string(str3)
		.style(cmsSubTitleStyle)
}

function generateTable(ws, object, row) {

	//console.log("Object", object)

	if (object === null || object === undefined || object.length == 0) {
		// write empty results
		ws.cell(row, 1)
			.string("No results returned")
			.style(noResults)
		return
	}

	var object1 = Object.keys(object[0])

	for (var i = 0; i < object1.length; i++) {
		ws.column(1 + i).setWidth(30)
		ws.cell(row, 1 + i)
			.string(object1[i])
			.style(cmsSubTitleStyle)
	}

	row += 1
	for (var i = 0; i < object.length; i++) {
		var objectInfo = Object.values(object[i])

		for (var y = 0; y < objectInfo.length; y++) {

			var value = objectInfo[y]
			var info = value.toString()
			ws.cell(row, 1 + y)
				.string(info)
				.style(cmsBodyStyle)
		}

		row += 1
	}
}

function sortCrisisLevel(incidentsArr) {

	incidentsCrisis1 = []
	incidentsCrisis2 = []
	incidentsCrisis3 = []
	incidentsTotal = []

	for (var i = 0; i < incidentsArr.length; i++) {
		incident = incidentsArr[i]
		//	console.log("Incident: ", incident)
		if (incident.incident_crisis_level === 1)
			incidentsCrisis1.push(incident)
		else if (incident.incident_crisis_level === 2)
			incidentsCrisis2.push(incident)
		else if (incident.incident_crisis_level === 3)
			incidentsCrisis3.push(incident)
	}
	incidentsTotal.push(incidentsCrisis1)
	//	console.log("Incident1: ", incidentsCrisis1)
	incidentsTotal.push(incidentsCrisis2)
	//	console.log("Incident2: ", incidentsCrisis2)
	incidentsTotal.push(incidentsCrisis3)
	//	console.log("Incident3: ", incidentsCrisis3)
	return incidentsTotal
}