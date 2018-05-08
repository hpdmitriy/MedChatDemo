
const serve = require('koa-static');

exports.init = app => {
  app.use(serve('./static'));
  app.use(serve('./uploads'));
};

