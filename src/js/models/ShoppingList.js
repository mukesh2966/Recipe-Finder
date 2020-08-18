//using 3rd party package to create unique id
import uniqid from "uniqid";

export default class List {
  constructor() {
    this.items = [];
  }

  addNewItem(quantity, unit, ingredient) {
    const item = {
      // unique id for every item in the shoppinlist
      id: uniqid(),
      quantity: quantity,
      unit: unit,
      ingredient,
      // ES6 way for ingredient:ingredient
    };
    this.items.push(item);
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex((el) => {
      return el.id === id;
    });
    // console.log(this.items.slice(index, index + 1));
    this.items.splice(index, 1);
  }

  updateCount(id, newCount) {
    this.items.find((el) => el.id === id).quantity = newCount;
  }
}
