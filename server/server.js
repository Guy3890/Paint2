const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');




app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
const port = 5050;

app.get('/', function(req, res){
    fs.readFile('images.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        }
res.status(200).send(obj);

})});

app.post('/', function(req, res) {
    //console.log(req.body);
  //https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js
    fs.readFile('images.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        
        if (!obj || !Array.isArray(obj)) {
            obj = [];
        }
    //    console.log(req.body.imgSrc:);
      //  const reqBody =JSON.parse(req.body);
    //  console.log(reqBody);
    
    console.log('before');
    console.log(obj);
        obj.push({src:req.body.imgSrc}); //add some data
        console.log('after');
        console.log(obj);
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('images.json', json, 'utf8',function writeFileCallback(params) {
            console.log('finished');
        }); // write it back 
    }});
  
  
    res.sendStatus(200);
  });

  app.delete('/', function(req, res) {

        fs.writeFile('images.json', JSON.stringify([]), 'utf8',function writeFileCallback(params) {
            
        }); // write it back 
   
    res.sendStatus(200);
  });


  app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
  })