const User = require('../models/user');
const Conversation = require('../models/conversation');
const mongoose = require('mongoose');
const {random, isNull, toLower, isUndefined} = require('lodash');
const {isAssistant} = require('../libs/helpers');


function generateUID() {
  return (new Date().valueOf()).toString(36)
    + ("000" + (Math.random() * Math.pow(36, 3) << 0).toString(36)).slice(-3);
}

module.exports = {
  /*
   API: POST /api/write
   body: {message: 'message'}
   description: Write a new message
   */
  getOne: async function (id) {
    try {
      if (id === null) {
        const getAssistants = await User.find({"role": "Assistant"});
        const randAssistant = getAssistants[random(0, getAssistants.length - 1)];
        const userName = `User-${generateUID()}`;
        const user = new User({
          name: userName,
          password: '123',
          role: 'Client',
          assistants: [randAssistant._id]
        });
        const tempUser = await user.save();
        await randAssistant.update({
          '$addToSet': {
            'clients': tempUser._id
          }
        });
        await Conversation.create({
          name: `${userName} | ${randAssistant.name}`,
          assistant: randAssistant,
          client: tempUser,
        });
        return tempUser.getPublicFields();
      } else {
        const userFind = await User.findById(id);
        return userFind.getPublicFields();
      }
    } catch (error) {
      return error
    }
  },
  signIn: async function (data) {
    const {name, password} = data;
    try {
      const getUser = await User.findOne({"name": name, "password": password});
      return getUser.getPublicFields();
    }
    catch (error) {
      return error
    }
  },
  signInByRealId: async function (data) {
    const {userId, guestId} = data;
    let uid = null;
    if(isUndefined(userId) && isUndefined(guestId)) {
      return null
    }
    if(isUndefined(userId) && !isUndefined(guestId)) {
      uid = guestId
    }
    if(!isUndefined(userId)) {
      uid = userId
    }
    try {
      const getUser = await User.findOne({realId: uid});
      return isNull(getUser) ? null : getUser.getPublicFields();
    }
    catch (error) {
      return error
    }
  },
  reg: async function (data) {
    const {name, password, role, anonymous} = data;
    const userName = anonymous ? `User-${generateUID()}` : name;
    const userPass = anonymous ? `123` : password;
    const userRole = anonymous || role === 'Client' ? `Client` : role;
    try {
      const getAssistants = await User.find({"role": "Assistant"});
      const randAssistant = getAssistants[random(0, getAssistants.length - 1)];
      const user = new User({
        name: userName,
        password: userPass,
        role: userRole,
        'assistants': [randAssistant._id],
      });
      const tempUser = await user.save();
      await randAssistant.update({
        '$addToSet': {
          'clients': tempUser._id
        }
      });
      await Conversation.create({
        name: `${userName} | ${randAssistant.name}`,
        assistant: randAssistant._id,
        client: tempUser._id,
      });
      return tempUser.getPublicFields();
    } catch (error) {
      return error
    }
  },
  newReg: async function (data) {
    const {userId, userName, userRole, assistantId, assistantName, guestId, guestName} = data;
    let newClient, newAssistant, newConversation = null;
    try {
     // console.log(userId, userName, userRole, assistantId, assistantName);
      if(isAssistant(toLower(userRole))) {
        const user = new User({
          name: userName,
          realId: userId,
          role: toLower(userRole),
          'clients': [],
        });
        newAssistant = await user.save();
        return newAssistant.getPublicFields();
      } else {
        if(assistantId) {
          const getAssistant = await User.findOne({"realId": assistantId});
          console.log(getAssistant);
          if(isNull(getAssistant)) {
            const createAssistant = new User({
              name: assistantName,
              realId: assistantId,
              role: 'assistant',
              'clients': [],
            });
            newAssistant = await createAssistant.save();
            console.log(newAssistant);
          } else {
            newAssistant = getAssistant;
          }
        }
        if(userId) {
          const getUser = await User.findOne({"realId": userId});
          console.log(getUser);
          if(isNull(getUser)) {
            const createClient = new User({
              name: userName,
              realId: userId,
              role: toLower(userRole),
              'assistants': [],
            });
            newClient = await createClient.save();
            console.log(newClient);
          } else {
            newClient = getUser;
          }
        }
        if(!userId && guestId) {
          const getUser = await User.findOne({"realId": guestId});
          console.log(getUser);
          if(isNull(getUser)) {
            const createClient = new User({
              name: guestName,
              realId: guestId,
              role: toLower(userRole),
              'assistants': [],
            });
            newClient = await createClient.save();
            console.log(newClient);
          } else {
            newClient = getUser;
          }
        }
        if(!isNull(newAssistant) && !isNull(newClient)) {
          if(newAssistant.clients.indexOf(newClient.id) === -1) {
            await newAssistant.update({
              '$addToSet': {
                'clients':newClient.id
              }
            });
          }
          if(newClient.assistants.indexOf(newAssistant.id) === -1) {
            await newClient.update({
              '$addToSet': {
                'assistants':newAssistant.id
              }
            });
          }
          const getConversation = await Conversation.findOne({
            assistant: newAssistant.id,
            client: newClient.id
          });
          if(isNull(getConversation)) {
            const createConversation = new Conversation({
              name: `${newClient.name} | ${newAssistant.name}`,
              assistant: newAssistant.id,
              client: newClient.id,
            });
            newConversation = await createConversation.save();
          } else {
            newConversation = getConversation;
          }
        }
        const findNewUser = await User.findById(newClient.id);
        return findNewUser.getPublicFields();
      }
    } catch (error) {
      return error
    }
  },
  list: async () => {
    try {
      const users = await User.find({});
      return users.map(user => user.getPublicFields());
    } catch (error) {
      return error
    }
  },
  getById: async (id) => {
    try {
      const user = await User.findById(id);
      return user.getPublicFields();
    } catch (error) {
      return error
    }
  }
};
