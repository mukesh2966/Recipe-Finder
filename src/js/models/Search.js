// // when we want to export a single things
// export default "I am an exporter";

// // when we want to do multiple exports

// export const add = (a, b) => a + b;
// export const multiply = (a, b) => a * b;
// export const ID = 23;

import axios from "axios";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/search?&q=${this.query}`
      );
      this.result = res.data.recipes;
      //   console.log(this.result);
    } catch (error) {
      console.log("Sorry, we cannot find your recipe");
    }
  }
}
