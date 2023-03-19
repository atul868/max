var admin = require("firebase-admin");

var serviceAccount = require("../bromax-46689-firebase-adminsdk-kt0tw-0fef661e94.json");

console.log("Notification service started");
// console.log(serviceAccount);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

// topic = "general";
// var message = {
//   notification: {
//     title: 'Message from node',
//     body: 'hey there'
//   },
//   topic: topic
// };

function sendNotification(message) {
  return admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      return response;
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      return error;
    });
}

module.exports = { sendNotification };