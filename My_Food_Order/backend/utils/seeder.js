// BACKEND/utils/seeder.js


// We are creating a Seeder Script.
// To quickly populate the database with **sample/default data** without manually adding records one by one.
// During **development, testing, or project setup** when we need initial data in the database.

// ---

// What does it do? :

// `deleteMany()` → Removes all existing food items from the collection.

//`insertMany(fooditems)` → Inserts food items from the JSON file into MongoDB.

// `connectDatabase()` → Establishes a connection with the database.

//`dotenv.config()` → Loads environment variables from the `.env` file.

//`process.exit()` → Stops the script execution after completion.


// > Think of opening a new supermarket branch. Instead of placing products on shelves one by one, a truck delivers all the predefined products at once. The seeder script is that truck.


// >A seeder script automatically clears old data and inserts predefined data into the database, saving time during development and testing.

// > "Will this delete my existing database data?"

// Yes. Since `deleteMany()` is used, all existing records in that collection will be removed before inserting new data. That's why seeder scripts are usually used only in **development environments**, not in production.


const Fooditem = require("../models/foodItem");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");

const fooditems = require("../data/foodItem.json");
const { connect } = require("mongoose");

// Setting dotenv file
dotenv.config({ path: "backend/config/config.env" });

connectDatabase();

const seedFooditems = async () => {
  try {
    await Fooditem.deleteMany(); //will delete all the fooditems
    console.log("FoodItems are deleted");
    await Fooditem.insertMany(fooditems);
    console.log("All FoodItems are added.");
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedFooditems();
