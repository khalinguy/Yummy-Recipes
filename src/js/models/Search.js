import axios from 'axios';

export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResults() {
        try {
            const apiKey = `2af065936b4f467aafaf716a555b52d0`; //Spoonacular API
            const API = `https://forkify-api.herokuapp.com/api/search?q=${this.query}`; //Forkify API
            //const API = `https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&query=${this.query}`; //Spoonacular API
            const res = await axios(API);
            this.result = res.data.recipes; //Forkify API
            // this.result = res.data.results; //Spoonacular API
            //console.log(this.result);
        } catch (error){
            alert(error + ' Sorry! There are no recipes for what you searched :(');
        }
    }

}