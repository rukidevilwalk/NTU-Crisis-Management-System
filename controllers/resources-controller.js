/* Author(s): Chiam Jack How */
const mongoose = require("mongoose")
const dateformat = require("dateformat")

const Resources = mongoose.model("resources")

exports.getResources = function () {
    return new Promise(function (resolve, reject) {
        const resourcesArr = []
        Resources.find({}, function (err, data) {
            if (err) {
                reject(err)
            } else if (data === undefined || data.length == 0) {
                resolve("empty")
            } else {
                for (let resource of data) {
                    const newResource = {
                        resource_id: resource._id,
                        resource_name: resource.resource_name,
                        resource_email: resource.resource_email,
                        resource_tel: resource.resource_tel,
                        resource_sms: resource.resource_sms,
                        resource_purpose: resource.resource_purpose
                    }
                    resourcesArr.push(newResource)
                }
                resolve(resourcesArr)

            }
        })

    }).catch(err => {
        console.log(err)
    })
}

exports.updateResource = function (data) {
    return new Promise(function (resolve, reject) {

        Resources.findById({
            _id: data.resource_id
        }, function (err, resource) {
            if (err) {
                reject(err)
            }
            // Assign new attributes to the current variables
            resource.resource_name = data.resource_name
            resource.resource_email = data.resource_email
            resource.resource_tel = data.resource_tel
            resource.resource_sms = data.resource_sms
            resource.resource_purpose = data.resource_purpose

            // Update the db record
            resource.save(function (err, resource) {
                if (err) {
                    reject(err)
                }
                resolve("Update Successful")
            })

        })


    }).catch(err => {
        console.log(err)
    })

}

exports.addResource = function (data) {
    return new Promise(function (resolve, reject) {

        const newResource = {
            _id: new mongoose.Types.ObjectId(),
            resource_name: data.resource_name,
            resource_email: data.resource_email,
            resource_tel: data.resource_tel,
            resource_sms: data.resource_sms,
            resource_purpose: data.resource_purpose
        }

        Resources.create(newResource, function (err, resource) {
            if (err) {
                reject(err)
            }

            resolve("Add Successful")

        })

    }).catch(err => {
        console.log(err)
    })

}

exports.deleteResource = function (resource_id) {
    return new Promise(function (resolve, reject) {

        Resources.deleteOne({
            _id: resource_id
        }, function (err) {
            if (err) {
                reject(err)
            }

            resolve("Delete Successful")
        })

    }).catch(err => {
        console.log(err)
    })

}