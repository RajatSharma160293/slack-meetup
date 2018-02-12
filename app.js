var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req,res) => {
  res.status(200).sendFile(path.join(__dirname + '/sample.html'));
})

app.post('/slack/slash-commands/send-me-buttons', urlencodedParser, (req, res) =>{
    res.status(200).end() // best practice to respond with empty 200 status code
    var reqBody = req.body
    var responseURL = reqBody.response_url
    if (reqBody.token != '3mjnNXTEIxqWOkmjpnhEBlGn'){
        res.status(403).end("Access forbidden")
    }else{
        var message = {
            "text": "This is your first interactive message",
            "attachments": [
                {
                    "text": "Coming to meeting today?",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "button_tutorial",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "yes",
                            "text": "yes",
                            "type": "button",
                            "value": "yes"
                        },
                        {
                            "name": "no",
                            "text": "no",
                            "type": "button",
                            "value": "no"
                        },
                        {
                            "name": "maybe",
                            "text": "maybe",
                            "type": "button",
                            "value": "maybe",
                            "style": "danger"
                        }
                    ]
                }
            ]
        }
        sendMessageToSlackResponseURL(responseURL, message)
    }
})

function sendMessageToSlackResponseURL(responseURL, JSONmessage){
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    }
    request(postOptions, (error, response, body) => {
        if (error){
            // handle errors as you see fit
        }
    })
}

app.post('/slack/actions', urlencodedParser, (req, res) =>{
    res.status(200).end() // best practice to respond with 200 status
    var actionJSONPayload = JSON.parse(req.body.payload) // parse URL-encoded payload JSON string
    var message = {
        "text": actionJSONPayload.user.name+" clicked: "+actionJSONPayload.actions[0].name,
        "replace_original": false
    }
    sendMessageToSlackResponseURL(actionJSONPayload.response_url, message)
})

app.post('/slack/slash-commands/meeting-response', urlencodedParser, (req, res) =>{
    res.status(200).end() // best practice to respond with empty 200 status code
    var reqBody = req.body
    var responseURL = 'https://slack.com/api/chat.postMessage'
    if (reqBody.token != '3mjnNXTEIxqWOkmjpnhEBlGn'){
      res.status(403).end("Access forbidden")
    }else{
      var message = {
        "token": 'xoxp-253912083681-289504108851-313557509410-da9fa0e44c8b105de0e971df3e51fcd8',
        "channel": "#dummy-app",
        "as_user": true,
        "username": "Meetup App"
        "text": "This is a query from Meetup App",
        "attachments": [
          {
                "text": "Coming to meeting today?",
                "fallback": "Shame... buttons aren't supported in this land",
                "callback_id": "button_tutorial",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "actions": [
                    {
                        "name": "yes",
                        "text": "yes",
                        "type": "button",
                        "value": "yes"
                    },
                    {
                        "name": "no",
                        "text": "no",
                        "type": "button",
                        "value": "no"
                    },
                    {
                        "name": "maybe",
                        "text": "maybe",
                        "type": "button",
                        "value": "maybe",
                        "style": "danger"
                    }
                ]
            }
        ]
      }
      console.log(reqBody);
      sendMessageToSlackResponseURL(responseURL, message)
    }
})



module.exports = app;
