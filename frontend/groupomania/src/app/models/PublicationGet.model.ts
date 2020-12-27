export class PublicationGet {
    constructor(
        public idPublications: string,
        public imagesUrl: string,
        public commentCount: string,
        public comment: [],
        public descriptions: string,
        public dislikes: string,
        public likes: string,
        public publicationsDate: string,
        public titles: string,
        public usersId: string,
        public user: {
            firstnames: string,
            image: string,
            names: string
        }
    ) { }
}