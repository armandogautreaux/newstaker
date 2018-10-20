// REQUIRE DEPENDENCIES
var express = require('express');
var router = express.Router();
var axios = require('axios');
var cheerio = require('cheerio');

// REQUIRE MODEL
var db = require('../models');

//Get Route -HOME PAGE
router.get('/', function(req, res) {
  res.render('index');
});

//ROUTES

//1. GET 'SCRAPE-ROUTE' (SCRAPE NYTIMES SITE AND SAVE RESPONSE IN DB)
router.get('/scrape', function(req, res) {
  axios.get('https://www.nytimes.com/').then(function(response) {
    var $ = cheerio.load(response.data);

    $('article').each(function(i, element) {
      var result = {};
      result.title = $(element)
        .find('h2.esl82me2')
        .text();
      result.link =
        'https://www.nytimes.com' +
        $(element)
          .find('a')
          .attr('href');
      result.description = $(element)
        .find('p.e1n8kpyg0')
        .text();

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send('Scrape Complete');
  });
});

//2. GET 'ARTICLES-ROUTE' (RENDER ARTICLELIST.HANDLEBARS WITH DB INFO )
router.get('/articles', function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({ saved: false })
    .then(function(dbArticle) {
      res.render('articlelist', { articles: dbArticle });
    })
    .catch(function(err) {
      res.json(err);
    });
});

//3. GET 'SAVED-ROUTE' (RENDER SAVED.HANDLEBARS WITH DB INFO)
router.get('/saved', function(req, res) {
  db.Article.find({ saved: true })
    .populate('notes')
    .exec(function(error, articles) {
      res.render('saved', { articles: articles });
    });
});

//4. GET 'CLEAR-ROUTE' (DROP COLLECTION)
router.get('/clear', function(req, res) {
  db.Article.remove({})
    .then(function() {
      console.log('Removed');
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//5. CHANGE SAVED (BOLEEAN) TO TRUE (WHEN SAVED IS CLICKED)
router.post('/articles/save/:id', function(req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }).exec(
    function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send(doc);
      }
    }
  );
});

//6. POPULATE NOTE
router.get('/articles/:id', function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate('note')
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//7. DELETE ARTICLE THROUGHT ITS ID
router.post('/articles/delete/:id', function(req, res) {
  db.Article.findOneAndUpdate(
    { _id: req.params.id },
    { saved: false, notes: [] }
  ).then(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

//8. SAVE NOTE
router.post('/articles/:id', function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//EXPORT ROUTER
module.exports = router;
