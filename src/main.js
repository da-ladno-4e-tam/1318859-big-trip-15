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
import OffersView from './view/offers.js';
import DestinationView from './view/destination.js';

import {getData} from './mock/task.js';
import {render, RenderPosition, replace} from './utils/render.js';

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
  const eventFormComponent = new EventFormView(event);
  const formOffersContainer = eventFormComponent.getElement().querySelector('.event__details');

  render(formOffersContainer, new OffersView(event.offers), RenderPosition.BEFOREEND);
  render(formOffersContainer, new DestinationView(event.destination), RenderPosition.BEFOREEND);

  const replaceEventToForm = () => {
    replace(eventFormComponent, eventComponent);
  };

  const replaceFormToEvent = () => {
    replace(eventComponent, eventFormComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };
  eventComponent.setEditClickHandler(() => {
    replaceEventToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });
  eventFormComponent.setFormSubmitHandler(() => {
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });
  eventFormComponent.setEditClickHandler(() => {
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(eventsListContainer, eventComponent, RenderPosition.BEFOREEND);
};

const newEventButton = new NewEventButtonView();
render(tripInfoContainer, newEventButton, RenderPosition.BEFOREEND);
render(menuContainer, new MenuView(), RenderPosition.BEFOREEND);
render(filtersContainer, new FiltersView(filterItems), RenderPosition.BEFOREEND);
const tripInfoSection = new TripInfoSectionView();
render(tripInfoContainer, tripInfoSection, RenderPosition.AFTERBEGIN);
render(tripInfoSection, new TripCostView(points), RenderPosition.BEFOREEND);
const tripInfoMain = new TripInfoMainView();
render(tripInfoSection, tripInfoMain, RenderPosition.AFTERBEGIN);
render(tripInfoMain, new TripTitleView(towns), RenderPosition.BEFOREEND);
render(tripInfoMain, new TripDatesView(startDates, finishDates), RenderPosition.BEFOREEND);

const renderRoute = (routeContainer, events) => {
  if (points.length === 0) {
    render(routeContainer, new NoEvents(), RenderPosition.BEFOREEND);
  } else {
    render(routeContainer, new SortView(), RenderPosition.BEFOREEND);
    const eventsListComponent = new EventsListView();
    render(routeContainer, eventsListComponent, RenderPosition.BEFOREEND);
    for (let i = 0; i < events.length; i++) {
      renderEvent(eventsListComponent, events[i]);
    }
  }
};

renderRoute(mainContentContainer, points);
