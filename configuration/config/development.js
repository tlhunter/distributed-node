module.exports = {
  ENV: 'development',
  REDIS: process.env.REDIS || 'redis://localhost:6379',
  MAX_WIDGET_PAYLOAD: Infinity
};
