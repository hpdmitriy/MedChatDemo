const user = require('../controllers/user');
const {isNull} = require('lodash');
const XorCripto = require('../libs/XorCripto');


exports.get = async function (ctx) {
  ctx.body = await user.list();
};
exports.getById = async function (ctx) {
  ctx.body = await user.getOne(ctx.params.id);
};
exports.post = async function (ctx) {
  console.log(`
  =================================PostData======================================
  ${ctx.request.body.data}
  ===============================================================================
  `);
  const xorCripto = new XorCripto(ctx.request.body.data);

  const decode = xorCripto.decode();
  console.log(`
  *********************************DecodedPostData*******************************
  ${JSON.stringify(decode)}
  *******************************************************************************
  `);
  const uData = await user.signInByRealId(decode);
  if(isNull(uData)) {
    const newUser = await user.newReg(decode);
    console.log(newUser);
    ctx.body = newUser;
  } else {
    ctx.body = uData;
  }
};

/*
router.get('/:id', asyncMiddleware(async (req, res, next) => {
    const users = await user.getOne(req.params.id);
    res.json(users);
}));

router.post('/', asyncMiddleware(async function (req, res, next)  {
    console.log(req.body);
    const userFind = await user.getOne(req.body.id);
    res.json(userFind)
}));*/

