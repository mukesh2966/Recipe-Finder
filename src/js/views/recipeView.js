import { elements } from "./base";
// from a 3rd party dependency
import { Fraction } from "fractional";

const formatCount = (quantity) => {
  if (quantity) {
    // quantity =2.5 ---> 2 1/2
    const [int, dec] = quantity
      .toString()
      .split(".")
      .map((el) => parseInt(el, 10));

    if (!dec) return quantity;
    // console.log("this is dec ", dec);
    // console.log("before", dec);
    let dec1 = dec.toString().slice(0, 2);
    // console.log("in b/w", dec1);
    dec1 = parseFloat(`0.${dec1}`, 10);
    // console.log("check", dec1);
    if (int === 0) {
      //   console.log(dec1);
      const fr = new Fraction(dec1);
      return `${fr.numerator}/${fr.denominator}`;
    } else {
      //   console.log(dec1);

      const fr = new Fraction(dec1);
      return `${int} ${fr.numerator}/${fr.denominator}`;
    }
  }
  return "?";
};

const createIngredients = (ingredient) => {
  return `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.quantity)}</div>
        <div class="recipe__ingredient">
        <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
  `;
};

export const clearRecipe = () => {
  elements.recipe.innerHTML = "";
};

export const renderRecipe = (recipe, isLiked) => {
  const markup = `            
<figure class="recipe__fig">
    <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img">
    <h1 class="recipe__title">
        <span>${recipe.title}</span>
    </h1>
</figure>
<div class="recipe__details">
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-stopwatch"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          recipe.time
        }</span>
        <span class="recipe__info-text"> minutes</span>
    </div>
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-man"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          recipe.servings
        }</span>
        <span class="recipe__info-text"> servings</span>

        <div class="recipe__info-buttons">
            <button class="btn-tiny btn-decrease">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-minus"></use>
                </svg>
            </button>
            <button class="btn-tiny btn-increase">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-plus"></use>
                </svg>
            </button>
        </div>

    </div>
    <button class="recipe__love">
        <svg class="header__likes">
            <use href="img/icons.svg#icon-heart${
              isLiked ? "" : "-outlined"
            }"></use>
        </svg>
    </button>
</div>



<div class="recipe__ingredients">
    <ul class="recipe__ingredient-list">
        ${recipe.ingredients.map((el) => createIngredients(el)).join("")}
    </ul>

    <button class="btn-small recipe__btn recipe__btn--add">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-shopping-cart"></use>
        </svg>
        <span>Add to shopping list</span>
    </button>
</div>

<div class="recipe__directions">
    <h2 class="heading-2">How to cook it</h2>
    <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__by">${
          recipe.author
        }</span>. Please check out directions at their website.
    </p>
    <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>

    </a>
</div>`;
  elements.recipe.insertAdjacentHTML("afterbegin", markup);
};

export const updateSI = (recipe) => {
  // update quantity of each ingredient
  document.querySelector(".recipe__info-data--people").textContent =
    recipe.servings;

  // update servings
  const changeQuantity = Array.from(
    document.querySelectorAll(".recipe__count")
  );
  changeQuantity.forEach((el, index) => {
    el.textContent = formatCount(recipe.ingredients[index].quantity);
  });
};
