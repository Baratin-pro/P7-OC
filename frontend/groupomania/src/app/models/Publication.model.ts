export class Publication {
    constructor(
        public idPublications: number |null,
        public titles: string,
        public descriptions: string,
        public imagesUrl: string,
        public commentCount: number,
        public likes: number,
        public dislikes: number,
        public usersId: number
    ){}
}
