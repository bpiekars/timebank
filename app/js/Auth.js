import isEmail from 'validator/lib/isEmail';

class Auth {
    static isEmailValid(email) {
        return validator.isEmail(email);
    }

    static isPasswordValid(pass) {
        return pass.length >= 8;
    }

    static initializeSchema() {
        
    }
    
}