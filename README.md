# HeartSync - Mini Dating App Prototype

HeartSync is a functional dating application prototype designed to demonstrate core mechanics such as profile management, mutual-matching algorithms, and availability coordination. Built with the **MEN Stack** (MongoDB, Express, Node.js).

---

## 🏗 System Organization

The application follows the **MVC (Model-View-Controller)** design pattern to ensure clear separation of concerns:

- **Models:** Managed via Mongoose to enforce data structure and validation for User Profiles and Availability.
- **Views:** Server-side rendered (SSR) using EJS for fast performance and dynamic content delivery.
- **Routes:** Decoupled into modular domains (`auth.js`, `admin.js`, `index.js`, `matches.js`, `users.js`) for better maintainability.
- **Middleware:** Centralized handlers for session security, body parsing, and static asset serving.

---

## 💾 Data Management

Unlike client-side storage, this project implements a robust **Backend-Database architecture**:

- **Database:** Powered by **MongoDB Atlas** (Cloud) for persistent and scalable data storage.
- **Session Store:** Integrated with `connect-mongo` to persist user sessions directly in the database. This ensures users remain logged in even after server restarts.
- **Security:** Sensitive information, specifically passwords, are protected using **Bcrypt** hashing before storage.

---

## 🧠 Core Logic

### 1. Matching Logic

The system implements a **Mutual Interest** algorithm:

- When User A "Likes" User B, the action is recorded in the database.
- The system performs a reverse lookup to check if User B has already liked User A.
- **Formula:** $Like(A \rightarrow B) \cap Like(B \rightarrow A) \implies Match$.
- Upon a successful match, a "Matched" status is triggered for both users.

### 2. Overlapping Slots Logic (Availability)

To facilitate real-life meetups, the app includes a scheduling coordination feature:

- Users submit their free time into a `slots` array containing `date`, `startTime`, and `endTime`.
- **Intersection Algorithm:** 1. Filter slots sharing the same `date`. 2. Check for time interval overlap: $[Start_A, End_A]$ and $[Start_B, End_B]$. 3. If an overlap is found, the system suggests it as the "Ideal Meeting Time."

---

## 🚀 Future Improvements

Given more time, I would implement:

- **Real-time Notifications:** Using **Socket.io** to notify users of a "Match" instantly without page refreshes.
- **Identity Verification:** Integrating basic AI tools to verify profile pictures and eliminate fake accounts.
- **Geospatial Discovery:** Leveraging MongoDB’s `$near` queries to suggest matches based on real-time proximity.

---

## 💡 Proposed Features

1.  **AI Bio Assistant:** Use Large Language Models (LLMs) to help users write engaging bios based on their interests, increasing match rates.
2.  **Ice-Breaker Prompts:** Automatically generate fun "get-to-know-you" questions once a match occurs to reduce conversation drop-offs.
3.  **Virtual Date Rooms:** Integrated secure video calling features to allow users to meet safely within the app before meeting in person.

---

**Developer:** Do The Hoa  
**Stack:** Node.js | Express | MongoDB | EJS | Bootstrap 5
