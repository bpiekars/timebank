class Database {
    constructor(url) {
        this.url = url;
    }

    connect() {
        mongoose.connect(url, {useNewUrlParser: true});
    }

    doesUserExist(user) {
        
    }
}