import MenuView from './view/menu.js';
import NewEventButtonView from './view/new-event-button.js';
import StatisticsView from './view/statistics.js';
import RoutePresenter from './presenter/route.js';
import FilterPresenter from './presenter/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import {MenuItem, UpdateType, FilterType, END_POINT, AUTHORIZATION} from './const.js';
import Api from './api.js';
import {render, RenderPosition, remove} from './utils/render.js';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const tripInfoContainer = headerElement.querySelector('.trip-main');
const menuContainer = headerElement.querySelector('.trip-controls__navigation');
const filtersContainer = headerElement.querySelector('.trip-controls__filters');
const mainContentContainer = mainElement.querySelector('.trip-events');
const api = new Api(END_POINT, AUTHORIZATION);
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const pointsModel = new PointsModel(offersModel);
const filterModel = new FilterModel();
const menuComponent = new MenuView();
const newEventButton = new NewEventButtonView();
const routePresenter = new RoutePresenter(mainContentContainer, pointsModel, offersModel, destinationsModel, filterModel, api);
const filterPresenter = new FilterPresenter(filtersContainer, filterModel, pointsModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.POINTS:
      routePresenter.init();
      remove(statisticsComponent);
      menuComponent.setMenuItem(MenuItem.POINTS);
      document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
      break;
    case MenuItem.STATISTICS:
      routePresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(mainContentContainer, statisticsComponent, RenderPosition.BEFOREEND);
      menuComponent.setMenuItem(MenuItem.STATISTICS);
      document.querySelector('.trip-main__event-add-btn').setAttribute('disabled', 'disabled');
      break;
  }
};

const handleNewPointClick = () => {

  remove(statisticsComponent);
  routePresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  routePresenter.init();

  routePresenter.createPoint();
  document.querySelector('.event__save-btn').setAttribute('disabled', 'disabled');
  document.querySelector('.trip-main__event-add-btn').setAttribute('disabled', 'disabled');
};

const offersPromise = api.getOffers();
const pointsPromise = api.getPoints();
const destinationsPromise = api.getDestinations();

routePresenter.init();

Promise.all([offersPromise, destinationsPromise, pointsPromise])
  .then(([offers, destinations, points]) => {
    offersModel.setOffers(offers);
    destinationsModel.setDestinations(destinations);
    pointsModel.setPoints(UpdateType.INIT, points);

    render(tripInfoContainer, newEventButton, RenderPosition.BEFOREEND);
    render(menuContainer, menuComponent, RenderPosition.BEFOREEND);
    filterPresenter.init();
    newEventButton.setNewPointClickHandler(handleNewPointClick);
    menuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    render(tripInfoContainer, newEventButton, RenderPosition.BEFOREEND);
    render(menuContainer, menuComponent, RenderPosition.BEFOREEND);
    filterPresenter.init();
    newEventButton.setNewPointClickHandler(handleNewPointClick);
    menuComponent.setMenuClickHandler(handleSiteMenuClick);
  });
