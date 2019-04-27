class Database {
    url = 'mongodb://localhost:27017/timebank';
    userSchema = mongoose.Schema({
        email: {
            type: String,
            unique: true,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        hash: String,
        salt: String
    });
    userModel = mongoose.model('User', userSchema);


    connect() {
        mongoose.connect(url, {useNewUrlParser: true});
    }

    createUserSchema() {

    }

    doesUserExist(user) {
        
    }

    addUser(user) {
        var us = new this.userModel({email: user.email, 
        firstname: user.firstname, lastname: user.lastname,
    hash: user.hash, user: salt});
        us.save((err, u) => {
            if (err) return console.error(err);
            console.log(user.firstname + " saved");
        });
    }
}