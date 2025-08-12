# Audible News

Audible News is a full-stack application that delivers the latest news with integrated audio playback functionality. This project features a modern dashboard for managing and consuming news from the user's favourite categories, making it accessible and enjoyable for users who prefer listening over reading.

## Demo

- **Live Demo Video:** [Watch on YouTube](https://youtu.be/UEIxzXnYIvM)
- **Frontend Code:** [View on CodeSandbox](https://codesandbox.io/p/sandbox/audible-news-dashboard-rnphym)

## Features

- User authentication and authorization
- Fetch and display news articles from the users's preferred categories
- Listen to news article headlines through integrated audio playback
- Dashboard for managing news and user settings
- Responsive, accessible user interface

## Tech Stack

### Frontend

- React.js (see [CodeSandbox](https://codesandbox.io/p/sandbox/audible-news-dashboard-rnphym))
- Modern JavaScript (ES6+)
- Responsive dashboard UI
- Audio playback integration

### Backend

- Node.js
- Express.js
- PostgreSQL (via `pg` package and connection pooling)
- RESTful API structure
- Custom authentication middleware (`authMiddleware.js`)
- Modular routing (`routes/` directory)

## Project Structure

- `index.js` - Main backend server file
- `db.js` - PostgreSQL database connection and setup
- `authMiddleware.js` - Custom authentication logic (JWT-based)
- `routes/` - API route handlers (`register.js`, `login.js`, `preferences.js`, `news.js`, `speech.js`)
- `package.json` - Backend dependencies

## Get Started

1. Clone the repository:  
   `git clone https://github.com/Aditya22022/Audible_News.git`
2. Install backend dependencies:  
   `npm install`
3. Make sure to set your PostgreSQL environment variables (`DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`) in a `.env` file.
4. Run the backend server:  
   `node index.js`
5. (Frontend runs separately via [CodeSandbox](https://codesandbox.io/p/sandbox/audible-news-dashboard-rnphym) or as a local React app.)

   ## Screenshots of the website in working
   <img width="500" height="500" alt="Screenshot 2025-08-12 210216" src="https://github.com/user-attachments/assets/93f39ee4-86e3-491e-bd22-0ca704345378" />
   <img width="500" height="500" alt="Screenshot 2025-08-12 210237" src="https://github.com/user-attachments/assets/405de5fe-9aaf-48c0-951d-cdb4121488d3" />
   <img width="500" height="500" alt="Screenshot 2025-08-12 210303" src="https://github.com/user-attachments/assets/04bd0e52-c8c8-4426-80e3-52563b196c7f" />





---
NOTE : The project has not been uploaded on any cloud/render/vercel platform as of now so it currently runs in my local database .
