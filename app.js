/*
before run

setup :
base = /Users/???/code/json-to-database/node_modules/
base -> npm install uuid
base -> npm install mysql

set database information
also set jsonl file location

 */
var mysql = require('mysql');
var express = require('express');
var app   = express();
var dbCon = require('./config/db').dbCon;
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var data = '';

var con = mysql.createConnection({
  connectionLimit : 50,
  host: '',
  user: '',
  password: '',
  database: '',
  waitForConnections: true,
  queueLimit: 10000
});
con.connect(function(err) {
  if (err) throw err;
});

const {  v4: uuidv4, } = require('uuid');

// Create a readable stream
var readerStream = fs.createReadStream('./../../Downloads/markian_result.jsonl');

// Set the encoding to be utf8.
readerStream.setEncoding('UTF8');

var outstream = new stream();
//createInterface - read through the stream line by line and print out data from it
var r1 = readline.createInterface(readerStream, outstream);
var lineCount = 0;

r1.on('line', function (line) {
  // increment line count
  lineCount++;
  data = JSON.parse(line);

  saveRecord(data);
})

function saveRecord(data) {

  var audience_data_public_id = uuidv4();
  var audience_data_import_history_id = "1";
  var item_id = data["itemId"];
  var user_id_list = data["userIdList"];
  var user_id_list_modify = user_id_list.toString().replace(/'/g,'');

  con.query("insert into audience_data ( audience_data_public_id, audience_data_import_history_id, item_id, user_id_list) values ("
      + "'"  + audience_data_public_id + "','" +  audience_data_import_history_id + "','" + item_id + "','" + user_id_list_modify + "')", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });

  console.log('data inserted');
}

console.log("Program Ended");