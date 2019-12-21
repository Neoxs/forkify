import axios from 'axios';



/* Well the API that i'm working with doesn't afford me to get recipe information by its own id
So what i'm doing here is trying to simulate that with the funtion here "telba9()"
u got to be creative mannn ! :) */

const telba9 = (data, ID) => {
    const recipe = data.map(el => el.recipe);
    const recipeURI = recipe.map(el => el.uri);
    const index = recipeURI.indexOf(`http://www.edamam.com/ontologies/edamam.owl#recipe_${ID}`);
    return recipe[index];
} 

export default class Recipe {
    constructor(id) {
        this.id = id
    }

    getRecipe(data) {

        try {
            const recipe = telba9(data, this.id);

            this.title = recipe.label;
            this.author = recipe.source;
            this.img = recipe.image;
            this.url = recipe.url;
            this.ingredients = recipe.ingredientLines;
            this.servings = recipe.yield;
        } catch (error) {
            console.log(error);
            alert('something went wrong :(');
        }

    }

    calcTime() {
        // Assuming that we need 5 min for each ingredients
        const numIng = this.ingredients.length;
        this.time = numIng * 5;
    }

    calcServigs() {

    }
}