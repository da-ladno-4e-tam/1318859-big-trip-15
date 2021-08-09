import {createElement} from '../utils.js';

const createFilterItemTemplate = (filterName, isChecked) => (
  `<div class="trip-filters__filter">
                  <input
                  id="filter-everything"
                  class="trip-filters__filter-input  visually-hidden"
                  type="radio"
                  name="trip-filter"
                  value="${filterName}"
                  ${isChecked ? 'checked' : ''}>
                  <label class="trip-filters__filter-label" for="filter-everything">${filterName}</label>
                </div>`
);

const createFiltersTemplate = (filters) => {
  const filterItemsTemplate = filters
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
                ${filterItemsTemplate}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>`;

};

export default class Filters {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

