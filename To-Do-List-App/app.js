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

//Every new list created will have a name and an array of item documents associated.  
const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.set("view engine", "ejs");

app.get("/", function (req, res) {

    Item.find({})
      .then(function (foundItems) {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      })
      .catch(function (err) {
        console.log(err);
        res.send("An error occurred while fetching the items from the database.");
      });
      
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
  });

//Create a dynamic route using Express Route Parameters:
app.get("/:customListName", function(req, res){
    const customListName = req.params.customListName;

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
            //If no lists were found then create a new list: 
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
            
                list.save();
                res.redirect("/" + customListName);
            } else{
            //Show an existing list:
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
            }
        }
    });

});  

app.post("/", function (req, res) {
    //Grabs the item from the post request.
    const itemName = req.body.newItem;
    //req.body.list corresponds to the name="list" button seen in the <form> with class="item" written in the list.ejs file. 
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === "Today"){
    //Moongose shortcut that saves the item in the document above into the collection of items. 
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
});

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, function(err){
        if(!err){
            console.log("Successfully deleted checked item.");
            res.redirect("/");
        }
    })
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});