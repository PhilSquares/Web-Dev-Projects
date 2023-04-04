//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const port = 5000
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

//Setup bodyParser: Must be setup before req.body.newItem can be used below.
app.use(bodyParser.urlencoded({ extended: true }));
//Tell Express where to find the styles for the application:
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    const day = date.getDate();
    res.render("list", { listTitle: day, newListItems: items });
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

app.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}`))