import AbstractObserver from '../utils/abstract-observer.js';
import dayjs from 'dayjs';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(points) {
    this._points = points.slice();
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  parsePointToData(point) {
    const data = Object.assign({}, JSON.parse(JSON.stringify(point)));
    data.dateFrom = dayjs(data.dateFrom).toDate();
    data.dateTo = dayjs(data.dateTo).toDate();
    return data;
  }

  parseDataToPoint(data) {
    const point = Object.assign({}, JSON.parse(JSON.stringify(data)));
    point.dateFrom = dayjs(point.dateFrom).toDate();
    point.dateTo = dayjs(point.dateTo).toDate();
    return point;
  }
}
