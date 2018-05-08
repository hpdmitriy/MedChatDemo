const config = require('config');
const _conversation = require('../controllers/conversation');
const _attachment = require('../controllers/attachment');
const _user = require('../controllers/user');
const _ = require('../controllers/user');
const {isEmpty, isNull, union, has} = require('lodash');
const helpers = require('../libs/helpers');
const htmlToText = require('html-to-text');
const path = require('path');
const fs = require('fs');
const sendMail = require('../libs/sendMail');


exports.get = async function (ctx) {
  const medUser = ctx.cookies.get('medUser');
  if (!isEmpty(__currentUser)) {
    if (!medUser || medUser !== __currentUser.id) {
      ctx.cookies.set('medUser', __currentUser.id, {httpOnly: false, signed: true});
    }
  }
  ctx.body = await helpers.readFile('./templates/index.html');
};
exports.getPopup = async function (ctx) {
  const medUser = ctx.cookies.get('medUser');
  if (!isEmpty(__currentUser)) {
    if (!medUser || medUser !== __currentUser.id) {
      ctx.cookies.set('medUser', __currentUser.id, {httpOnly: false, signed: true});
    }
  }
  ctx.body = await helpers.readFile('./templates/popup.html');
};

exports.getById = async function (ctx) {
  const query = ctx.query;
  let change = query.change || false;
  if (isEmpty(query.role)) {
    ctx.body = await _conversation.getById(ctx.params.id, change);
  } else {
    if (helpers.isAssistant(query.role)) {
      const assQuery = await _conversation.getByAssistantId(ctx.params.id);
      ctx.body = assQuery || []
    } else {
      const cliQuery = await _conversation.getByClientId(ctx.params.id);
      ctx.body = cliQuery || [];
    }
  }
};
exports.deleteById = async function (ctx) {

  const uid = ctx.request.body.uid;
  if(ctx.params.id === 'all_empty') {
    await _conversation.deleteAllEmpty(_conversation.deleteById);
    const assQuery = await _conversation.getByAssistantId(uid);
    ctx.body = assQuery || []
  } else {
    await _conversation.deleteById(ctx.params.id);
    const assQuery = await _conversation.getByAssistantId(uid);
    ctx.body = assQuery || []
  }

};

exports.post = async function (ctx) {
  const multiPart = has(ctx.request.body, 'fields');
  let text = multiPart ?
    ctx.request.body.fields.text : ctx.request.body.text || null;
  const author = multiPart ?
    ctx.request.body.fields.author : ctx.request.body.author || null;
  const conversation = multiPart ?
    ctx.request.body.fields.conversation : ctx.request.body.conversation || null;
  const unsubscribe = multiPart ?
    ctx.request.body.fields.unsubscribe : ctx.request.body.unsubscribe || null;
  const files = multiPart ? ctx.request.body.files : [];



  if (!text || !author || !conversation) {
    ctx.throw(400);
  }
  if (isEmpty(__members)) {
    ctx.throw(401);
  }
  console.log(__members);

  const authorData = await _user.getById(author);

  text = htmlToText.fromString(text, {
    wordwrap: 130
  });
  const members = __members[conversation];
  if (unsubscribe) {
    for (let member in members) {
      members[member].watcher({
        [author]: 'unsubscribe'
      });
      delete __members[conversation][member];
    }
    ctx.body = {[author]: 'unsubscribe'};
  } else {
    const updateConversation = await _conversation.addNewPost({
      text: text,
      author: author,
      conversation: conversation
    });

    if (!isEmpty(updateConversation.errors)) {
      ctx.throw(413);
    } else {
      if(authorData.role === 'guest' || authorData.role === 'patient') {
        if(process.env.NODE_ENV !== 'development') {
          await sendMail({
            template: 'hello',
            subject: 'LifeChat New massage',
            to: config.mailer.med.to,
            name: authorData.name,
            message: text,
            author: author,
          });
        }

      }
    }
    const newMessage = updateConversation[1].getPublicFields();
    if(!isEmpty(files)) {
      const attachments = await _attachment.uploadAttachments(files, author, updateConversation[1].id);
      const newAttachments = await _attachment.addNewAttachment(attachments, updateConversation[1].id);
        console.log('Attach ====>', newAttachments);
    }
    for (let member in members) {
      members[member].watcher(JSON.stringify({author: author, conversation: conversation}));
      __members[conversation] = {};
    }
    ctx.body = updateConversation;
  }

  /*
   __clients[req.params.id].forEach(function(res) {
   res.setHeader('Cache-Control', "no-cache, no-store, private");
   res.end(newMessage);
   console.log(__clients);
   });

   __clients[req.params.id] = [];
   res.json(newMessage);
   */
}

/*
 router.get('/:id', asyncMiddleware(async (req, res, next) => {
 const query = req.query;
 if (isEmpty(query)) {
 const oneConversation = await conversation.getById(req.params.id);
 res.json(oneConversation);
 } else {
 if(query.role === 'assistant'){
 const listAssistantConversations = await conversation.getByAssistantId(req.params.id);
 res.json(listAssistantConversations);
 } else if(query.role === 'client') {
 const listClientConversations = await conversation.getByClientId(req.params.id);
 res.json(listClientConversations);
 } else {
 res.json([]);
 }
 }
 }));

 router.post('/:id', asyncMiddleware(async function (req, res, next)  {
 console.log(req.body);
 const message = req.body.text;

 if (!message) {
 //res.throw(400);
 }
 const updateConversation = await conversation.addNewPost(req.body);
 const newMessage = updateConversation[1].getPublicFields();
 __clients[req.params.id].forEach(function(res) {
 res.setHeader('Cache-Control', "no-cache, no-store, private");
 res.end(newMessage);
 console.log(__clients);
 });

 __clients[req.params.id] = [];
 res.json(newMessage);
 }));
 /!*
 router.get('/old/:id', message.list.old);
 router.get('/recent', message.list.initRecent);
 router.get('/recent/:id', message.list.recent);
 router.post('/', message.write);
 *!/

 module.exports = router;
 */
