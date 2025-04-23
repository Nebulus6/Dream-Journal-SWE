/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'yourpassword',
  },
});

// Shared function used by both scheduled and manual calls
async function sendEmails() {
  const snapshot = await admin.firestore().collection('users').get();
  const emailPromises: Promise<any>[] = [];

  snapshot.forEach((doc) => {
    const user = doc.data();
    if (user.email) {
      const mailOptions = {
        from: 'Nebulous <youremail@gmail.com>',
        to: user.email,
        subject: 'Time to Log Your Dream 🌙',
        text: "Good morning! Don't forget to record your dream in Nebulous today.",
      };

      emailPromises.push(transporter.sendMail(mailOptions));
    }
  });

  await Promise.all(emailPromises);
  console.log('✅ Emails sent successfully');
}

// Scheduled function (runs every day at 8 AM ET)
export const sendReminderEmails = onSchedule(
  {
    schedule: 'every day 08:00',
    timeZone: 'America/New_York',
  },
  async () => {
    await sendEmails();
    return;
  }
);

// Manual test endpoint
export const testSendNow = onRequest(async (req, res) => {
  await sendEmails();
  res.send('Manual test email sent.');
});



