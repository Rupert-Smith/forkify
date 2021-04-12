import icons from 'url:../../img/icons.svg'; //Parcel 2

export default class View {
  _data;

  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this  {Object} View instance
   * @author Rupert Smith
   * @todo Finish implementation
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //here we print to the console the array that has been build from
  // replace ALL the attributes in the current array with the ones in the new array
  update(data) {
    // console.log(data);
    this._data = data;
    const newMarkup = this._generateMarkup(); // store the entire markup so that we can compare it
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, index) => {
      const curEl = curElements[index];
      // console.dir(newEl);

      //   //Updates changed TEXT

      if (
        !newEl.isEqualNode(curEl) && newEl.firstChild
          ? newEl.firstChild.nodeValue.trim() !== ''
          : false
      ) {
        curEl.textContent = newEl.textContent;
      }

      // if (
      //   !newEl.isEqualNode(curEl) && // ONLY ELEMENTS THAT CONTAIN TEXT
      //   newEl.firstChild?.nodeValue.trim() !== ''
      // ) {
      //   curEl.textContent = newEl.textContent;
      // }

      //   //Updates changes attributes
      if (!newEl.isEqualNode(curEl))
        //
        // console.log(newEl.attributes);
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      //   // console.log(newElements === curElements);
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div> 
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._successMessage) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
