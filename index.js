if (process.env.TRACE) {
  require('./libs/trace');
}
global.__clients = {};
global.__members = {};
global.__currentUser = null;
const Koa = require('koa');
const app = new Koa();

const config = require('config');
require('./libs/mongoose');

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret];

const path = require('path');
const fs = require('fs');
const os = require('os');

const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();

handlers.forEach(handler => require('./handlers/' + handler).init(app));

// ---------------------------------------

const Router = require('koa-router');

const router = new Router();

router.get('/', require('./routes/frontpage').get);
router.post('/login', require('./routes/login').post);
router.get('/login/:id', require('./routes/login').getById);

router.get('/user', require('./routes/user').get);
router.get('/user/:id', require('./routes/user').getById);
router.post('/user/', require('./routes/user').post);

router.get('/conversation', require('./routes/conversation').get);
router.get('/ru/conversation', require('./routes/conversation').get);
router.get('/conversation/:id', require('./routes/conversation').getById);
router.get('/popup/', require('./routes/conversation').getPopup);
router.get('/ru/popup/', require('./routes/conversation').getPopup);
router.get('/en/popup/', require('./routes/conversation').getPopup);
router.post('/conversation/', require('koa-body')({ multipart: true }), require('./routes/conversation').post);
router.delete('/conversation/:id', require('./routes/conversation').deleteById);

router.get('/subscribe/:id', require('./routes/subscribe').get);
router.get('/uploads/:id/:attach', (ctx, next) => {
  ctx.redirect(`/${ctx.params.id}/${ctx.params.attach}`);
});
router.get('/json', (ctx, next) => {
  next();
})
router.get('/email',require('./routes/mailer').get);


//sudo mongodump --db chat --out /backups/mongobackups/`date +"%m-%d-%y"`
//sudo mongodump --db chat --out /home/hdp/www/chat.medessentially.com/backups/mongobackups/`date +"%m-%d-%y"`
//sudo mongorestore --db chat --drop /var/backups/mongobackups/02-20-18/chat/
//sudo mongodump --db chat --out /home/dima/Projects/med/med_chat/backups/mongobackups/`date +"%m-%d-%y"`/v2
//sudo mongorestore --db chat --drop /home/dima/Projects/med/med_chat/backups/mongobackups/03-30-18/chat/
//mongorestore --db chat --drop /home/hdp/www/chat.medessentially.com/backups/mongobackups/03-30-18/chat/

/*router.post('/publish/:id', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) {
    ctx.throw(400);
  }

	__clients[ctx.params.id].forEach(function(resolve) {
		console.log(__clients);
    resolve(String(message));
  });

	__clients[ctx.params.id] = [];

  ctx.body = 'ok';

});*/

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(config.get('port'));
