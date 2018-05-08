const Attachment = require('../models/attachment');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');
const helpers = require('../libs/helpers');
const config = require('config');
const map = require('lodash/map');

module.exports = {
  uploadAttachments: async function (files, author, post) {
    const filesArr = Array.isArray(files.attachments) ? files.attachments : [files.attachments];
    const uploadDir = path.join(config.root, '/uploads/', author);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(path.join(uploadDir));
    } else {
      console.log("Directory already exist");
    }
    async function uploader() {
      const attachments = [];
      for (let key = 0; key < filesArr.length; key++) {
        const file = filesArr[key];
        const fileNameSplit = file.name.split('.');
        const fileExt = fileNameSplit[fileNameSplit.length - 1];
        const fileNewName = `${helpers.uid()}.${fileExt}`;
        const filePath = path.join(uploadDir, fileNewName);
        const reader = fs.createReadStream(file.path);
        const writer = fs.createWriteStream(filePath);
        reader.pipe(writer);
        attachments.push({
          newName: fileNewName,
          oldName: file.name,
          author: author,
          post: post,
          url: path.join(config.www,'/uploads/', author, '/', fileNewName)
        });
      }
      return attachments;
    }

    const filePaths = await uploader();
    return filePaths
  },
  addNewAttachment: async function (data, post) {

    try {
      const attachmentPromises = data.map((attachment) => Attachment.create(attachment));
/*
      for (let attachment of data) {
        const attachmentNew = await Attachment.create(attachment);
        console.log(attachmentNew);
      }
*/
      const newAttachments = await Promise.all(attachmentPromises);
      //const newAttachment = await Attachment.collection.insert(data);
      const getCurrentPost = await Post.findById(post);
/*

*/    const newAttachmentsIds = map(newAttachments, 'id');
      const updateCurrentPost = await getCurrentPost.update({
        '$addToSet': {
          'attachments': { $each: newAttachmentsIds } }
      });
      return [newAttachments, getCurrentPost];
    } catch (error) {
      return error
    }
  },
  list: async () => {
    try {
      const attachments = await Attachment.find({});
      return attachments.map(attachment => attachment.getPublicFields());
    } catch (error) {
      return error
    }
  },
  listDyIds: async function(ids)  {
    try {
      const attachments = await Attachment.find({
        '_id': { $in: ids}
      });
      return attachments.map(attachment => attachment.getPublicFields());
    } catch (error) {
      return error
    }
  }
};
