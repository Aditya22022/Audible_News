// ========================================
// NEWS ROUTE - Fetch News from NewsAPI.org
// ========================================

const express = require('express');
const axios = require('axios');
const authenticateToken = require('../authMiddleware'); // Protect route (optional, can remove if you want public news)
const pool = require('../db');
const router = express.Router();

// ========================================
// GET /api/news - Fetch top headlines
// ========================================
/*{ the api we are using will return the response in this format
response.data is a collection of the articles and every article has the following properties
  "status": "ok",
  "totalResults": 38,
  "articles":   [
    {
      "source": {
        "id": "bbc-news",           // News source ID (can be null)
        "name": "BBC News"          // News source name
      },
      "author": "BBC News",         // Author of the article (can be null)
      "title": "Some news headline",// Headline/title of the article
      "description": "Short summary of the news article.",
      "url": "https://www.bbc.com/news/...",         // Link to the full article
      "urlToImage": "https://image.url/...",         // Link to the article's image (can be null)
      "publishedAt": "2023-06-06T12:34:56Z",         // Date/time published (ISO format)
      "content": "Full article content..."           // Main content (can be truncated or null)
    },
    // ...more articles
  ]
}*/
router.get('/', authenticateToken, async (req, res) => {
  try {
      // NEW: Get user ID from JWT token
      const userId = req.user.userId;
      
      // NEW: Query database to get user's preferred categories
      const preferencesResult = await pool.query(
          'SELECT favorite_categories FROM user_preferences WHERE user_id = $1',
          [userId]
      );
/*What it does(upper part ): Asks database "What categories does this user like?"
Example: Database returns ['technology', 'business'] */
      let userCategories = [];
      if (preferencesResult.rows.length > 0) {//if the user has preferences, get the categories
          userCategories = preferencesResult.rows[0].favorite_categories || [];
      }
      /*What it does:(upper part)
      If user has preferences → use them prefernceresult is an array of objects rem ..and if user gas fav categories and then userprefrence will return {[sports ,entertainement]} else it would be null.
      If no preferences → empty array*/
      // NEW: Fetch news for each selected category
      let allArticles = [];
      
      if (userCategories.length > 0) {
         // User has selected categories
          for (const category of userCategories) {//goes through each category the user selected
              const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.NEWS_API_KEY}`;
              const response = await axios.get(url);
              
              // What it does: Adds a category field to each article
              const articlesWithCategory = response.data.articles.map(article => ({
                  ...article,
                  category: category
              }));
              
              allArticles = [...allArticles, ...articlesWithCategory];
              /*What it does: Adds these articles to the main collection
               Example: if user slected 2 categories and each category has 10 articles then
                Round 1: allArticles = [10 technology articles]
                  Round 2: allArticles = [10 technology articles + 10 business articles]*/
          }
      } else {
         // User hasn't selected categories - show general news
          const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;
          const response = await axios.get(url);
          allArticles = response.data.articles.map(article => ({
              ...article,
              category: 'general'
          }));
      }

      // NEW: Limit articles to 12
      const limitedArticles = allArticles.slice(0, 12);

      res.json({
          status: 'success',
          articles: limitedArticles
      });
  } catch (error) {
      // Error handling
  }
});

module.exports = router;