import  { initializeApp, cert } from "firebase-admin/app";
import  { getAuth } from "firebase-admin/auth";

import {getFirebaseServiceAccount} from "./firebase-service-account.js";

export const app =initializeApp({
  credential: cert(getFirebaseServiceAccount()),
});

<<<<<<< HEAD
module.exports = {
  getAuth,
};


// const admin = require("firebase-admin");
// const serviceAccount = require("./firebase-service-account");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// module.exports = admin;
=======
export { getAuth };
>>>>>>> 20c3ca8643a1b4b50975f40c9f1c67be8a464915
