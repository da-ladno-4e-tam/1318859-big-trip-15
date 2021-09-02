export const countAllEvents = (points) => Object.keys(points).length;

export const makeItemsUniq = (items) => [...new Set(items)];

export const countPointsByType = (points, type) => points.filter((point) => point.type === type).length;

export const countMoneyOfPointsByType = (points, type) => points.filter((point) => point.type === type).reduce((sum, point) => sum + point.basePrice, 0);

export const countTimeOfPointsByType = (points, type) => points.filter((point) => point.type === type).reduce((sum, point) => sum + (point.dateTo - point.dateFrom), 0);
