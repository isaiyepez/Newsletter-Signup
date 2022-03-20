//jshint esversion:6

const express = require("express");
const https = require("https");

// e48dfee5a5d8d699c6a819751d04a6d9-us14
// a897d80786

const app = express();
const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: 'e48dfee5a5d8d699c6a819751d04a6d9',
  server: 'us14',
});

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.listen(process.env.PORT || 3001, function() {
    console.log("Newsletter app is running");
});

async function callPing() {
    const response = await mailchimp.ping.get();
    console.log(response);
  }
  
  callPing();

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
 });
 //Observe the attributes that the form has in HTML
 // Also, the values are getted by the name 
 // property in the input elements
 app.post("/signup.html", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
        {
            email_address : email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }
      ]
    };
   
      const run = async () => {
          const response = await mailchimp.lists.batchListMembers("a897d80786", data);
          console.log(response);
          console.log("GETTING NEXT STATUS CODE    " + response.statusCode);
          if (response.error_count === 0) {
            res.sendFile(__dirname + "/success.html");
          } else {
            res.sendFile(__dirname + "/failure.html");
          }

        };
      
        run();
      
    });

    app.post("/failure.html", function(req, res) {
      res.redirect("/");
    });
    
