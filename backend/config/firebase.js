const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const {getFirebaseServiceAccount} = require("./firebase-service-account");

const app =initializeApp({
  credential: cert(getFirebaseServiceAccount()),
});

module.exports = {
  getAuth,
};