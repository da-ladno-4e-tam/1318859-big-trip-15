import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import SortView from './view/sort.js';
import NewEventButtonView from './view/new-event-button.js';
import EventsListView from './view/events-list.js';
import EventFormView from './view/event-form.js';
import EventView from './view/event.js';
import TripInfoSectionView from './view/trip-info-section.js';
import TripInfoMainView from './view/trip-info-main.js';
import TripTitleView from './view/trip-title.js';
import TripDatesView from './view/trip-dates.js';
import TripCostView from './view/trip-cost.js';
import NoEvents from './view/no-events.js';

import {getData} from './mock/task.js';
import {render, RenderPosition} from './utils.js';

const filterItems = ['everything', 'future', 'past'];
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

const renderEvent = (eventsListContainer, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EventFormView(event);

  const replaceEventToForm = () => {
    eventsListContainer.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToEvent = () => {
    eventsListContainer.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };
  eventComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceEventToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });
  eventEditComponent.getElement().querySelector('form.event--edit').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });
  eventEditComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(eventsListContainer, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

const newEventButton = new NewEventButtonView();
render(tripInfoContainer, newEventButton.getElement(), RenderPosition.BEFOREEND);
render(menuContainer, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(filtersContainer, new FiltersView(filterItems).getElement(), RenderPosition.BEFOREEND);
const tripInfoSection = new TripInfoSectionView();
render(tripInfoContainer, tripInfoSection.getElement(), RenderPosition.AFTERBEGIN);
render(tripInfoSection.getElement(), new TripCostView(points).getElement(), RenderPosition.BEFOREEND);
const tripInfoMain = new TripInfoMainView();
render(tripInfoSection.getElement(), tripInfoMain.getElement(), RenderPosition.AFTERBEGIN);
render(tripInfoMain.getElement(), new TripTitleView(towns).getElement(), RenderPosition.BEFOREEND);
render(tripInfoMain.getElement(), new TripDatesView(startDates, finishDates).getElement(), RenderPosition.BEFOREEND);

const renderRoute = (routeContainer, events) => {
  if (points.length === 0) {
    render(routeContainer, new NoEvents().getElement(), RenderPosition.BEFOREEND);
  } else {
    render(routeContainer, new SortView().getElement(), RenderPosition.BEFOREEND);
    const eventsListComponent = new EventsListView();
    render(routeContainer, eventsListComponent.getElement(), RenderPosition.BEFOREEND);
    for (let i = 0; i < events.length; i++) {
      renderEvent(eventsListComponent.getElement(), events[i]);
    }
  }
};

renderRoute(mainContentContainer, points);
