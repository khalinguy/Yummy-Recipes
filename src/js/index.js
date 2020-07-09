import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';

import {elements, renderLoader, clearLoader} from './views/base';
/**Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 * @type {{}}
 */

const state = {};
window.s = state;

/** SEARCH CONTROLLER **/
const controlSearch = async () => {
    const query = searchView.getInput();

    if (query) {
        //New search object to state
        state.search = new Search(query);

        //Clear input and search list
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            //Search for recipes
            await state.search.getResults();

            //Render result on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err){
            clearLoader();
            alert('Something went with the search...');
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if (button){
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/** RECIPE CONTROLLER **/
const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#','');
    //console.log(id);

    if (id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected item
        if (state.search){
            searchView.highlightSelected(id);
        }

        //Create new recipe object
        state.recipe = new Recipe(id);

        try {
            //Get recipe data and parse ing
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (err){
            alert(err + 'Error processing recipe!');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// LIST CONTROLLER

const controlList = () => {
    //Create a new list if there is none yet
    if (!state.list) state.list = new List();

    //Add each ingredient to the list and show in UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    } else if (e.target.matches('.shopping__count-value')){
        console.log(e.target.value);
        console.log(parseFloat(e.target.value, 10));
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id,val);
    }
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1) {
            state.recipe.updateServing('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if ((e.target.matches('.btn-increase, .btn-increase *'))){
        state.recipe.updateServing('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }
});

window.l = new List();