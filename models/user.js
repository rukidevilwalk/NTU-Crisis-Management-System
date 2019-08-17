/* Author(s): Chiam Jack How */
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
 		type: String
    },
   password: {
        type: String
    },
     contact_number: {
        type: String
    },
     email: {
        type: String
    },
    role: {
        type: String,
        enum: ['staff', 'minister', 'admin'],
        default: 'staff'
    }
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose);
mongoose.model("user", userSchema)
module.exports = mongoose.model("User", userSchema);
