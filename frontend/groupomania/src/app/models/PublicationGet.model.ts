export class PublicationGet {
    constructor(
        public id: string,
        public imageUrl: string,
        public commentCount: string,
        public comment: [],
        public description: string,
        public dislike: string,
        public like: string,
        public publicationDate: string,
        public title: string,
        public userId: string,
        public user: {
            firstname: string,
            image: string,
            lastname: string
        }
    ) { }
}