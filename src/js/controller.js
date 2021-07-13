import 'core-js/stable'; // for poly-filling everything else
import 'regenerator-runtime/runtime'; //for poly-filling async/await

import * as model from './model.js'; //exporting many things
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js'; // only exporting ONE THING from recipeView
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    //---------------- 1) Updating bookmarks view ----------------
    bookmarksView.update(model.state.bookmarks);

    // ---------------- 2) loading recipe ----------------
    await model.loadRecipe(id);

    //---------------- 3) Rendering recipe ----------------
    recipeView.render(model.state.recipe);

    // const revipeView = new recipeView(model.state.recipe)
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1 get search query
    const query = searchView.getQuery();
    if (!query) return;
    //2 Load search results
    await model.loadSearchResults(query);
    //3 Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1 Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2) Render initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  console.log(model.state.bookmarks);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('💥💥💥💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes); //load the MAIN RECIPE and add the 'selected' class to the corresponding recipe. Search results are NOT loaded
  recipeView.addHandlerUpdateServings(controlServings); // update ingredients when servings is changed
  recipeView.addHandlerAddBookmark(controlAddBookmark); //updates the bookmark element between filled and empty
  searchView.addHandlerSearch(controlSearchResults); // when enter key is hit on search element, render the search results (not the main recipe, just the left panel)
  paginationView.addHandlerClick(controlPagination); // search page buttons. On click, change
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
