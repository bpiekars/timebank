import isEmail from 'validator/lib/isEmail';

class Auth {
    static isEmailValid(email) {
        return validator.isEmail(email);
    }
}