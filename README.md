# mini-dating-app

HeartSync - Mini Dating App Prototype. A functional dating application prototype built with **Node.js, Express, and MongoDB**, using **EJS** as the template engine. This project focuses on profile management and a mutual-matching algorithm.

---

## 🚀 Project Milestones

### Part A: Profile Management

- **User Profiles:** Create accounts with Name, Age, Gender, Bio, and Email.
- **Data Persistence:** Integrated with **MongoDB Atlas** for reliable data storage.
- **Security:** \* Password hashing using **Bcrypt**.
  - Session management with **Express-Session** and **MongoStore** (sessions stay active even after server restarts).

### Part B: Discovery & Matching Logic

- **Profile Feed:** View all registered users in a clean, responsive layout.
- **Like System:** Users can interact by liking other profiles.
- **Matching Algorithm:** \* Real-time check for mutual interest.
  - If User A likes User B AND User B likes User A $\rightarrow$ Status: "It's a Match!".
  - Match data is stored persistently in the database.

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **View Engine:** EJS (Embedded JavaScript)
- **Styling:** Bootstrap 5
- **Authentication:** Session-based (Secure cookies, HttpOnly)
