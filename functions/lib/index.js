"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
admin.initializeApp(functions.config().firebase);
// exports.updateCount = functions.https.onRequest((req, res) => {
//   // Grab the text parameter.
//   const schoolId = req.query.schoolId;
//   const userDetailId = req.query.userDetailId;
//   admin
//     .firestore()
//     .collection('/schools/'+ schoolId + '/events')
//     .where("participants", "array-contains", userDetailId)
//     .get()
//     .then(events => {
//       let count = 0;
//       events.forEach(ev => {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(ev.id, " => ", ev.data());
//         count++;
//       });
//       admin
//         .firestore()
//         .collection('/schools/' + schoolId + '/user-details')
//         .doc(userDetailId)
//         .update({
//             joinedEvents: count
//         }).then(() => {
//             res.status(200).send("OK");
//         }).catch(err => {
//             console.log(err);
//             res.status(401).send("Not Found");
//         });
//     }).catch(err => {
//         console.log(err);
//         res.status(401).send("Not Found");
//     });
// });
//# sourceMappingURL=index.js.map