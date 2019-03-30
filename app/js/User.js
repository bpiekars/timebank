var mongoose = require('mongoose');

class User {
    constructor() {
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
    }
}