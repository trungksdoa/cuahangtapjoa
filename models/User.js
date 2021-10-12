class Users {
    constructor(id, username, email, password, roles, dateCreated) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.dateCreated = dateCreated;
    }
}
module.exports = Users;