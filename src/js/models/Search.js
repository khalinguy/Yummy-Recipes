import axios from 'axios';

export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResults() {
        try {
            const API = `https://forkify-api.herokuapp.com/api/search?&q=${this.query}`;
            const res = await axios(API);
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch (error){
            alert(error);
        }
    }

}