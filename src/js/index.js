// Global app controller
import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
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
        console.log(id);

        if (id) {
            // Prepare UI for changes

            // Create new recipe object
            state.recipe = new Recipe(id);


            // Get recipe data
          
            if (state.search) {

                state.recipe.getRecipe(state.search.result);

            } else {
                // search for the recipe and then get the recipe
                // new search object
                const resSearch = new Search(query);
                try {

                    // search for recipe
                    await resSearch.getResults();

                    // Get recipe data
                    state.recipe.getRecipe(resSearch.result);

                } catch(error) {
                    console.log(error);
                    alert('Error processing recipe!');
                }


            }

            // Calculate servings and time
            state.recipe.calcTime();

            // Render recipe
            console.log(state.recipe);
        }

        
    };
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

    
   