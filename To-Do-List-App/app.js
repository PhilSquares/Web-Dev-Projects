//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
//Removed items and workItems arrays in place of a new Mongoose implementation.
    //Installed Mongoose using "npm i mongoose"

//Setup bodyParser: Must be setup before req.body.newItem can be used below.
app.use(bodyParser.urlencoded({ extended: true }));
//Tell Express where to find the styles for the application:
app.use(express.static("public"));

//Create a new Database inside MongoDB and connect to it:
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
    name: String
};
//Create a model based on the itemsSchema above:
    //Mongoose models usually start with an uppercase letter.
const Item = mongoose.model("Item", itemsSchema);

//Mongoose Documents:
const item1 = new Item({
    name: "Welcome to your todolist"
});

const item2 = new Item({
    name: "Click the + button to add a new item."
});

const item3 = new Item({
    name: "Click the - button to delete an item."
});

const defaultItems = [item1, item2, item3];

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    //Check when a user accesses the root route/if the items collection is empty:
    if(foundItems.length === 0) {
        Item.insertMany(defaultItems)
            .then(function () {
            console.log("Successfully saved defult items to DB");
        })
        .catch(function (err) {
            console.log(err);
        });
        res.redirect("/");
    } else {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
    }


    Item.find({})
      .then(function (foundItems) {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      })
      .catch(function (err) {
        console.log(err);
        res.send("An error occurred while fetching the items from the database.");
      });
  });

app.post("/", function (req, res) {
    //Grabs the item from the post request.
    const item = req.body.newItem;
    //If the request comes from our work list, push the value to the workItems array.
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/delete", function (req, res) {
    const itemIndex = req.body.itemIndex;
    items.splice(itemIndex, 1);
    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});