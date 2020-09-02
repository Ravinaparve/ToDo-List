const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _=require('lodash');

const app = express();
const date = require(__dirname + "/date.js"); //requires all the functions inside this module

// let items=["buy food","cook food","eat food"];
// let workItems=[];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); //to let server use static files like css and js

mongoose.connect('mongodb://localhost:27017/todoListDB', {useNewUrlParser: true, useUnifiedTopology: true});
const itemsSchema = new mongoose.Schema({ //creating schema
  name: String
});

const Item = mongoose.model("Item", itemsSchema); //creating collection

const buy = new Item({name: "Buy food"}); //creating 3 documents
const cook = new Item({name: "Cook food"});
const eat = new Item({name: "Eat food"});
const defaultItems = [buy, cook, eat]; //storing 3 documents in an array

const pageSchema ={  //creatind a new schema to display dynamic pages on the fly
  name: String,
  items:[itemsSchema]
};

const Page = mongoose.model("Page",pageSchema); //creating a model based on new schema to display dynamic pages on the fly

app.get("/", function(req, res) {
  let day = date.getDate(); //to run only the getDate() function
  //   let today=new Date();
  //   let options= {
  //     weekday:"long",
  //     day:"numeric",
  //     month:"long"
  //   };
  // let day = today.toLocaleDateString("en-US", options); //converts the date into long format.set the title to page

  Item.find({}, function(err, foundItems) { //foundIems is where the result will be stored
      // console.log(foundItems);
      if (foundItems.length === 0) { //if there are no items in Item collection, then add default values else display whatever is there in the collection
        Item.insertMany(defaultItems, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("successful!");
          }
        });
        res.redirect("/");
      }
      else{
        res.render("list", {pageTitle: day, newListItems: foundItems}); //newListItems will pass the enitre array of items
      }
  });

});

app.get("/:requestedPage",function(req,res){
  const requestedPage= _.capitalize(req.params.requestedPage);

Page.findOne({name:requestedPage},function(err, foundList){
  if(!err){   //create a new list
    if(!foundList){
      const page = new Page({
        name: requestedPage,
        items:defaultItems
      });
      page.save();
      res.redirect("/" + requestedPage);
    }
    else{ //show existing list
      res.render("list",{pageTitle: foundList.name, newListItems: foundList.items});
    }
  }
});


});

app.post("/", function(req, res) {
const itemName = req.body.newItem ;  //saving the new item entered in the input in a constant
const listName = req.body.list;

const item = new Item({name:itemName });  //creating a new document that will take new item entered in the input.

if(listName === "Today"){
  item.save(); //saving the new item
  res.redirect("/");
} else{
  Page.findOne({name: listName} , function(err, foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+ listName);
  });
}

  // let item = req.body.newItem; //(newItem is the name of the input tag)
  // if (req.body.list === "work") //"list" is the name of button
  // {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item); //adding items in item[]
  //   res.redirect("/"); //redirect to the home page
  // }
});

app.post("/delete",function(req,res){

  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if(listName ="Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){ //checking err is mandatory in this method
      if(!err){
        console.log("successfully deleted");
        res.redirect("/");
      }
    });
  } else{
    Page.findOneAndUpdate({name:listName}, {$pull:{items:{_id:checkedItemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/"+ listName);
      }
    });
  }

});



// app.get("/work", function(req, res) {
//   res.render("list", {
//     pageTitle: "work List",
//     newListItems: workItems
//   });
// });

app.post("/work", function(req, res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work"); //redirect to work route(ir. work page)
});

app.get("/about", function(req, res) {
  res.render("about");

});

app.listen(3000, function() {
  console.log("server listening at localhost 3000");
});
