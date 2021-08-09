export class User {
    public password: string;
    public lastname: string;
    public firstname: string;
    public email: string;
    //public idUsers: string | null;
    // public image: null | string,

    constructor(password: string, lastname: string, firstname: string, email: string) {
        this.password = password;
        this.lastname = lastname;
        this.firstname = firstname;
        this.email = email;

    }
}
