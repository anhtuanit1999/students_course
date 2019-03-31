var joi = require('joi');// create rule of input
var express = require('express'); // create router
var fs = require('fs');// file system
var csvWriter = require('csv-write-stream');// write to csv file
var writer = csvWriter();//write header for csv file
var reader =require('csvtojson');// read from csv file
var { Parser } = require('json2csv');// write to csv file
const csvFilename = "./public/course.csv"; // path to file student.csv
const fields = ['codeOfCourse', 'nameCourse'];

var routerCourse = express.Router(); 

//get courses
routerCourse.get('/', (req, res)=>{
    reader()
    .fromFile(csvFilename)
    .then((jsonObj)=>{
    console.log("get success!");
    res.send(jsonObj);
    })
});
//post course
routerCourse.post('/', (req, res)=>{
    // If CSV file does not exist, create it and add the headers
    if (!fs.existsSync(csvFilename)) {
        writer = csvWriter({sendHeaders: false});
        writer.pipe(fs.createWriteStream(csvFilename));
        writer.write({
          header1: "codeOfCourse",
          header2: "nameCourse",
        });
        writer.end();
      } 
      // Append some data to CSV the file  
      reader()
      .fromFile(csvFilename)
      .then((jsonObj)=>{
      var courses = jsonObj;
      //post student
      const schema = {
          codeOfCourse : joi.required(),
          nameCourse : joi.string().min(3).required(),
      };
      const result = joi.validate(req.body, schema); 
      if (result.error) return res.status(400).send(result.error.details[0].message);
      const course = {
      codeOfCourse : req.body.codeOfCourse,
      nameCourse : req.body.nameCourse,}
      courses.push(course);
       // parser json, write it to csv file
      const json2csvParser = new Parser({ fields }); 
      const csv = json2csvParser.parse(courses);
          fs.writeFile(csvFilename, csv, (err)=>{
              if (err) throw err;
              console.log("post!!!")
          });
      // respond student be posted
      res.send(course); 
      })
});
//put course
routerCourse.put('/:codeOfCourse',(req, res)=>{
    // read file from csv to handle
    reader()
    .fromFile(csvFilename)
    .then((jsonObj)=>{
    var courses = jsonObj;
    // find index of course need to delete
    const course = courses.find(c => c.codeOfCourse == parseInt(req.params.codeOfCourse));
    if(!course) res.status(404).send('Not found!');
    //update course
    const schema = {
        codeOfCourse : joi.required(),
        nameCourse : joi.string().min(3).required()
    };
    const result = joi.validate(req.body, schema); 
    if (result.error) return res.status(400).send(result.error.details[0].message);
    course.codeOfCourse = req.body.codeOfCourse;
    course.nameCourse = req.body.nameCourse;
     // parser json, write it to csv file
    const json2csvParser = new Parser({ fields }); 
    const csv = json2csvParser.parse(courses);
        fs.writeFile(csvFilename, csv, (err)=>{
            if (err) throw err;
            console.log("update!!!")
        });
    // respond course deleted
    res.send(course); 
    })
});
//delete course
routerCourse.delete('/:codeOfCourse',(req, res)=>{
    // read file from csv to handle
    reader()
    .fromFile(csvFilename)
    .then((jsonObj)=>{
    var courses = jsonObj;
    // find index of course need to delete
    const course = courses.find(c => c.codeOfCourse == parseInt(req.params.codeOfCourse));
    if(!course) res.status(404).send('Not found!');
    //delete course
    const index = courses.indexOf(course);
    courses.splice(index, 1);
     // parser json, write it to csv file
    const json2csvParser = new Parser({ fields }); 
    const csv = json2csvParser.parse(courses);
        fs.writeFile(csvFilename, csv, (err)=>{
            if (err) throw err;
            console.log("delete!!!")
        });
    // respond course deleted
    res.send(course); 
    })
});
//get one course
routerCourse.get('/:codeOfCourse', (req, res)=>{
    // read file from csv to handle
    reader()
    .fromFile(csvFilename)
    .then((jsonObj)=>{
    var courses = jsonObj;
    // find index of course need to get
    const course = courses.find(c => c.codeOfCourse == parseInt(req.params.codeOfCourse));
    if(!course) res.status(404).send('Not found!');
     // parser json, write it to csv file
    const json2csvParser = new Parser({ fields }); 
    const csv = json2csvParser.parse(courses);
        fs.writeFile(csvFilename, csv, (err)=>{
            if (err) throw err;
            console.log("get one!!!")
        });
    // respond course be got
    res.send(course); 
    })
});
module.exports = routerCourse;