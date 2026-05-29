import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import * as schema from "./schema/index.js";

if (getApps().length === 0) {
  const credential = process.env.TRUE_CONCEPT_SERVICE_KEY
    ? cert(JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY, 'base64').toString('utf8')))
    : applicationDefault();

  initializeApp({ credential });
}

export const db = getFirestore();
export const firebaseAuth = getAuth();
export * from "./schema/index.js";
