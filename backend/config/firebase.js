const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const {getFirebaseServiceAccount} = require("./firebase-service-account");

const app =initializeApp({
  credential: cert(getFirebaseServiceAccount()),
});

module.exports = {
  getAuth,
};


// const admin = require("firebase-admin");
// const serviceAccount = require("./firebase-service-account");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// module.exports = admin;