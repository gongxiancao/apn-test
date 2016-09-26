var apn = require('apn');

function createConnection (certificate, key, callback) {
  var options = {
    gateway: 'gateway.push.apple.com',
    batchFeedback: true,
    interval: 30,
    keyData: key,
    certData: certificate
    // cert: root + '/certs/new/cert.pem',                 /* Certificate file path */
    //   certData: null,                   /* String or Buffer containing certificate data, if supplied uses this instead of cert file path */
    //   key:  root + '/certs/new/key.pem',                  /* Key file path */
    //   keyData: null,                    /* String or Buffer containing key data, as certData */
    //   passphrase: 'secret',                 /* A passphrase for the Key file */
    //   ca: null,                         /* String or Buffer of CA data to use for the TLS connection */
    //   gateway: 'gateway.sandbox.push.apple.com',/* gateway address */
    //   port: 2195,                       /* gateway port */
    //   enhanced: true,                   /* enable enhanced format */
    //   errorCallback: undefined,         /* Callback when error occurs function(err,notification) */
    //   cacheLength: 100                  /* Number of notifications to cache for error purposes */
  };
  if(!options.keyData || !options.certData) {
    console.error('key or certificate is not provided');
    return callback(null);
  }

  apnConnection = new apn.Connection(options);
  var feedback = new apn.Feedback(options);
  feedback.on('feedback', function (devices) {
      devices.forEach(function (item) {
          // Do something with item.device and item.time;
          sails.log.warn(util.format('fail to send remote notification to %s at %s', item.device, item.time));
      });
  });

  callback(null, apnConnection);
}

function push(cert, key, deviceToken, message) {
  createConnection(cert, key, function (err, connection) {
    if(err) {
      return done(err);
    }
    
    var note = new apn.Notification();
    var device = new apn.Device(new Buffer(deviceToken, 'base64'));
    note.expiry = Math.floor(Date.now() / 1000) + 3600;
    note.alert = message;
    note.badge = 3;
    note.payload = {'messageFrom': 'John Appleseed'};

    connection.pushNotification(note, device);
    connection.shutdown();
  });
}

module.exports = push;
