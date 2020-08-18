// // when we want to export a single things
// export default "I am an exporter";

// // when we want to do multiple exports

// export const add = (a, b) => a + b;
// export const multiply = (a, b) => a * b;
// export const ID = 23;

import { elements } from "./base";

export const getInput = () => {
  return elements.searchInput.value;
};

export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((accumulator, current) => {
      if (accumulator + current.length <= 17) {
        newTitle.push(current);
      }
      // updating accumulator
      return accumulator + current.length;
    }, 0);
    // return the result
    return `${newTitle.join(" ")}...`;
  }
  return title;
};

const renderRecipe = (recipe) => {
  const markup = `
    <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${
                              recipe.image_url
                            }" alt="${limitRecipeTitle(recipe.title)}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(
                              recipe.title
                            )}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
    </li>
    
    `;
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};

export const highlightSelected = (id) => {
  const recipeArr = Array.from(document.querySelectorAll(".results__link"));
  recipeArr.forEach((el) => {
    el.classList.remove("results__link--active");
  });
  document
    .querySelector(`.results__link[href*="#${id}"]`)
    .classList.add("results__link--active");
};

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResult = () => {
  elements.searchResultList.innerHTML = "";
  elements.searchRecPages.innerHTML = "";
};

// <!--
// <button class="btn-inline results__btn--prev">
//     <svg class="search__icon">
//         <use href="img/icons.svg#icon-triangle-left"></use>
//     </svg>
//     <span>Page 1</span>
// </button>
// <button class="btn-inline results__btn--next">
//     <span>Page 3</span>
//     <svg class="search__icon">
//         <use href="img/icons.svg#icon-triangle-right"></use>
//     </svg>
// </button>
// -->

// type : 'prev' or 'next'
const createButton = (page, type) => {
  // this goToPage is auto converted to lowercase
  // infact everything inside a tage is converted to lowercase
  return `
    <button class="btn-inline results__btn--${type}" data-goToPage=${
    type === "prev" ? page - 1 : page + 1
  }>
  <span>Page ${type === "prev" ? page - 1 : page + 1} </span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === "prev" ? "left" : "right"
            }"></use>
        </svg>

    </button>
    `;
};

const renderButtons = (page, numRecipes, resPerPage) => {
  const pages = Math.floor(numRecipes / resPerPage) + 1;

  let button;
  if (page == 1 && pages > 1) {
    // button to go to next pages if pages > page
    button = createButton(page, "next");
  } else if (page < pages) {
    // both buttons
    button = `
        ${createButton(page, "prev")}
        ${createButton(page, "next")}
    `;
  } else if (page === pages && pages > 1) {
    // button to go to previous page
    button = createButton(page, "prev");
  }

  elements.searchRecPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // render results of the current Page
  const start = (page - 1) * resPerPage;
  const end = start + resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);
  //   recipes.forEach((el) => {
  //     console.log(el);
  //   });

  // render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
