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
    let articlesByCategory = [];// used to store articles by category

if (userCategories.length > 0) {
    // User has selected categories
    for (const category of userCategories) {
        const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.NEWS_API_KEY}`;
        const response = await axios.get(url);

        // Add category field to each article fetched through api
        const articlesWithCategory = response.data.articles.map(article => ({
            ...article,
            category: category
        }));

        articlesByCategory.push(articlesWithCategory);//all article have now been marked with a category and been stored in this varibale
    }// but if we display this only na so our display limit is 12 .. and all articlewill only be of the first category chosen so we wanna chose article from each category byinterleaving ex sport ,tech bus ,sports ,tech ,bus and going like this .

    // Interleave articles from each category for a fair mix
    let allArticles = []; // This will hold the final mixed list of articles
    let index = 0;        //  tells us which “row” we are on — round 0 means the first article from each category, round 1 means the second article from each category, etc.
    let added = 0;        // Counter for how many articles we've added so far
    while (added < 12) {  // Keep going until we've added 12 articles
        let found = false; // Track if we found at least one article in this round
        for (let arr of articlesByCategory) { // Go through each category's articles
            if (arr[index]) { // If this category has an article at this index
                allArticles.push(arr[index]); // Add it to the final list
                added++; // Increment the count of added articles
                found = true; // Mark that we found an article in this round
                if (added === 12) break; // If we've reached 12, stop immediately
            }
        }
        if (!found) break; // If no articles were found in this round, stop the loop
        index++; // Move to the next "row" of articles for the next round
    }

    // Use allArticles for response
    return res.json({
        status: 'success',
        articles: allArticles
    });
} else {
    // User hasn't selected categories - show general news
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;
    const response = await axios.get(url);
    const allArticles = response.data.articles.map(article => ({
        ...article,
        category: 'general'
    }));
    return res.json({
        status: 'success',
        articles: allArticles.slice(0, 12)
    });
}
  } catch (error) {
      // Error handling
      console.error('News fetch error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch news' });
  }
});

module.exports = router;