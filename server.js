const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle form submission
app.post('/signup', (req, res) => {
    const { email } = req.body;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed"
        }]
    };

    const jsonData = JSON.stringify(data);
    const apiKey = "2898275effa8ac778e493fa8eec732e1-us17";
    const url = "https://us17.api.mailchimp.com/3.0/lists/49d1ea1696";
    const options = {
        method: "POST",
        auth: "thienphupham:2898275effa8ac778e493fa8eec732e1-us17"
    };

    const request = https.request(url, options, (response) => {
        let responseData = '';

        response.on("data", (data) => {
            responseData += data;
        });

        response.on("end", () => {
            if (response.statusCode === 200) {
                console.log("Successfully added to Mailchimp:", responseData);
                res.send('Thank you for signing up!');
            } else {
                console.log("Failed to add to Mailchimp:", responseData);
                res.send('There was an error with signing up, please try again!');
            }
        });
    });

    request.on("error", (e) => {
        console.error(`Problem with request: ${e.message}`);
        res.send('There was an error with signing up, please try again!');
    });

    request.write(jsonData);
    request.end();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
