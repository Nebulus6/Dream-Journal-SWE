This project will create a web-based dream journal with user authentication for daily record and reflection on the user's dream.

Nebulous Setup Instructions:

1. Install Required Tools
Ensure you have the following installed:

- Node.js (v22.14.0)
- npm (v11.1.0)
- Firebase CLI (v13.32.0)

2. Clone the Repository

- git clone [repo-url]
- cd Dream-Journal-SWE


3. Install Firebase CLI
If you haven't installed Firebase CLI yet, run:

- npm install -g firebase-tools

Then, log in to Firebase:
- firebase login


4. Install Dependencies
Navigate to the frontend and install dependencies:

- cd frontend
- npm install


Navigate to the backend (Cloud Functions) and install dependencies:

- cd ../functions
- npm install


---

Running the Project Locally
Frontend (React)

- cd frontend
- npm start

- The app will run at http://localhost:3000/

Backend (Firebase Functions)
To test the backend locally:

- cd functions
- firebase emulators:start


---

Deployment
1. Deploy Firestore Rules

- firebase deploy --only firestore


2. Deploy Cloud Functions

- firebase deploy --only functions


3. Deploy Frontend to Firebase Hosting

- cd frontend
- npm run build
- firebase deploy --only hosting


---

