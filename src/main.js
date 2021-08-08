// import {createTripInfoTemplate} from './view/trip-info.js';
import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import SortView from './view/sort.js';
import NewEventButtonView from './view/new-event-button.js';
import EventsListView from './view/events-list.js';
import {createEventFormTemplate} from './view/event-form.js';
import {createEventTemplate} from './view/event.js';

import TripInfoSectionView from './view/trip-info-section.js';
import TripInfoMainView from './view/trip-info-main.js';
import {createTripTitleTemplate} from './view/trip-title.js';
import {createTripDatesTemplate} from './view/trip-dates.js';
import {createTripCostTemplate} from './view/trip-cost.js';

import {getData} from './mock/task.js';
import {renderTemplate, renderElement, RenderPosition} from './utils.js';

const points = getData();

const towns = points.map((point) => point.destination.name);
const startDates = points.map((point) => point.dateFrom);
const finishDates = points.map((point) => point.dateTo);

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const tripInfoContainer = headerElement.querySelector('.trip-main');
const menuContainer = headerElement.querySelector('.trip-controls__navigation');
const filtersContainer = headerElement.querySelector('.trip-controls__filters');
const mainContentContainer = mainElement.querySelector('.trip-events');

const newEventButton = new NewEventButtonView();
renderElement(tripInfoContainer, newEventButton.getElement(), RenderPosition.BEFOREEND);
renderElement(menuContainer, new MenuView().getElement(), RenderPosition.BEFOREEND);
renderElement(filtersContainer, new FiltersView().getElement(), RenderPosition.BEFOREEND);
renderElement(mainContentContainer, new SortView().getElement(), RenderPosition.BEFOREEND);

const tripInfoSection = new TripInfoSectionView();
renderElement(tripInfoContainer, tripInfoSection.getElement(), RenderPosition.AFTERBEGIN);
renderTemplate(tripInfoSection.getElement(), createTripCostTemplate(points), 'beforeend');

const tripInfoMain = new TripInfoMainView();
renderElement(tripInfoSection.getElement(), tripInfoMain.getElement(), RenderPosition.AFTERBEGIN);
renderTemplate(tripInfoMain.getElement(), createTripTitleTemplate(towns), 'beforeend');
renderTemplate(tripInfoMain.getElement(), createTripDatesTemplate(startDates, finishDates), 'beforeend');

const eventsListComponent = new EventsListView();
renderElement(mainContentContainer, eventsListComponent.getElement(), RenderPosition.BEFOREEND);
renderTemplate(eventsListComponent.getElement(), createEventFormTemplate(points[0]), 'afterbegin');
const eventsTemplate = points.map((point) => createEventTemplate(point)).join('');
renderTemplate(eventsListComponent.getElement(), eventsTemplate, 'beforeend');


