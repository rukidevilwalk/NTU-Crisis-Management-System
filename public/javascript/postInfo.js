/* Author(s): Royston Beh Zhi Yang */

// Request to the server to get the API then display data
function sendTwitterInfo(tweet) {
	console.log("Tweet: ", tweet)
	client.emit('sendTwitterInfo', tweet, function () {})
}

function sendFbInfo(fb_info) {
	console.log("Fb_info: ", fb_info)
	client.emit('sendFbInfo', fb_info, function () {})
}


function sendSmsInfo(sms_info, resources_selected) {
	console.log("Sms_info: ", sms_info)
	client.emit('updateActionsTaken', resources_selected, function () {})
	client.emit('sendSmsInfo', sms_info, function () {})
}

function generateReport(email) {
	client.emit('generateReport',email,function () {})

}