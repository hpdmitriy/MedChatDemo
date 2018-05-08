const User = require('../models/user');

module.exports = {
  setOnlineStatus: async function (id) {
    try {
      await User.update({_id: id}, {status: 'Online'});
      return 'online'
    } catch (error) {
      return error
    }
  },
  setOfflineStatus: async function (id) {
    try {
      await User.update({_id: id}, {status: 'Offline'});
      return 'offline'
    } catch (error) {
      return error
    }
  }
};
