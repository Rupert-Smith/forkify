import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found dickhead, please try again';
  _successMessage = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join(''); // for every item in _data, run through _generateMarkupPreview and do this...Also join everything together with an empty string, so it is one big HTML block
  }
}

export default new ResultsView();
