import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import {getTripDurationFormat} from '../utils/common.js';
import {countAllEvents, makeItemsUniq, countPointsByType, countMoneyOfPointsByType, countTimeOfPointsByType} from '../utils/statistics.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const renderMoneyChart = (moneyCtx, points) => {
  const pointTypes = points.map((point) => point.type);
  const uniqTypes = makeItemsUniq(pointTypes);
  const pointByTypeSumMoney = uniqTypes.map((type) => countMoneyOfPointsByType(points, type)).sort((a, b) => b - a);
  const uniqTypesSorted = uniqTypes.map((type) => type).sort((a, b) => countMoneyOfPointsByType(points, b) - countMoneyOfPointsByType(points, a));

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqTypesSorted,
      datasets: [{
        data: pointByTypeSumMoney,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx, points) => {
  const pointTypes = points.map((point) => point.type);
  const uniqTypes = makeItemsUniq(pointTypes);
  const pointByTypeCounts = uniqTypes.map((type) => countPointsByType(points, type)).sort((a, b) => b - a);
  const uniqTypesSorted = uniqTypes.map((type) => type).sort((a, b) => countPointsByType(points, b) - countPointsByType(points, a));

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqTypesSorted,
      datasets: [{
        data: pointByTypeCounts,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeChart = (timeCtx, points) => {
  const pointTypes = points.map((point) => point.type);
  const uniqTypes = makeItemsUniq(pointTypes);
  const pointByTypeSumTime = uniqTypes.map((type) => countTimeOfPointsByType(points, type)).sort((a, b) => b - a);
  const uniqTypesSorted = uniqTypes.map((type) => type).sort((a, b) => countTimeOfPointsByType(points, b) - countTimeOfPointsByType(points, a));

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqTypesSorted,
      datasets: [{
        data: pointByTypeSumTime,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${dayjs.utc(val).format(getTripDurationFormat(val / 60000))}`,
        },
      },
      title: {
        display: true,
        text: 'TIME',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
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
