import {createTripInfoTemplate} from './view/trip-info.js';
import {createMenuTemplate} from './view/menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';
import {createRouteTemplate} from './view/route.js';
import {getData} from './mock/task.js';

const points = getData();
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const tripInfoContainer = headerElement.querySelector('.trip-main');
const menuContainer = headerElement.querySelector('.trip-controls__navigation');
const filtersContainer = headerElement.querySelector('.trip-controls__filters');
const mainContentContainer = mainElement.querySelector('.trip-events');

render(tripInfoContainer, createTripInfoTemplate(points), 'afterbegin');
render(menuContainer, createMenuTemplate(), 'beforeend');
render(filtersContainer, createFiltersTemplate(), 'beforeend');
render(mainContentContainer, createSortTemplate(), 'beforeend');
render(mainContentContainer, createRouteTemplate(points), 'beforeend');
