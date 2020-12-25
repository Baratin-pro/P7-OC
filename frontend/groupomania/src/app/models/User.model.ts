export class User {
    public passwords: string;
    public names: string;
    public firstnames: string;
    public emails: string;
    //public idUsers: string | null;
    // public image: null | string,

    constructor(passwords: string, names: string, firstnames: string, emails: string) {
        this.passwords = passwords;
        this.names = names;
        this.firstnames = firstnames;
        this.emails = emails;

    }
}
