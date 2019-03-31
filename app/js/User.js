var mongoose = require('mongoose');

class User {
    /*constructor() {
       this.userSchema = new mongoose.Schema({
            email: {
                type: String,
                unique: true,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            hash: String,
            salt: String
        });
    } */
    constructor(email, firstname, lastname, hash) {
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.hash = hash;
    }
}