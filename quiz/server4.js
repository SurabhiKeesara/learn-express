const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
var cors = require('cors');
const port = 8000;

const readUsers = require('./readUsers');
const writeUsers = require('./writeUsers');
const { match } = require('assert');

let users;
fs.readFile(path.resolve(__dirname, '../data/users.json'), function(err, data) {
  console.log('reading file ... ');
  if(err) throw err;
  users = JSON.parse(data);
})

const addMsgToRequest = function (req, res, next) {
  if(users) {
    req.users = users;
    next();
  }
  else {
    return res.json({
        error: {message: 'users not found', status: 404}
    });
  }
  
}

app.use(
  cors({origin: 'http://localhost:3000'})
);
app.use(addMsgToRequest);

app.use('/read', readUsers);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/write', writeUsers);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use('/read/username', addMsgToRequest)
app.get('/read/username/:name', (req, res) => {
  let username = req.params.name;
  let matching_users = req.users.filter(function(user) {
    return user.username === username
  })
  console.log(matching_users);
  if(matching_users.length === 0) {
    res.send({
      error: {message: `${username} does not exist`, status: 400}
    })
  }
  else {
    res.send(users_with_name);
  }
});
