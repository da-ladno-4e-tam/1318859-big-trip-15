import MenuView from './view/menu.js';
import NewEventButtonView from './view/new-event-button.js';
import TripInfoSectionView from './view/trip-info-section.js';
import TripInfoMainView from './view/trip-info-main.js';
import TripTitleView from './view/trip-title.js';
import TripDatesView from './view/trip-dates.js';
import TripCostView from './view/trip-cost.js';
import RoutePresenter from './presenter/route.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

import {getData} from './mock/task.js';
import {render, RenderPosition} from './utils/render.js';

const points = getData();
const towns = points.map((point) => point.destination.name);
const startDates = points.map((point) => point.dateFrom);
const finishDates = points.map((point) => point.dateTo);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const tripInfoContainer = headerElement.querySelector('.trip-main');
const menuContainer = headerElement.querySelector('.trip-controls__navigation');
const filtersContainer = headerElement.querySelector('.trip-controls__filters');
const mainContentContainer = mainElement.querySelector('.trip-events');

const newEventButton = new NewEventButtonView();
render(tripInfoContainer, newEventButton, RenderPosition.BEFOREEND);
render(menuContainer, new MenuView(), RenderPosition.BEFOREEND);
const tripInfoSection = new TripInfoSectionView();
render(tripInfoContainer, tripInfoSection, RenderPosition.AFTERBEGIN);
render(tripInfoSection, new TripCostView(points), RenderPosition.BEFOREEND);
const tripInfoMain = new TripInfoMainView();
render(tripInfoSection, tripInfoMain, RenderPosition.AFTERBEGIN);
render(tripInfoMain, new TripTitleView(towns), RenderPosition.BEFOREEND);
render(tripInfoMain, new TripDatesView(startDates, finishDates), RenderPosition.BEFOREEND);

export const routePresenter = new RoutePresenter(mainContentContainer, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filtersContainer, filterModel, pointsModel);

filterPresenter.init();
routePresenter.init();
