/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Store dream journal entry
export const storeDreamEntry = onRequest(async (request, response) => {
  try {
    const {email, entryText} = request.body;
    if (!email || !entryText) {
      response.status(400).send("Missing email or entryText in request body.");
      return;
    }

    const userRef = db.collection("users").doc(email);
    const entriesRef = userRef.collection("dreamEntries");

    await entriesRef.add({
      text: entryText,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    response.status(200).send("Dream entry stored successfully.");
  } catch (error) {
    logger.error("Error storing dream entry:", error);
    response.status(500).send("Internal Server Error");
  }
});

// Retrieve dream journal entries
export const getDreamEntries = onRequest(async (request, response) => {
  try {
    const email = request.query.email as string;
    if (!email) {
      response.status(400).send("Missing email in query parameters.");
      return;
    }

    const entriesSnapshot = await db
      .collection("users")
      .doc(email)
      .collection("dreamEntries")
      .orderBy("timestamp", "desc")
      .get();

    const entries = entriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    response.status(200).json(entries);
  } catch (error) {
    logger.error("Error retrieving dream entries:", error);
    response.status(500).send("Internal Server Error");
  }
});
