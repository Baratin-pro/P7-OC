export class Comment {
    constructor(
        public idComments: number | null,
        public comments: string,
        public publicationsId: number,
        public usersId: number
    ){}
}
