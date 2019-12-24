// Global app controller
import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';



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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
        }

        
    };

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
    } else if(e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


/**
 * LIKES CONTROLLER
 */


const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    const query = window.location.hash.split('/')[1];


    // User has NOT yet licked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            query,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);
        
    
    // User HAS liked current recipe
    } else {
        // Remove like from the satate
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);
        
        // Remove like from UI list
        likesView.deleteLike(currentID, query);
        
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

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
   } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
       controlList();
   } else if (e.target.matches('.recipe__love, .recipe__love *')) {
       // Like controller
       controlLike();
   }
});
    
