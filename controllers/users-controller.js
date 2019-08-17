/* Author(s): Chiam Jack How */
const mongoose = require("mongoose")
const dateformat = require("dateformat")

const Users = mongoose.model("user")

exports.getUsers = function () {
    return new Promise(function (resolve, reject) {
        var usersArr = []
        Users.find({}, function (err, data) {
            if (err) {
                reject(err)
            } else if (data === undefined || data.length == 0) {
                resolve("empty")
            } else {
                for (let user of data) {
                    const usersData = {
                        id: user._id,
                        username: user.username,
                        role: user.role,
                        contact_number: user.contact_number,
                        email: user.email
                    }
                    usersArr.push(usersData)
                }
                resolve(usersArr)

            }
        })
    }).catch(err => {
        console.log(err)
    })
}

exports.updateUser = function (data) {
    return new Promise(function (resolve, reject) {

        Users.findById({
            _id: data.id
        }, function (err, user) {
            if (err) {
                reject(err)
            }
            // Assign new attributes to the current variables
            user.username = data.username
            user.email = data.email
            user.contact_number = data.contact_number
            user.role = data.role

            // Update the db record
            user.save(function (err, user) {
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

exports.deleteUser = function (user_id) {
    return new Promise(function (resolve, reject) {

        Users.deleteOne({
            _id: user_id
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