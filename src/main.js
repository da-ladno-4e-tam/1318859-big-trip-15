import {createTripInfoTemplate} from './view/trip-info.js';
// import {createTripTitleTemplate} from './view/trip-title.js';
// import {createTripDatesTemplate} from './view/trip-dates.js';
// import {createTripCostTemplate} from './view/trip-cost.js';
import {createMenuTemplate} from './view/menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';
import {createRouteTemplate} from './view/route.js';
// import {createEventTemplate} from './view/event.js';
// import {createAddingEventFormTemplate} from './view/adding-event-form.js';
// import {createEditingEventFormTemplate} from './view/editing-event-form.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const tripInfoContainer = headerElement.querySelector('.trip-main');
// const tripInfoElement = tripInfoContainer.querySelector('.trip-info');
// const tripMainInfoContainer = tripInfoContainer.querySelector('.trip-info__main');
const menuContainer = headerElement.querySelector('.trip-controls__navigation');
const filtersContainer = headerElement.querySelector('.trip-controls__filters');
const mainContentContainer = mainElement.querySelector('.trip-events');
// const routeContainer = mainElement.querySelector('.trip-events__list');
// const eventContainer = routeContainer.querySelector('.trip-trip-events__item');

render(tripInfoContainer, createTripInfoTemplate(), 'afterbegin');
// render(tripInfoElement, createTripCostTemplate(), 'beforeend');
// render(tripMainInfoContainer, createTripTitleTemplate(), 'afterbegin');
// render(tripMainInfoContainer, createTripDatesTemplate(), 'beforeend');
render(menuContainer, createMenuTemplate(), 'beforeend');
render(filtersContainer, createFiltersTemplate(), 'beforeend');
render(mainContentContainer, createSortTemplate(), 'beforeend');
render(mainContentContainer, createRouteTemplate(), 'beforeend');
// render(routeContainer, createEventTemplate(), 'beforeend');
// render(routeContainer, createAddingEventFormTemplate(), 'afterbegin');
// render(eventContainer, createEditingEventFormTemplate(), 'afterbegin');
