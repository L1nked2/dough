import { createProxyMiddleware } from 'http-proxy-middleware'
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://dough-survey.web.app',
      changeOrigin: true
    })
  );
};