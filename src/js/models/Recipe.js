import axios from 'axios';
import * as errorView from '../views/errorView';

export default class Recipe{
    constructor(id) {
        this.id = id;

    }

    async getRecipe(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            errorView.recipeError(error);
            //console.log(error);
            //alert('Something went wrong :(');
        }
    }

    calcTime(){
        //Estimate that time need for each 3 ingredients is 15 mins
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp','tbsp','oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const unit = [...unitsShort, 'kg', 'g']

        const newIngredients = this.ingredients.map(el => {
            //Uniform unit
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            })

            // Eliminate parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //Parse ingredients into count, unit and ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unit.includes(el2));

            let objInt;
            if (unitIndex > -1) {
                //There is a unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count ;
                if (arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objInt = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join (' ')
                }

            } else if (parseInt(arrIng[0],10)) {
                // There is NO unit, but 1st element is number
                objInt = {
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is No unit and no number in 1st position
                objInt = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objInt;
        });
        this.ingredients = newIngredients;
    }

    updateServing (type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings/this.servings);
        });

        this.servings = newServings;
    }
};