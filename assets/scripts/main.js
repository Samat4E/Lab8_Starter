// main.js

// CONSTANTS
const RECIPE_URLS = [
  'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
// initialize ServiceWorker
initializeServiceWorker();
// Get the recipes from localStorage
let recipes;
try {
  recipes = await getRecipes();
} catch (err) {
  console.error(err);
}
// Add each recipe to the <main> element
addRecipesToDocument(recipes);
}

/**
* Detects if there's a service worker, then loads it and begins the process
* of installing it and getting it running
*/
function initializeServiceWorker() {
// EXPLORE - START (All explore numbers start with B)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
}

/**
* Reads 'recipes' from localStorage and returns an array of
* all of the recipes found (parsed, not in string form). If
* nothing is found in localStorage, network requests are made to all
* of the URLs in RECIPE_URLs, an array is made from those recipes, that
* array is saved to localStorage, and then the array is returned.
* @returns {Array<Object>} An array of recipes found in localStorage
*/
async function getRecipes() {
// EXPOSE - START (All expose numbers start with A)
// A1. TODO - Check local storage to see if there are any recipes.
//            If there are recipes, return them.
const localData = localStorage.getItem('recipes');
if (localData) {
  return JSON.parse(localData);
}

// A2. TODO - Create an empty array to hold the recipes that you will fetch
const recipes = [];

// A3. TODO - Return a new Promise. If you are unfamiliar with promises, MDN
//            has a great article on them. A promise takes one parameter - A
//            function (we call these callback functions). That function will
//            take two parameters - resolve, and reject. These are functions
//            you can call to either resolve the Promise or Reject it.
return new Promise(async (resolve, reject) => {
  // A4. TODO - Loop through each recipe in the RECIPE_URLS array constant
  for (let i = 0; i < RECIPE_URLS.length; i++) {
    const url = RECIPE_URLS[i];
    // A5. TODO - Since we are going to be dealing with asynchronous code, create
    //            a try / catch block. A6-A9 will be in the try portion, A10-A11
    //            will be in the catch portion.
    try {
      // A6. TODO - For each URL in that array, fetch the URL
      const response = await fetch(url);
      // A7. TODO - For each fetch response, retrieve the JSON from it using .json()
      const recipeData = await response.json();
      // A8. TODO - Add the new recipe to the recipes array
      recipes.push(recipeData);
      // A9. TODO - Check to see if you have finished retrieving all of the recipes,
      if (recipes.length === RECIPE_URLS.length) {
        // Save to storage and resolve
        saveRecipesToStorage(recipes);
        resolve(recipes);
      }
    } catch (error) {
      // A10. TODO - Log any errors from catch using console.error
      console.error(error);
      // A11. TODO - Pass any errors to the Promise's reject() function
      reject(error);
    }
  }
});
}

/**
* Takes in an array of recipes, converts it to a string, and then
* saves that string to 'recipes' in localStorage
* @param {Array<Object>} recipes An array of recipes
*/
function saveRecipesToStorage(recipes) {
localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
* Takes in an array of recipes and for each recipe creates a
* new <recipe-card> element, adds the recipe data to that card
* using element.data = {...}, and then appends that new recipe
* to <main>
* @param {Array<Object>} recipes An array of recipes
*/
function addRecipesToDocument(recipes) {
if (!recipes) return;
let main = document.querySelector('main');
recipes.forEach((recipe) => {
  let recipeCard = document.createElement('recipe-card');
  recipeCard.data = recipe;
  main.append(recipeCard);
});
}
