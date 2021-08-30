import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import NewEventButtonView from './view/new-event-button.js';
import TripInfoSectionView from './view/trip-info-section.js';
import TripInfoMainView from './view/trip-info-main.js';
import TripTitleView from './view/trip-title.js';
import TripDatesView from './view/trip-dates.js';
import TripCostView from './view/trip-cost.js';
import RoutePresenter from './presenter/route.js';
import PointsModel from './model/points.js';

import {getData} from './mock/task.js';
import {render, RenderPosition} from './utils/render.js';

const filterItems = ['everything', 'future', 'past'];
const points = getData();
const towns = points.map((point) => point.destination.name);
const startDates = points.map((point) => point.dateFrom);
const finishDates = points.map((point) => point.dateTo);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const tripInfoContainer = headerElement.querySelector('.trip-main');
const menuContainer = headerElement.querySelector('.trip-controls__navigation');
const filtersContainer = headerElement.querySelector('.trip-controls__filters');
const mainContentContainer = mainElement.querySelector('.trip-events');

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

const routePresenter = new RoutePresenter(mainContentContainer, pointsModel);

routePresenter.init(points);
