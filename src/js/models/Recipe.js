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

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g', 'lb'];

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');


            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            
            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };


            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but 1st element is number      
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if(unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }   

    updateServings (type) {
        // Servings 
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}