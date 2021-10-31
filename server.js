const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || 8000;
const path = require("path")


app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.static(path.join(__dirname, "client", "build")))

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const scoreSchema = mongoose.Schema({
  team: String,
  teamScore: String,
  position: String,
});

const userSchema = mongoose.Schema({
  username: String,
  password: String,
});

const Score = mongoose.model("Score", scoreSchema);

const User = mongoose.model("User", userSchema);

const default1 = new Score({
  team: "Level 1",
  teamScore: 0,
  position: 0,
});

const default2 = new Score({
  team: "Level 2",
  teamScore: 0,
  position: 0,
});

const default3 = new Score({
  team: "Level 3",
  teamScore: 0,
  position: 0,
});

const default4 = new Score({
  team: "Level 4",
  teamScore: 0,
  position: 0,
});

const defaultTeams = [default1, default2, default3, default4];

app.get("/scores", (req, res) => {
  Score.find(function (err, scores) {
    if (err) {
      console.log(err);
    } else {
      if (scores.length === 0) {
        Score.insertMany(defaultTeams, function (err) {
          if (err) {
            console.log(err);
          }
        });
      }
      res.json(scores);
    }
  });
});

app.post("/update", (req, res) => {
  let data = req.body.scoreData;

  data.forEach((score) => {
    saveScore = new Score();
    saveScore = score;

    Score.findOneAndUpdate({ _id: score._id }, score, { multi: true })
      .then((updatedRows) => {
        res.send("updated successfully");
      })
      .catch((err) => {
        res.send(err);
        console.log(err);
      });
  });

  console.log(data);
});

app.get("/login", (req, res) => {
  User.find((err, users) => {
    if (err) {
      console.log(err);
    } else {
      if (users.length === 0) {
        res.send("password");
      } else {
        res.send("hidden");
      }
    }
  });
});

app.post("/newlogin", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  const newUser = new User({
    username: username,
    password: password,
  });

  if (newUser.save()) {
    res.send("ok");
  } else {
    res.send("err");
  }
});

app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ username: username, password: password }, function (err, obj) {
    if(err){
        console.log(err);
    }
    else if (obj){
        res.send('ok');
    }
    else{
        res.send('err');
    }
  });

});


// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build')); // serve the static react app
  app.get(/^\/(?!api).*/, (req, res) => { // don't serve api routes to react app
    res.sendFile(path.join(__dirname, './client/build/index.html'));
  });
  console.log('Serving React App...');
};


app.listen(PORT, () => {
  console.log("Server listening on " + PORT);
});
