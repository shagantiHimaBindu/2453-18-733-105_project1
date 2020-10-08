const express = require('express');
const app=express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//connecting server file for AWT
let server= require('./server');
let config= require('./config');
let middleware = require('./middleware');
const response = require('express');

//for  mongodb
 const MongoClient=require('mongodb').MongoClient;


//connecting express and mongodb
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalmanagement';
let db
MongoClient.connect(url, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});
//fetching hospital details
app.get('/hospitaldetails',middleware.checkToken,function (req,res){
    console.log("fetching data from hospital collection");
    var data=db.collection('hospital').find().toArray()
    .then(result=> res.json(result));
});
 

//ventilator details
app.get('/-',middleware.checkToken,function (req,res){
    console.log("ventilator details");
    var ventilatordetails = db.collection('ventilator').find().toArray()
    .then(result=> res.json(result));
});



//search ventilators by status
app.post('/searchventbystatus',middleware.checkToken,(req,res)=>{
    var status =req.body.status;
    console.log(status);
    var ventilatordetails = db.collection('ventilator')
    .find({"status":status}).toArray().then(result  => res.json(result));
});

//search ventilators by hospital name
app.post('/searchventbyname',middleware.checkToken,(req,res)=>{
    var name = req.query.name;
    console.log(name);
    var ventilatordetails =db.collection('ventilator')
    .find({'name':new RegExp(name,'i')}).toArray().then(result => res.json(result));
});

//search hospital by name
app.post('/searchhospital',middleware.checkToken,(req,res)=>{
    var name = req.query.name;
    console.log(name);
    var hospitaldetails =db.collection('hospital')
    .find({'name':new RegExp(name,'i')}).toArray().then(result => res.json(result));
});


//update ventilator details
app.put('/ventdetails',middleware.checkToken,function(req,res){
    console.log("updating data of ventilators collection");
    var v={vid:req.body.vid};
    var status={$set: {status:req.body.status}};
    db.collection('ventilator').updateOne(v,status,function(err,res){
        console.log("updated");
    });
    //db.collection('ventilators').find().toArray().then(result => res.send(result));
    res.send("data updated");
});

//add ventilator
app.post('/addventilator',middleware.checkToken,(req, res)=>{
    var hid=req.body.hid;
    var vid=req.body.vid;
    var status =req.body.status;
    var name=req.body.name;
    var item=
    {
        hid:hid,vid:vid,status:status ,name :name
    };
    db.collection('ventilator').insertOne(item, function(err, result){
        res.json("item inserted");
    });
});


//delete the ventilator by vid
app.delete('/delete',middleware.checkToken,(req,res) => {
    var myquery=req.query.vid;
    console.log(myquery);
     var myquery1 ={vid:myquery};
     db.collection('ventilators').deleteOne(myquery1,function(err, obj){
         if(err) throw err;
         res.json("1 document deleted");
     });
}).listen(3000);