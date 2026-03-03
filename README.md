# HeartSync - Mini Dating App Prototype

HeartSync is a functional dating application prototype designed to demonstrate core mechanics such as profile management, mutual matching algorithms, and availability coordination. The application is built using a Node.js and Express backend, MongoDB for data persistence, and follows the MVC (Model–View–Controller) architectural pattern.

---

## 🏗 System Organization

The application follows the **MVC (Model-View-Controller)** design pattern to ensure clear separation of concerns:

- **Models:** Managed via Mongoose to enforce data structure and validation (ProfileUser, Availability).
- **Views:** Server-side rendered (SSR) using EJS for fast performance and dynamic content delivery.
- **Controller/Routes:** Decoupled into modular domains (`auth.js`, `admin.js`, `index.js`,`users.js`) for better maintainability.
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

### ✅ Completed: Part A & B & C

The core functionalities of HeartSync have been fully implemented, including profile management, mutual matching, and automated scheduling.

---

### 🔹 1. Mutual Matching Algorithm

Implemented a two-way interest system where a match is created only when both users like each other.

**Matching Logic**
Like(A → B) AND Like(B → A) ⇒ Match Created

- Prevents unilateral matching
- Ensures meaningful and mutual connections
- Match validation handled entirely server-side

---

### 🔹 2. Profile Management System

Built a secure and structured profile system with full CRUD functionality:

- User registration & authentication
- Password hashing using `bcrypt`
- Session-based access control
- Profile creation, update, and deletion
- Clean MVC-based route organization

---

### 🔹 3. Availability Coordination & Scheduling System

Implemented a scheduling feature that allows matched users to coordinate available time slots within the next **3 weeks**.

**Scheduling Flow**

1. Both users submit available time slots
2. The backend validates and normalizes dates
3. The system compares both `slots` arrays
4. The first overlapping interval is automatically selected

**Overlap Algorithm**

For two intervals:
[Start_A, End_A]
[Start_B, End_B]
An overlap exists when:
max(Start_A, Start_B) < min(End_A, End_B)
If overlap is found:
✅ You have a date scheduled on: [Date & Time]
If no overlap exists:
No overlapping time found. Please select again.

---

## 🚀 Submission Plan

I am committed to delivering a high-quality, bug-free prototype. My plan for the final submission includes:

**Code Refactoring:** Reorganizing the directory structure for better scalability.
**API Documentation:** Adding a list of endpoints for easier testing.

---

## 💡 Proposed Features for Future Scale

**AI Bio Assistant:** Use LLMs to help users write engaging bios.
**Ice-Breaker Prompts:** Automated conversation starters for new matches.
**Virtual Date Rooms:** Integrated secure video calling features.

---

**Developer:** Do The Hoa  
**Stack:** Node.js | Express.js | MongoDB (Atlas) | Mongoose | EJS | Bootstrap 5, express-session | bcrypt.
