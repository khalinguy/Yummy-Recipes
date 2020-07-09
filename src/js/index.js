import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {elements, renderLoader, clearLoader} from './views/base';
/**Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 * @type {{}}
 */

const state = {};

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
    }
    console.log(state.recipe);
});