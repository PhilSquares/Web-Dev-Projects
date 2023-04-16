//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////Requests Targetting all Articles////////////////////////

//Created new data inside of the MongoDB Database using Mongoose (const newArticle = new Article...)
//title and content store data that is received through the post request through req.body seen below. 
app.route("/articles")

.get(function (req, res) {
    Article.find(function (err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }

    });
})

.post(function(req, res){
    
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article.")
        } else{
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles.");
        } else{
            res.send(err);
        }
    });
});

///////////////////////////////////Requests Targetting A Specific Article////////////////////////

app.route("/articles/articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title were found.");
        }
    });
})

//Update Code Structure: <ModelName>.update({conditions}, {updates}, {overwrite: true} function(err, results){});
//Note: Mongoose will prevent properties from being overwritten by default. 
.put(function(req, res){
    Article.update(
        {title: req.params.articleTitle}, 
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated the selected article");
            }
        }
    );
})

//If we don't want to replace the entire document with values submitted in the PUT request, use a PATCH request (see below).
//Alternative Update Code Structure: <ModelName>.update({conditions}, {$set: updates}, function(err, results){});
//$set --> {$set: { <field1>: <value1>, ... } }
.patch(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
        }
    );
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
});