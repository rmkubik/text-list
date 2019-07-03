// related tutorial: https://www.twilio.com/blog/2017/12/send-bulk-sms-twilio-node-js.html

require('dotenv').config();

exports.handler = function(event, context, callback) {
  const twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const body = 'A message broadcast!';
  const numbers = ['+13046162231', '+13046162231'];

  const service = twilio.notify.services(process.env.TWILIO_NOTIFY_SERVICE_SID);
  const bindings = numbers.map(number => {
    return JSON.stringify({ binding_type: 'sms', address: number });
  });

  // Notification variant
  const notification = service.notifications
    .create({
      toBinding: bindings,
      body: body,
    })
    .then(() => {
      console.log(notification);

      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          messages: `Sent messages!`,
        }),
      });
    })
    .catch(err => {
      console.error(err);

      callback({
        body: JSON.stringify({
          message: err.message,
        }),
      });
    });

  // SMS variant
  // Promise.all(
  //   numbers.map((number, index) => {
  //     return twilio.messages.create({
  //       to: number,
  //       from: process.env.TWILIO_MESSAGING_SERVICE_SID,
  //       body: `${body} - ${index}`,
  //     });
  //   })
  // )
  //   .then(messages => {
  //     callback(null, {
  //       statusCode: 200,
  //       body: JSON.stringify({
  //         messages: messages.map(
  //           message => `Sent: ${body} to ${message.to} with SID ${message.sid}`
  //         ),
  //       }),
  //     });
  //   })
  //   .catch(err => {
  //     callback({
  //       body: JSON.stringify({
  //         message: err.message,
  //       }),
  //     });
  //   });
};
