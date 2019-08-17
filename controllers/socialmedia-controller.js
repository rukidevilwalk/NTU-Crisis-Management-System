/* Author(s): Royston Beh Zhi Yang */
const compose = require('request-compose')
compose.Request.oauth = require('request-oauth')
var request = compose.client
const twilio = require('twilio');
const nodemailer = require('nodemailer');

exports.postTwitterInfo = function (tweet) {

	;
	(async () => {
		try {
			var {
				body
			} = await request({
				url: 'https://api.twitter.com/1.1/statuses/update.json?include_entities=true',
				qs: {
					status: tweet
				},
				oauth: {
					consumer_key: 'JClBS78H2wCPmvcoAFY5EwQEo',
					consumer_secret: 'OqIksD4hinowMcf5MmTklr0xU30XvM4nAECSdfHV6VQdaP27EB',
					token: '1054947428422557696-vrznVpDlQUzsy00JPsKJAPkL1mVu8M',
					token_secret: 'TjjOZTYHAyjvhqCy97J1dJ8Xc5OMe4oF9boVOZ9UhVs6O',
				},
				method: "POST"
			})
			//console.log(body)
		} catch (err) {
			console.error(err)
		}
	})()

}

exports.postFbInfo = function (fb_info) {

	;
	(async () => {
		try {
			var {
				body
			} = await request({
				url: 'https://graph.facebook.com/1099218763620046/feed',
				qs: {
					message: fb_info,
					access_token: 'EAAeqRP5LQq0BAG8uXDmY9V3cUmwBPObZACgFiBccpGzc7Q3hKu0tTaQMJSZAED80H6IlXY1tUT1Q0HFhxSPqsFkDLSJ8L6v8GbZAftymcXIdXTGYGbO1Irmty9SPTh6hOHmxlozze6PUe0LQmsI7KeZBleMb13VThasEfcOKnQZDZD'
				},
				method: "POST"
			})
			console.log(body)
		} catch (err) {
			console.error(err)
		}
	})()
}

exports.postSmsInfo = function (sms_info) {

	var accountSID = 'AC0601bfa8e65014dc98eac6b00bbfd493'
	var authToken = 'b216347714b5b4d12a3b4028e2a17a59'
	var client = new twilio(accountSID, authToken)

	if (sms_info == null || sms_info == "")
		return

	client.messages.create({
			body: sms_info,

			// currently this is the number that it can send as the sms_number is uselss
			to: '+6590055399', // Text this number
			from: '+18722313230' // From a valid Twilio number
		})
		.then((message) => console.log(message.sid))
		.done();
}

exports.postEmailInfo = function (type,email) {


	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'cms404test@gmail.com',
			pass: 'ntucms404'
		}
	});

	var mailOptions = {
		from: 'cms404test@gmail.com',
		to: email,

		subject: '30 mins ' + type + ' Generated Report',
		text: 'This is the 30mins report',

		attachments: [{
				filename: 'Ongoing Incidents Report.xlsx',
				path: './reports/Ongoing_Incidents_Report.xlsx'
			},
			{
				filename: 'Resolved Incidents Report.xlsx',
				path: './reports/Resolved_Incidents_Report.xlsx'
			}
		]

	}


	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error)
		} else {
			//console.log('Email sent: ' + info.response)
			console.log(type + " generated email sent at:" + new Date())
		}
	});

}