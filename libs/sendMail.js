'use strict';

const juice = require('juice');
const config = require('config');
const fs = require('fs');
const path = require('path');
const pug = require('pug');
const Letter = require('../models/letter');

const nodeMailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const stubTransport = require('nodemailer-stub-transport');

const MED = true
// configure gmail: https://nodemailer.com/using-gmail/
// allow less secure apps
const SMTPTransport = require('nodemailer-smtp-transport');
//let poolConfig = 'smtps://postmaster@medessentially.com:HSh6gxk&*fs@mail.nic.ru/?pool=true';

const transportEngine = (process.env.NODE_ENV === 'test' || process.env.MAILER_DISABLED) ? stubTransport() :
  MED ? new SMTPTransport({
    host: config.mailer.med.host,
    port: config.mailer.med.port,
    secure: false,
    auth: {
      user: config.mailer.med.user,
      pass: config.mailer.med.pass
    }
  }) :
  new SMTPTransport({
  service: "Gmail",
  debug: true,
  auth: {
    user: config.mailer.gmail.user,
    pass: config.mailer.gmail.password
  }
});

const transport = nodeMailer.createTransport(transportEngine);

transport.use('compile', htmlToText());

module.exports = async function(options) {

  let message = {};

  let sender = config.mailer.senders[options.from || 'default'];
  if (!sender) {
    throw new Error("Unknown sender:" + options.from);
  }

  message.from = {
    name: sender.fromName,
    address: sender.fromEmail
  };

  // for template
  let locals = Object.create(options);

  locals.config = config;
  locals.sender = sender;

  message.html = pug.renderFile(path.join(config.template.root, 'email', options.template) + '.pug', locals, null);
  message.html = juice(message.html);


  message.to = (typeof options.to === 'string') ? {address: options.to} : options.to;

  if (process.env.MAILER_REDIRECT) { // for debugging
    message.to = {address: sender.fromEmail};
  }

  if (!message.to.address) {
    throw new Error("No email for recepient, message options:" + JSON.stringify(options));
  }

  message.subject = options.subject;

  message.headers = options.headers;

  let transportResponse = await transport.sendMail(message);

  let letter = await Letter.create({
    message,
    author: options.author,
    transportResponse,
    messageId: transportResponse.messageId
  });
  return letter;
}
