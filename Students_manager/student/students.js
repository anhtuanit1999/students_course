var joi = require('joi');// create rule of input
var express = require('express'); // create router
var fs = require('fs');// file system
var csvWriter = require('csv-write-stream');// write to csv file
var writer = csvWriter();//write header for csv file
var reader =require('csvtojson');// read from csv file
var { Parser } = require('json2csv');// write to csv file
const csvFilename = "./public/student.csv"; // path to file student.csv
const fields = ['id', 'name'];

var routerStudent = express.Router(); 

//get students
routerStudent.get('/', (req, res)=>{
    reader()
    .fromFile(csvFilename)
    .then((jsonObj)=>{
    console.log("get success!");
    res.send(jsonObj);
    })
});
//post students
routerStudent.post('/', (req, res)=>{
    // If CSV file does not exist, create it and add the headers
    if (!fs.existsSync(csvFilename)) {
        writer = csvWriter({sendHeaders: false});
        writer.pipe(fs.createWriteStream(csvFilename));
        writer.write({
          header1: "id",
          header2: "name",
        });
        writer.end();
      } 
      // Append some data to CSV the file  
      reader()
      .fromFile(csvFilename)
      .then((jsonObj)=>{
      var students = jsonObj;
      //post student
      const schema = {
          id : joi.required(),
          name : joi.string().min(3).required(),
      };
      const result = joi.validate(req.body, schema); 
      if (result.error) return res.status(400).send(result.error.details[0].message);
      const student = {
      name : req.body.name,
      id : req.body.id,}
      students.push(student);
       // parser json, write it to csv file
      const json2csvParser = new Parser({ fields }); 
      const csv = json2csvParser.parse(students);// sort to fields
          fs.writeFile(csvFilename, csv, (err)=>{
              if (err) throw err;
              console.log("post!!!")
          });
      // respond student be posted
      res.send(student); 
      })
});
//put student
routerStudent.put('/:id', (req, res)=>{
    // read file from csv to handle
    reader()
    .fromFile(csvFilename)
    .then((jsonObj)=>{
    var students = jsonObj;
    // find index of student need to delete
    const student = students.find(c => c.id == parseInt(req.params.id));
    if(!student) res.status(404).send('Not found!');
    //update student
    const schema = {
        id : joi.required(),
        name : joi.string().min(3).required()
    };
    const result = joi.validate(req.body, schema); 
    if (result.error) return res.status(400).send(result.error.details[0].message);
    student.name = req.body.name;
    student.id = req.body.id;
     // parser json, write it to csv file
    const json2csvParser = new Parser({ fields }); 
    const csv = json2csvParser.parse(students);
        fs.writeFile(csvFilename, csv, (err)=>{
            if (err) throw err;
            console.log("update!!!")
        });
    // respond student deleted
    res.send(student); 
    })
});
//delete student
routerStudent.delete('/:id', (req, res)=>{
    // read file from csv to handle
    reader()
    .fromFile(csvFilename)
    .then((jsonObj)=>{
    var students = jsonObj;
    // find index of student need to delete
    const student = students.find(c => c.id == parseInt(req.params.id));
    if(!student) res.status(404).send('Not found!');
    //delete student
    const index = students.indexOf(student);
    students.splice(index, 1);
     // parser json, write it to csv file
    const json2csvParser = new Parser({ fields }); 
    const csv = json2csvParser.parse(students);
        fs.writeFile(csvFilename, csv, (err)=>{
            if (err) throw err;
            console.log("delete!!!")
        });
    // respond student deleted
    res.send(student); 
    })
});
//get one student
routerStudent.get('/:id', (req, res)=>{
    
     // read file from csv to handle
     reader()
     .fromFile(csvFilename)
     .then((jsonObj)=>{
     var students = jsonObj;
     // find index of student need to get
     const student = students.find(c => c.id == parseInt(req.params.id));
     if(!student) res.status(404).send('Not found!');
      // parser json, write it to csv file
     const json2csvParser = new Parser({ fields }); 
     const csv = json2csvParser.parse(students);
         fs.writeFile(csvFilename, csv, (err)=>{
             if (err) throw err;
             console.log("get one!!!")
         });
     // respond student be got
     res.send(student); 
     })
});
module.exports = routerStudent;