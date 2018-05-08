const defer = require('config/defer').deferConfig;
const path = require('path');

module.exports = {
  secret: 'mysecret',
  XOR_SALT: '****************',
  SALT: '*****************',
  root: process.cwd(),
  www: '',
  port: process.env.PORT || 4500,
  mongoose: {
    uri: 'mongodb://localhost/chat',
    options: {
      server: {
        socketOptions: {
          keepAlive: 1
        },
        poolSize: 5
      }
    }
  },
  mailer: {
    med: {
      host: '************',
      port: 587,
      secure: false,
      user: 'postmaster@******.com',
      pass: '**********',

      to: '*************'
    },
    senders: {
      default: {
        fromEmail: 'noreply@*******.com',
        fromName: '***********',
        signature: "<em>Yours respectfully</em>"
      },
    }
  },
  template: {
    root: defer(function (cfg) {
      return path.join(cfg.root, 'templates');
    })
  },
};
