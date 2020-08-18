import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const result = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = result.data.recipe.title;
      this.author = result.data.recipe.publisher;
      this.image = result.data.recipe.image_url;
      this.url = result.data.recipe.source_url;
      this.ingredients = result.data.recipe.ingredients;

      //   console.log(result);
    } catch (error) {
      console.log("this is a error on my $$$$$$$$$$$$$$$$", error);
      alert("Something went wrong");
    }
  }

  calcTime() {
    // every 3 ingredients take 15 mins
    const numIngredients = this.ingredients.length;
    this.time = 15 * Math.ceil(numIngredients / 3);
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const longUnits = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds",
    ];
    const shortUnits = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
      "stick",
    ];
    const units = [...shortUnits, "kg", "g"];

    const newIngredients = this.ingredients.map((element) => {
      // 1) uniform units
      let ingredient = element.toLowerCase();
      longUnits.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, shortUnits[index]);
      });

      // 2) remove paranthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      // 3) parse ingredients into count , unit and ingredients
      const arrIngredient = ingredient.split(" ");
      const unitIndex = arrIngredient.findIndex((el) => {
        return units.includes(el);
      });

      let objIngredient;
      if (unitIndex > -1) {
        // there is a unit
        objIngredient = {
          // 1 1/4 ounce
          // 1 ounce
          // 1-1/4 ounce
          quantity: eval(
            arrIngredient.slice(0, unitIndex).join("+").replace("-", "+")
          ),
          unit: arrIngredient[unitIndex],
          ingredient: arrIngredient.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIngredient[0], 10)) {
        // there is no unit but only qunatity
        objIngredient = {
          quantity: parseInt(arrIngredient[0], 10),
          unit: "",
          ingredient: arrIngredient.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        // there is no unit and no qunatity
        objIngredient = {
          quantity: 1,
          unit: "",
          ingredient: ingredient,
        };
      }

      return objIngredient;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

    // ingredients
    this.ingredients.forEach((el) => {
      el.quantity *= newServings / this.servings;
    });
    this.servings = newServings;
  }
}
