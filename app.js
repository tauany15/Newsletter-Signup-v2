const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const dotEnv = require("dotenv").config();

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME:lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  const API_KEY = process.env.API_KEY
  const LIST_ID = process.env.LIST_ID

  const url = "https://us21.api.mailchimp.com/3.0/lists/" + LIST_ID;
  const options = {
    method: "POST",
    auth: "tauany1:" + API_KEY
  }

  const rqst = https.request(url, options, function(response){

    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });

  });

  rqst.write(jsonData);
  rqst.end();
});

app.post("/failure", function(req,res){
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
