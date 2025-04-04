import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import bookmarksView from './views/bookmarksView.js';

///////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0). Update result view to mark selected search result
    resultView.update(model.getSearchResultPage());

    // ***** 1). UPDATING BOOKMARKS VIEW *****
    bookmarksView.update(model.state.bookmarks);
    
    //***** 2). LOADING RECIPE *****
    await model.loadRecipe(id);
    const { recipe } = model.state;
    
    // ***** 3). RENDERING RECPIE *****
    recipeView.render(model.state.recipe);

  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }

  // test
};
// controlRecipes();

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    console.log(resultView);

    // 1). Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    // 2). Load Search Results
    await model.loadSearchResult(query);

    // 3). Render Results
    resultView.render(model.getSearchResultPage());

    // 4). Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1). New Render Results:
  resultView.render(model.getSearchResultPage(goToPage));

  // 2). Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1). Add/Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  
  // 2). Update recipe view
  recipeView.update(model.state.recipe);

  // 3). Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks)
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new Recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe
    recipeView.render(model.state.recipe)

    // Success Message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks)

    // Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  }
  catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
}

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
