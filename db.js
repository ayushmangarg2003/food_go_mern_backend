const mongoose = require("mongoose");
const mongoURL =
  "mongodb+srv://FoodGo:08102003@cluster0.hrieiah.mongodb.net/FoodGo?retryWrites=true&w=majority";

const mongoDB = async () => {
  await mongoose.connect(
    mongoURL,
    { useNewUrlParser: true },
    async (err, result) => {
      if (err) console.log(err);
      else {
        console.log("connected");
        const fetched_data = await mongoose.connection.db.collection(
          "food_items"
        );
        fetched_data.find({}).toArray(async function (err, data) {
          const food_category_data = await mongoose.connection.db.collection(
            "food_category"
          );
          food_category_data.find({}).toArray(function (err, catData) {
            if (err) console.log(err);
            else {
              global.food_category = catData;
            }
          });
          if (err) console.log(err);
          else {
            global.food_items = data;
          }
        });
      }
    }
  );
};
module.exports = mongoDB;
