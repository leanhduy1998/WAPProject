const user = {
    'Anh Duy': 'Duy Anh',
    'Duy 1': '1',
    'Duy 2': '2'
}

module.exports = class User {
    constructor() {}

    static login(username, password) {
        if(user[username] === password) {
            return {
                username: username,
                token: username + `-${Date.now()}`,
                status: true
            }
        }
        return {
            status: false
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
        return user[username] !== null
    }

    static getUsernameFromToken(token) {
        let splitted = token.split('-')
        let username = splitted[0]
        return username
    }
}