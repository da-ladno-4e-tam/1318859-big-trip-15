import {createTripInfoTemplate} from './view/trip-info.js';
import {createMenuTemplate} from './view/menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';
import {createRouteTemplate} from './view/route.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const tripInfoContainer = headerElement.querySelector('.trip-main');
const menuContainer = headerElement.querySelector('.trip-controls__navigation');
const filtersContainer = headerElement.querySelector('.trip-controls__filters');
const mainContentContainer = mainElement.querySelector('.trip-events');

render(tripInfoContainer, createTripInfoTemplate(), 'afterbegin');
render(menuContainer, createMenuTemplate(), 'beforeend');
render(filtersContainer, createFiltersTemplate(), 'beforeend');
render(mainContentContainer, createSortTemplate(), 'beforeend');
render(mainContentContainer, createRouteTemplate([0, 1, 2]), 'beforeend');
