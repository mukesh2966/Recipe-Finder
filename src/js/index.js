// ///------ way to import default export
// import string1 from "./models/Search";

// //////////////////////////////////////////

// ///------- ways to import named exports

// // have to use exact same names as exported ones
// // import { add, ID } from "./models/Search";

// // can also use different names-- by this method
// import { add as a, ID as i } from "./models/Search";

// ////////////////////////////////////////////

// ///------- for importing everything
// import * as searchView from "./views/searchView";

// //////////////////////////////////////////////
// console.log(string1);
// console.log(a(2, 3));
// console.log(i);

// console.log(searchView.default);
// console.log(searchView.multiply(3, 3));

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//---------------going to be controller----------------- //

// import axios from "axios";

// async function getResults(query) {
//   try {
//     const res = await axios(
//       `https://forkify-api.herokuapp.com/api/search?&q=${query}`
//     );
//     const recipes = res.data.recipes;
//     console.log(recipes);
//   } catch (error) {
//     console.log("Sorry, we cannot find your recipe");
//   }
// }
// getResults("chicken");

import Search from "./models/Search";
import Recipe from "./models/Recipe";
import ShoppingList from "./models/ShoppingList";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as shoppingListView from "./views/shoppingListView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

/* global state of the app
    search object -- query,result
    current recipe object 
    shopping list object
    liked object
*/
const state = {};
// window.state = state;
///////////////////////////////////////////////////////
// Serach controller

const controlSearch = async () => {
  // 1. get query
  const query = searchView.getInput(); // later will define a method for it in view module
  // console.log(query);

  if (query) {
    //2. create new search object and add to state
    state.search = new Search(query);
  }

  // 3. prepare UI for result
  searchView.clearInput();
  searchView.clearResult();
  // render loader
  renderLoader(elements.searchResults);

  try {
    // 4. serach for recipes
    await state.search.getResults();

    // 5. render results on UI
    clearLoader();

    // console.log(state.search.result);
    searchView.renderResults(state.search.result);
  } catch (error) {
    alert("Something wrong with the searchResults");
    clearLoader();
  }
};

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  controlSearch();
});
// window.addEventListener("load", controlSearch);

// const search = new Search("pizza");
// // console.log(search);
// search.getResults();

//////////////////////////////////////////////////
// handling pagination

// using event delegation
// pages button is not on the page when it loads, so we attach event listener to div class = results__pages and then we try to figure out where the click happened based on that.

elements.searchRecPages.addEventListener("click", (event) => {
  // console.log(event.target);
  // three differnt targets appear when i tryna click on button
  // 1) svg arrow
  // 2) span for text
  // 3) button tag

  // so to resolve when we want event to happen we use
  // CLOSEST property is js

  // this will always output button tag, irrespective of where we click inside it, till the parameter is given as class - btn-inline
  const button = event.target.closest(".btn-inline");
  // console.log(button);
  if (button) {
    const goToPage = parseInt(button.dataset.gotopage, 10);
    searchView.clearResult();
    searchView.renderResults(state.search.result, goToPage);
    // console.log(goToPage);
  }
});

///////////////////////////////////////////////////////
// Recipe Controller

// const r = new Recipe(47025);
// r.getRecipe();
// console.log(r);

const controlRecipe = async () => {
  // 1) get id from url
  // window.location is an object containing info about the entire url
  const id = window.location.hash.replace("#", "");
  // console.log(id);

  // if we have an id
  if (id) {
    // 2) Prepare the UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // highlight selected search
    if (state.search) {
      searchView.highlightSelected(id);
    }

    // 3) Create the recipe object
    state.recipe = new Recipe(id);

    // // // testing
    // window.r = state.recipe;

    try {
      // 4) get recipe data and parse ingredients
      await state.recipe.getRecipe();
      // console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();

      // 5) calc time and servings
      // console.log("hereeeeeee");
      state.recipe.calcServings();
      state.recipe.calcTime();

      // 6) render recipe
      clearLoader();
      const isLiked1 = !state.likes ? false : state.likes.isLiked(id);
      recipeView.renderRecipe(state.recipe, isLiked1);

      // state.recipe.parseIngredients();
      // console.log(state.recipe);
    } catch (error) {
      alert("Error processing recipe");
      // console.log(error);
    }
  }
};

// ADDING SAME EVENT LISTENERS to different events
// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

["hashchange", "load"].forEach((event) => {
  window.addEventListener(event, controlRecipe);
});

////////////////////////////////////////////////
// ShoppingList container

const controlList = () => {
  // create a new List if there is none yet
  if (!state.list) {
    state.list = new ShoppingList();
  }
  // add each ingredient to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addNewItem(el.quantity, el.unit, el.ingredient);
    shoppingListView.renderItem(item);
  });
};

////////////////////////////////////////////////
//// handle delete shoppin list and inc/dec quantity
elements.shopping.addEventListener("click", (event) => {
  const id = event.target.closest(".shopping__item").dataset.itemid;

  // handle delete button
  if (event.target.matches(".shopping__delete, .shopping__delete *")) {
    // delete from state
    state.list.deleteItem(id);

    // delete from UI
    shoppingListView.deleteItem(id);
  }
  // updating the quantity
  else if (event.target.matches(".shopping__count--value")) {
    let value = parseFloat(event.target.value, 10);
    state.list.updateCount(id, value);
  }
});

elements.shopping.addEventListener("keyup", (event) => {
  const id = event.target.closest(".shopping__item").dataset.itemid;
  if (event.target.matches(".shopping__count--value")) {
    let value1 = parseFloat(event.target.value, 10);
    state.list.updateCount(id, value1);
  }
});

//////////////////////////////////////////////////
// LIKES Controller
// if (!state.likes) {
//   const numLikes = 0;
//   likesView.toggleLikeMenu(numLikes);
// }
// OR
// state.likes = new Likes();
// likesView.toggleLikeMenu(state.likes.getNumLikes());
const controlLike = () => {
  if (!state.likes) {
    state.likes = new Likes();
  }
  const currentId = state.recipe.id;
  if (!state.likes.isLiked(currentId)) {
    // user has not yet liked current recipe
    // add like to state
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.image
    );
    // toggle like button to on
    likesView.toggleLikeBtn(true);
    // add like to UI list
    likesView.renderLike(newLike);
  } else {
    // already liked by user
    // remove like from the state
    state.likes.deleteLike(currentId);
    // toggle the like button to off
    likesView.toggleLikeBtn(false);
    // remove like from UI
    likesView.deleteLike(currentId);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// restore like recipes from localStorage
window.addEventListener("load", () => {
  state.likes = new Likes();
  // restoring likes
  state.likes.readStorage();
  // toggle like menu button on header
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  // render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

//////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////---event delegation --- slightly different form////////
//////// increment and decrement of servings

elements.recipe.addEventListener("click", (event) => {
  if (event.target.matches(".btn-decrease, .btn-decrease *")) {
    // decrease button clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateSI(state.recipe);
    }
  } else if (event.target.matches(".btn-increase, .btn-increase *")) {
    // increase button clicked
    state.recipe.updateServings("inc");
    recipeView.updateSI(state.recipe);
  }
  // console.log(state.recipe);
  else if (event.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // console.log("button pressed");
    // add ingredients to shopping list
    controlList();
  } else if (event.target.matches(".recipe__love, .recipe__love *")) {
    // call like controller

    controlLike();
  }
});

// const l = new ShoppingList();
// window.list1 = l;
