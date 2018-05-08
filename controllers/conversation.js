const Conversation = require('../models/conversation');
const Post = require('../models/post');
const User = require('../models/user');
const Attachments = require('../models/attachment');
const _attachment = require('./attachment');
const {isEmpty, indexOf} = require('lodash');
const config = require('config');
const path = require('path');
const {unlinkFile, removeDir, lStat} = require('../libs/helpers');
//db.getCollection('conversations').updateMany({},{ '$set': { isActiveConversation: false, isNewConversation: true } })
module.exports = {
  getById: async function (id, change) {

    try {
      await Conversation.updateMany({isActiveConversation: true},{ '$set': { isActiveConversation: false } });
      const conversation = await Conversation.findById(id);
      const messages = await Post.find({'conversation': conversation})
        .populate('author')
        .populate('conversation').populate('attachments');
      const mapMessages = [];
      for (let message of messages) {
        let post = message.getPublicFields();
        post.author = message.author.getPublicFields();
        post.conversation = message.conversation.getPublicFields();
        const postAttachments = message.attachments.length ? await _attachment.listDyIds(message.attachments) : null;
        post.attachments = !isEmpty(postAttachments) ? postAttachments : null;
        mapMessages.push(post)
      }
      if(JSON.parse(change)) {
        await conversation.update({posts: 0, isNewConversation: false, isActiveConversation : true});
      }
      return mapMessages;
    } catch (error) {
      return error
    }
  },
  getByAssistantId: async function (id) {
    try {
      const conversations = await Conversation.find({assistant: id});
      const olderEmpty = [];
      const actual = [];
      const twoDayBeforeYesterday = new Date(new Date() - 1000 * 60 * 60 * 24 * 3);
      for (let i=0; i<conversations.length; i++) {
        const conv = conversations[i].getPublicFields();
        if(conv.updatedAt < twoDayBeforeYesterday && conv.isEmptyConversation && !!~conv.name.indexOf('Guest')) {
          olderEmpty.push(conv.id)
        } else {
          actual.push(conv)
        }
      }
      if(olderEmpty.length) {
        console.log(olderEmpty.length);
        const arrDelPromises = olderEmpty.map(older => this.deleteById(older));
        await Promise.all(arrDelPromises);
        return actual
      } else {
        return actual
      }

    } catch (error) {
      return error
    }
  },
  getByConversationId: async function (id) {
    try {
      const conversations = await Conversation.findOne({_id: id});
      return conversations.getPublicFields();
    } catch (error) {
      return error
    }
  },
  getPostsByConversationId: async (conversationId) => {
    try {
      const posts = await Post.find({conversation:conversationId}, '_id');
      return posts;
    } catch (error) {
      return error
    }
  },
  getByClientId: async function (id) {
    try {
      const conversations = await Conversation.find({client: id});
      return conversations.map(conversation => conversation.getPublicFields());
    } catch (error) {
      return error
    }
  },
  addNewPost: async function (data) {
    const {text, author, conversation} = data;
    try {
      const newPost = await Post.create({
        text: text,
        author: author,
        conversation: conversation
      });
      const getCurrentConversation = await Conversation.findById(conversation);
      const messages = await Post.find({'conversation': conversation}).populate('author').populate('conversation');
      const mapMessages = messages.map((message) => {
        let post = message.getPublicFields();
        post.author = message.author.getPublicFields();
        post.conversation = message.conversation.getPublicFields();
        return post;
      });
      if(!getCurrentConversation.isActiveConversation) {
        const newPosts = getCurrentConversation.posts + 1;
        await getCurrentConversation.update({posts: newPosts, isEmptyConversation: false});
      }
      if(!getCurrentConversation.isEmptyConversation) {
        await getCurrentConversation.update({isEmptyConversation: false});
      }
      return [mapMessages, newPost];
    } catch (error) {
      return error
    }
  },
  list: async () => {
    try {
      const conversations = await Conversation.find({});
      return conversations.map(conversation => conversation.getPublicFields());
    } catch (error) {
      return error
    }
  },
  deleteAllEmpty: async (cb) => {

/*
    const postsQuery = await Post.find({});
    const conversationQuery = await Conversation.find({});
    const postQueryConversationIds = postsQuery.map(post => post.conversation.toString())
    const conversationQueryConversationIds = conversationQuery.map(conversation => conversation.id)
    const emtyConversation = new Set()
    const notEmptyConversation = new Set()
    for (let i=0; i<=conversationQueryConversationIds.length; i++) {
      if(!!~indexOf(postQueryConversationIds, conversationQueryConversationIds[i])) {
        notEmptyConversation.add(conversationQueryConversationIds[i])
      } else {
        emtyConversation.add(conversationQueryConversationIds[i])
      }
    }
*/

/*
    await Conversation.updateMany({ _id: { $in: [...emtyConversation] } }, { $set: { isEmptyConversation : true } });
    await Conversation.updateMany({ _id: { $in: [...notEmptyConversation] } }, { $set: { isEmptyConversation : false } });
*/


    const conversationQuery = await Conversation.find({'isEmptyConversation': true});
    const promiseArr = conversationQuery.map(conversation => cb(conversation.id));
    await Promise.all(promiseArr);
/*
    db.getCollection('conversations').updateMany({_id: {$in: [ ObjectId("5a9eb7cab063337a1fd09ec1"), ObjectId("5aaa9fd4c453f631b7c5726c"), ObjectId("5ab0d723c453f631b7c57344"), ObjectId("5ab0d77dc453f631b7c57369"), ObjectId("5ab0d818c453f631b7c573ad"), ObjectId("5ab0d900c453f631b7c57417"), ObjectId("5ab0d942c453f631b7c57435"), ObjectId("5ab0da11c453f631b7c57468"), ObjectId("5ab0da2fc453f631b7c5746c"), ObjectId("5ab0dae3c453f631b7c57496"), ObjectId("5ab0dbdac453f631b7c574b4"), ObjectId("5ab0e53fc453f631b7c57576"), ObjectId("5ab0e83fc453f631b7c57593"), ObjectId("5ab0ff54c453f631b7c57664"), ObjectId("5ab1100cc453f631b7c576a5"), ObjectId("5ab11bdcc453f631b7c576c5"), ObjectId("5ab4da21c453f631b7c577da"), ObjectId("5ab5111278c3aa454ee9fdb6"), ObjectId("5abb3e818cee1e45f967d7f8"), ObjectId("5abbea048cee1e45f967d828"), ObjectId("5abcf6558cee1e45f967d85e") ]}},{ '$set': { isEmptyConversation: false } })
*/
/*
    db.getCollection('conversations').update({ _id: { '$in': ["5a9eb7cab063337a1fd09ec1", "5aaa9fd4c453f631b7c5726c","5ab0d723c453f631b7c57344"] } }, { '$set': { isEmptyConversation: false}})


 db.getCollection('conversations').update({ _id: { '$in': [ ObjectId("5a9eb7cab063337a1fd09ec1"), ObjectId("5aaa9fd4c453f631b7c5726c"), ObjectId("5ab0d723c453f631b7c57344"), ObjectId("5ab0d77dc453f631b7c57369"), ObjectId("5ab0d818c453f631b7c573ad"), ObjectId("5ab0d900c453f631b7c57417"), ObjectId("5ab0d942c453f631b7c57435"), ObjectId("5ab0da11c453f631b7c57468"), ObjectId("5ab0da2fc453f631b7c5746c"), ObjectId("5ab0dae3c453f631b7c57496"), ObjectId("5ab0dbdac453f631b7c574b4"), ObjectId("5ab0e53fc453f631b7c57576"), ObjectId("5ab0e83fc453f631b7c57593"), ObjectId("5ab0ff54c453f631b7c57664"), ObjectId("5ab1100cc453f631b7c576a5"), ObjectId("5ab11bdcc453f631b7c576c5"), ObjectId("5ab4da21c453f631b7c577da"), ObjectId("5ab5111278c3aa454ee9fdb6"), ObjectId("5abb3e818cee1e45f967d7f8"), ObjectId("5abbea048cee1e45f967d828"), ObjectId("5abcf6558cee1e45f967d85e") ] } }, { '$set': { isEmptyConversation: false})
*/
  },
  deleteById: async (id) => {
    /* TODO
     1. Выбираем чат по id.
     2. Выбираем клиента по id из выбранного чата
     3. Выбираем ассистента по id из выбранного чата
     4. Выбираем все посты по id чата
     5. Выбираем все аттачменты по id ранее выбранных постов
     6. Удаляем чат
     7. Удаляем посты
     8. Удаляем аттачи
     9. Удаляем юсера
     10. Обновляем Удаляем id
     */
    try {

      const convQuery = await Conversation.findById(id);
      const clientQery = await User.findById(convQuery.client);
      const assistantQery = await User.findById(convQuery.assistant);
      const convPostsQuery = await  Post.find({conversation: convQuery.id}, '_id');
      const mapPostsQuery = convPostsQuery.map((post) => post.id);
      const attachmentsQuery = await Attachments.find({'post': {$in: mapPostsQuery}}, {'url': 1, '_id': 0});
      const mapAttachmens = attachmentsQuery.map((attach) => path.join(config.root, attach.url));
      await Conversation.remove({_id: convQuery.id});
      await User.remove({_id: clientQery.id});
      await Post.remove({_id: {$in: mapPostsQuery}});
      await Attachments.remove({'post': {$in: mapPostsQuery}});
      await assistantQery.update({
        $pullAll: {
          'clients': [clientQery.id]
        }
      });
      if (mapAttachmens.length) {
        await Promise.all(mapAttachmens.map(attachment => unlinkFile(attachment)));
        const clientUploadsDir = path.join(config.root, 'uploads', clientQery.id);
        const statClientsUploads = await lStat(clientUploadsDir);
        if (statClientsUploads !== null) {
          await removeDir(clientUploadsDir)
        }
      }
      console.log(attachmentsQuery);
    } catch (error) {
      return error
    }

  }
};
