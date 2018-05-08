const cors = require('kcors');

exports.init = app => app.use(cors());
