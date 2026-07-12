import  { initializeApp, cert } from "firebase-admin/app";
import  { getAuth } from "firebase-admin/auth";

import {getFirebaseServiceAccount} from "./firebase-service-account.js";

export const app =initializeApp({
  credential: cert(getFirebaseServiceAccount()),
});

export { getAuth };