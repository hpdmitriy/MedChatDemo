const sendMail = require('../libs/sendMail');
exports.get = async function (ctx) {
  const query = ctx.query;

  let letter = await sendMail({
    template: 'hello',
    subject: 'LifeChat New massage',
    to: '7604887@bk.ru',
    name: query.name ? query.name : 'Dmitriy',
    message: query.message ? query.message : 'lorem ipsum'
  });
  ctx.body = letter;
};

