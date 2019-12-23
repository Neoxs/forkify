// Global app controller
import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import Recipe from './models/Recipe';


/* Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes 
*/
const state = {};
/** SEARCH CONTROLLER **/ 

const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput(); //

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults();
            
            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch(err) {
            alert('Something wrong with the search...');
            clearLoader();
        }
        
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});
/** RECIPE CONTROLLER **/

    const controlRecipe = async () => {
        // Get ID from url
        const hash = window.location.hash.split('/');
        const query = hash[1];
        const id = hash[0].replace('#', '');
        

        if (id) {
            // Prepare UI for changes
            recipeView.clearRecipe();
            renderLoader(elements.recipe);

            // Highlight selected search item
            if (state.search) searchView.highlightSelected(`${id}/${query}`);

            // Create new recipe object
            state.recipe = new Recipe(id);
            

            // Get recipe data and parse ingredients
          
            if (state.search) {

                state.recipe.getRecipe(state.search.result);
                state.recipe.parseIngredients();

            } else {
                // search for the recipe and then get the recipe
                // new search object
                const resSearch = new Search(query);
                try {

                    // search for recipe
                    await resSearch.getResults();

                    // Get recipe data
                    state.recipe.getRecipe(resSearch.result);
                    state.recipe.parseIngredients();

                } catch(error) {
                    console.log(error);
                    alert('Error processing recipe!');
                }


            }

            // Calculate servings and time
            state.recipe.calcTime();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        }

        
    };

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
   if(e.target.matches('.btn-decrease, .btn-decrease *')) {
       //Decrease button is clicked

       if (state.recipe.servings > 1) {           
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);

       }
   } else if (e.target.matches('.btn-increase, .btn-increase *')) {
       // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
   }
   console.log(state.recipe);
});
    
   