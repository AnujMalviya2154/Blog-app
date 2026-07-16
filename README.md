<div align="center">
  <h1>✦ BlogVerse</h1>
  <p><strong>A premium, modern full-stack blogging platform built with Node.js, Express, and EJS.</strong></p>
</div>

<br />

BlogVerse is a sleek and elegant web application that allows users to create, read, edit, and delete stories. Designed with a highly polished "Warm Amber Dark Theme", it focuses on typography, spacing, and a beautiful user experience that feels like a top-tier product.

## ✨ Features

- **Modern UI/UX**: A meticulously crafted dark theme featuring glassmorphism, fluid animations, and premium typography (Inter & Manrope).
- **Authentication**: Secure user registration and login system with JWT/session management.
- **Full CRUD Operations**: Users can seamlessly write new posts, edit existing content, and delete their stories.
- **Dynamic Content**: Server-side rendering with EJS for blazing fast page loads and excellent SEO.
- **Responsive Design**: Flawless experience across desktops, tablets, and mobile devices.
- **RESTful Architecture**: Clean, scalable backend routing and controller structure.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), EJS (Embedded JavaScript Templates)
- **Data Storage**: JSON-based persistent storage (for lightweight deployments)
- **Architecture**: MVC (Model-View-Controller) pattern

## 📁 Project Structure

```text
├── controllers/      # Route handlers and business logic
├── data/             # JSON database files (posts.json, users.json)
├── public/           # Static assets (Custom CSS design system, client-side JS)
├── routes/           # Express router definitions
├── views/            # EJS templates (pages and partials)
├── app.js            # Entry point and Express configuration
```

## 🚀 Getting Started

To run BlogVerse locally on your machine, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AnujMalviya2154/Blog-app.git
   cd Blog-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```
   *(Ensure your `.env` has the necessary JWT secrets or port configurations)*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   *(Or run `node app.js` for production mode)*

5. **Open the app:**
   Visit `http://localhost:3000` in your browser.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/AnujMalviya2154/Blog-app/issues).

## 📝 License

This project is licensed under the MIT License.
