const user = {
    'Duy1': 'Duy1',
    'Duy2': 'Duy2'
}

module.exports = class User {
    constructor() {}

    static login(username, password) {
        if(user[username] !== null && user[username] === password) {
            return {
                username: username,
                token: username + `-${Date.now()}`,
                status: true
            }
        }
        return {
            status: false,
            error: 'Wrong username and password'
        }
    }
    
    save(username, password) {
        user[username] = password
    }

    static getUser(username) {
        return user[username]
    }

    static verifyToken(token) {
        let splitted = token.split('-')
        let username = splitted[0]
        return username in user
    }

    static getUsernameFromToken(token) {
        let splitted = token.split('-')
        let username = splitted[0]
        return username
    }
}