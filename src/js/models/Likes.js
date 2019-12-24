export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, query, title, author, img) {
        const like = { id, query, title, author, img };
        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Oersist data in localStorage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
    }
}