import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import {countAllEvents} from '../utils/statistics.js';

const renderMoneyChart = (moneyCtx, points) => {

};

const renderTypeChart = (typeCtx, points) => {

};

const renderTimeChart = (timeCtx, points) => {

};

const createStatisticsTemplate = (points) => {
  const tripEventsCount = countAllEvents(points);

  return `<section class="statistic container">
    <div class="statistic__line">
      <div class="statistic__period">
        <h2 class="statistic__period-title">Trip DIAGRAM</h2>

        <p class="statistic__period-result">
          There were a total of
          <span class="statistic__task-found">${tripEventsCount}</span>
          events during the trip.
        </p>
      </div>
      <div class="statistic__line-graphic">
        <canvas class="statistic__money" width="550" height="150"></canvas>
      </div>
      <div class="statistic__line-graphic">
        <canvas class="statistic__type" width="550" height="150"></canvas>
      </div>
      <div class="statistic__line-graphic">
        <canvas class="statistic__time" width="550" height="150"></canvas>
      </div>
    </div>
  </section>`;
};

export default class Statistics extends SmartView {
  constructor(points) {
    super();

    this._data = points;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;
    // this._dateChangeHandler = this._dateChangeHandler.bind(this);

    this._setCharts();
  }

  removeElement() {
    super.removeElement();

    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const points = this._data;
    const moneyCtx = this.getElement().querySelector('.statistic__money');
    const typeCtx = this.getElement().querySelector('.statistic__type');
    const timeCtx = this.getElement().querySelector('.statistic__time');

    this._moneyCtx = renderMoneyChart(moneyCtx, points);
    this._typeCtx = renderTypeChart(typeCtx, points);
    this._timeCtx = renderTimeChart(timeCtx, points);
  }
}
