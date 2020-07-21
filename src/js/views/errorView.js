import {elements} from './base';

export const searchError = error => {
    clearError();
    const markup = `
        <p style="font-size:20px; color:#f47672; text-align: center; margin-top: 20px">Sorry! There are no recipes for what you just searched :( <br> Please try another one.</p>
    `;

    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const recipeError = error => {
    clearError();
    const markup = `
        <p style="font-size:20px; color:#f47672; text-align: center; margin-top: 10px">Error processing recipe! <br> Please try again!</p>
    `;

    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const clearError = () => {
    elements.recipe.innerHTML = '';
};