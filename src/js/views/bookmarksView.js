import View from './View';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2 Syntax

class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  message = '';

  addHandlerRender(handler) {
    window.addEventListener('load',handler)
  }

  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map(result => previewView.render(result, false))
      .join('');
  }

}

export default new bookmarksView();
