import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import { getFirebaseServiceAccount } from "./firebase-service-account.js";

initializeApp({
  credential: cert(getFirebaseServiceAccount()),
});

export { getAuth };