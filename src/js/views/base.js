export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchResultList: document.querySelector(".results__list"),
  searchResults: document.querySelector(".results"),
  searchRecPages: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe"),
  shopping: document.querySelector(".shopping__list"),
  likesMenu: document.querySelector(".likes__field"),
  likesList: document.querySelector(".likes__list"),
};

export const elementStrings = {
  loader: "loader",
};

// making reusable spinners

export const renderLoader = (parent) => {
  const loader = `
    <div class = ${elementStrings.loader}>
        <svg>
            <use href='img/icons.svg#icon-cw'></use>
        </svg>
    </div>
    `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) {
    // loader.innerHTML = "";
    // this is used for deleting the innerHTML, and not the html tag
    // so the loader class containing html div still remains and takes up some space
    // hence, the objective should be delete the html div tag, instead of deleting the inner HTML of div tag

    loader.parentElement.removeChild(loader);
  }
};
