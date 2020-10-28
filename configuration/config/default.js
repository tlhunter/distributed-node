module.exports = {
  REDIS: process.env.REDIS,
  WIDGETS_PER_BATCH: 2,
  MAX_WIDGET_PAYLOAD: Number(process.env.PAYLOAD) || 1024 * 1024
};
