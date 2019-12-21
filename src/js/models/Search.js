import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const APP_ID = "6b1af75a";
        const APP_KEY = "ab60f13bf2dec77ad4d7e5317db32858";
        try {
            const res = await axios(`${proxy}https://api.edamam.com/search?q=${this.query}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=30`);
            this.result = res.data.hits;
            //console.log(this.result);
        } catch (error) {
            alert(error);
        }
        
    }

}





//getResults('pizza');