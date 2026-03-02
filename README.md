# HeartSync - Mini Dating App Prototype

HeartSync is a functional dating application prototype designed to demonstrate core mechanics such as profile management, mutual matching algorithms, and availability coordination. The application is built using a Node.js and Express backend, MongoDB for data persistence, and follows the MVC (Model–View–Controller) architectural pattern.

---

## 🏗 System Organization

The application follows the **MVC (Model-View-Controller)** design pattern to ensure clear separation of concerns:

- **Models:** Managed via Mongoose to enforce data structure and validation (ProfileUser).
- **Views:** Server-side rendered (SSR) using EJS for fast performance and dynamic content delivery.
- **Controller/Routes:** Decoupled into modular domains (`auth.js`, `admin.js`, `index.js`, `users.js`) for better maintainability.
- **Middleware:** Centralized handlers for session security, body parsing, and static asset serving.

---

## 💾 Data Management

Unlike client-side storage, this project implements a robust **Backend-Database architecture**:

- **Database:** Powered by **MongoDB Atlas** (Cloud) for persistent and scalable data storage.
- **Session Store:** Integrated with `connect-mongo` to persist user sessions directly in the database.
- **Security:** Passwords are protected using **Bcrypt** hashing.

---

## 🛠 Installation & Setup

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd mini-dating-app
   ```
2. **Install dependencies:**
   npm install
3. **Environment Configuration: Create a .env file in the root directory and add:**
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=your_secret_key
   DB_MONGODB_URI=your_mongodb_connection_string

4. **Start the application:**
   Development mode: npm run dev
   Production mode: npm start

## 🧠 Core Logic & Implementation Status

### ✅ Completed: Part A & B

1. **Matching Logic:** - Implemented a mutual interest algorithm where a "Match" is created only when both users like each other.
   - **Formula:** $Like(A \rightarrow B) \cap Like(B \rightarrow A) \implies Match$.
2. **Profile System:** Full CRUD for user profiles with secure authentication.

### ⏳ In Progress: Part C (Scheduling System)

I am currently finalizing the **Availability Coordination** feature:

- **Current Development:** Building the intersection algorithm to compare `slots` arrays between two matched users.
- **Logic:** Filtering by common `date` and calculating time interval overlaps: $[Start_A, End_A] \cap [Start_B, End_B]$.
- **Refinement:** Optimizing the folder structure and clean code practices before final submission.

---

## 🚀 Submission Plan

I am committed to delivering a high-quality, bug-free prototype. My plan for the final submission includes:

1. **Complete Part C:** Finalize the date suggestion logic and UI.
2. **Code Refactoring:** Reorganizing the directory structure for better scalability.
3. **API Documentation:** Adding a list of endpoints for easier testing.

---

## 💡 Proposed Features for Future Scale

1. **AI Bio Assistant:** Use LLMs to help users write engaging bios.
2. **Ice-Breaker Prompts:** Automated conversation starters for new matches.
3. **Virtual Date Rooms:** Integrated secure video calling features.

---

**Developer:** Do The Hoa  
**Stack:** Node.js | Express.js | MongoDB (Atlas) | Mongoose | EJS | Bootstrap 5, express-session | bcrypt.
