const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
var cors = require('cors');



const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb+srv://admin:admin@cluster0.hf98x.mongodb.net/lab3';
const domen = 'http://localhost:3000';

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/public'));
app.use(cors());
let mongo;

MongoClient.connect(mongoUrl, {useUnifiedTopology: true})
.then(function(client) {
  mongo = client.db();
}).catch((error) => console.log(error.message));

app.post('/drivers', function (request, response){
  try {
    if(request.body.pib != "" && request.body.email != "" && request.body.phone != "" && request.body.info != ""){
      mongo.collection('drivers').insertOne({
        pib: request.body.pib,
        email: request.body.email,
        phone: request.body.phone,
        info: request.body.info,
        marks: [],
        resps: [],
        dates: []
      }).then(function() {
        console.log('Запис створено');
      });
    }
    else{
      console.log("incorrect");
    }
  } catch (error) {
    response.statusCode(500);
  }
  
  
});



app.get('/drivers', function (request, response){
  try {
    mongo
  .collection('drivers')
  .find()
  .toArray()
  .then(function(arr) {
    let r = new Array();
    for(let i=0;i<arr.length;i++){
      r.push(arr[i].pib);
    }
    response.json(r);
  });
  } catch (error) {
    response.statusCode(500);
  }
  

});
app.post('/find_one_drivers', function (request, response){
  try {
    mongo
    .collection('drivers')
    .findOne({
      pib: request.body.pib
    })
    .then(function(one) {
      response.json(one);
    });
  
  } catch (error) {
    response.statusCode(500);
  }
 
});

app.post('/drivers_resp', function (request, response){
  try {
    if(request.body.driver != "" && request.body.mark != "" && request.body.text != "" ){
      mongo.collection('drivers').updateOne({
        pib: request.body.driver
      }, {
        $push: { resps: request.body.text, marks: request.body.mark, dates: new Date().toISOString().slice(0, 10) },
  
      }).then(function() {
        console.log('ok');
      });
    }
    else{
      console.log("incorrect");
    }
  } catch (error) {
    response.statusCode(500);
  }
  
  
});

function arithmetic_mean(l){
  if(l.length == 0){
    return 0;
  }
  let len = l.length;
  
  let result = 0;
  for(let i=0;i<len;i++){
    result += Number(l[i]);
  }
  return result/len;
}

app.get('/drivers_list', function (request, response){
 try {
  mongo
  .collection('drivers')
  .find()
  .toArray()
  .then(function(arr) {
    let len = arr.length;
    let r = new Array();
    for(let i = 0; i<len; i++){
      r.push({
        pib: arr[i].pib,
        star: arithmetic_mean(arr[i].marks),
        phone: arr[i].phone,
        info: arr[i].info,
        email: arr[i].email
      });
    }
    response.json(r);
  }); 
 } catch (error) {
  response.statusCode(500);
 }
  

});

app.listen(3000, function() {
  console.log('App started on '+ domen);
});