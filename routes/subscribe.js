const subscribe = require('../controllers/subscribe');
const _user = require('../controllers/user');
const _conversation = require('../controllers/conversation');
const has = require('lodash/has');
const omit = require('lodash/omit');

exports.get = async function (ctx) {
  ctx.set('Cache-Control', 'no-cache,must-revalidate');
  const uid = ctx.query.uid || null;
  console.log('__members ===>>>',__members);
  if (uid) {
    if (!has(__members, ctx.params.id)) {
      __members[ctx.params.id] = {};
      __members[ctx.params.id][uid] = {};
      __members[ctx.params.id][uid].status = 'Connected';
    } else if (__members[ctx.params.id] && !__members[ctx.params.id][uid]) {
      __members[ctx.params.id][uid] = {};
      __members[ctx.params.id][uid].status = 'Connected';
    } else if (__members[ctx.params.id] && __members[ctx.params.id][uid] && __members[ctx.params.id][uid] !== 'Online') {
      __members[ctx.params.id][uid].status = 'Connected';
    }
  }

  const promise = new Promise((resolve, reject) => {
    __members[ctx.params.id][uid].watcher = resolve;

    ctx.res.on('close', function () {
      __members[ctx.params.id][uid].status = 'Disconnected';
      __members[ctx.params.id][uid].watcher = () => null;
      const error = new Error('Connection closed');
      error.code = 'ECONNRESET';
      reject(error);
    });

  });

  let message;

  try {
    if (uid && has(__members, [ctx.params.id, uid]) && __members[ctx.params.id][uid].status === 'Connected') {
      __members[ctx.params.id][uid].status = 'Online';
      await subscribe.setOnlineStatus(uid);
    }
    message = await promise;
    console.log(__members);
  } catch (err) {
    if (err.code === 'ECONNRESET') {
      if (uid && has(__members, [ctx.params.id, uid]) && __members[ctx.params.id][uid].status === 'Disconnected') {
        const conversationPosts = await _conversation.getPostsByConversationId(ctx.params.id);
         const conversationUser = await _user.getById(uid);
         if(conversationUser.role === 'guest' && conversationPosts.length === 0) {
         omit(__members,uid);
         await _conversation.deleteById(ctx.params.id)
         } else {
        __members[ctx.params.id][uid].status = 'Offline';
        await subscribe.setOfflineStatus(uid);
         }
      }
      return
    }
    throw err;
  }

  console.log('DONE', message);
  ctx.body = message;
};

