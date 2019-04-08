var express = require('express'); // create router
var fs = require('fs');// file system
var joi = require('joi');// create rule of input
var csvWriter = require('csv-write-stream');// write to csv file
var writer = csvWriter();//write header for csv file
var reader =require('csvtojson');// read from csv file
var { Parser } = require('json2csv');// write to csv file
const csvStudentFilename = "./public/student.csv"; // path to file student.csv
const csvCourseFilename = "./public/course.csv"; // path to file course.csv
const csvRegisteFilename = "./public/register.csv"; // path to file register.csv
const studentFields = ['id', 'name', 'codeOfCourse'];
const courseFields = ['codeOfCourse', 'nameCourse'];
const registerFields = ['id', 'codeOfCourse'];


var routerRegister = express.Router(); 
//post register 
routerRegister.post('/', (req, res)=>{
    // If CSV file does not exist, create it and add the headers
    if (!fs.existsSync(csvRegisteFilename)) {
        writer = csvWriter({sendHeaders: false});
        writer.pipe(fs.createWriteStream(csvRegisteFilename));
        writer.write({
          header1: "id",
          header2: "codeOfCourse"
        });
        writer.end();
      } 
      // Append some data to CSV the file  
      reader()
      .fromFile(csvRegisteFilename)
      .then((jsonObj)=>{
      var registers = jsonObj;
      //post register
      const schema = {
          id : joi.required(),
          codeOfCourse : joi.required()
      };
      const result = joi.validate(req.body, schema); 
      if (result.error) return res.status(400).send(result.error.details[0].message);
      const register = {
      id : req.body.id,
      codeOfCourse : req.body.codeOfCourse
        }
      registers.push(register);
       // parser json, write it to csv file
      const json2csvParser = new Parser({ registerFields }); 
      const csv = json2csvParser.parse(registers);// sort to fields
          fs.writeFile(csvRegisteFilename, csv, (err)=>{
              if (err) throw err;
              console.log("post!!!")
          });
      // respond register be posted
      res.send(register); 
      })
});
//updata register
routerRegister.put('/:id', (req, res)=>{
    // read file from csv to handle
    reader()
    .fromFile(csvRegisteFilename)
    .then((jsonObj)=>{
    var registers = jsonObj;
    // find index of register need to delete
    const register = registers.find(c => c.id == parseInt(req.params.id));
    if(!register) res.status(404).send('Not found!');
    //update register
    const schema = {
        id : joi.required(),
        codeOfCourse : joi.required()
    };
    const result = joi.validate(req.body, schema); 
    if (result.error) return res.status(400).send(result.error.details[0].message);
    register.id = req.body.id;
    register.codeOfCourse = req.body.codeOfCourse;
     // parser json, write it to csv file
    const json2csvParser = new Parser({ registerFields }); 
    const csv = json2csvParser.parse(students);
        fs.writeFile(csvRegisteFilename, csv, (err)=>{
            if (err) throw err;
            console.log("update!!!")
        });
    // respond register updated
    res.send(register); 
    })
});
//delete register
routerRegister.delete('/:id', (req, res)=>{
    // read file from csv to handle
    reader()
    .fromFile(csvRegisteFilename)
    .then((jsonObj)=>{
    var registers = jsonObj;
    // find index of student course need to delete
    const register = registers.find(c => c.id == parseInt(req.params.id));
    if(!register) res.status(404).send('Not found!');
    //delete register
    const index = registers.indexOf(register);
    register.splice(index, 1);
     // parser json, write it to csv file
    const json2csvParser = new Parser({ fields }); 
    const csv = json2csvParser.parse(students);
        fs.writeFile(csvRegisteFilename, csv, (err)=>{
            if (err) throw err;
            console.log("delete!!!")
        });
    // respond register deleted
    res.send(register); 
    })
});

//all student of course
routerRegister.get('/:codeOfCourse/student',(req, res)=>{
// read file from csv to handle
reader()
    .fromFile(csvRegisteFilename)
    .then((jsonObj)=>{
    var registers = jsonObj;
    var studentOfCourse = [];
    // find index of student need to get
    for(var i = 0; i < registers.length; i++){
        if(registers[i].codeOfCourse == parseInt(req.params.codeOfCourse)) studentOfCourse.push(registers[i].id)
    }
    if(studentOfCourse.length == 0)res.status(404).send('Not found!');
    reader()
        .fromFile(csvStudentFilename)
        .then((jsonObj2)=>{
            var students = jsonObj2;
            var nameOfStudentInCourse = [];
            for(let i = 0; i<studentOfCourse.length; i++)
             for(let j = 0; j<students.length; j++){
                 if(studentOfCourse[i]==students[j].id) nameOfStudentInCourse.push(students[j])
             }
             res.send(nameOfStudentInCourse);
        })

    });
});
//all course of student
routerRegister.get('/:id/course',(req, res)=>{
// read file from csv to handle
reader()
    .fromFile(csvRegisteFilename)
    .then((jsonObj)=>{
    var registers = jsonObj;
    var courseOfStudent = [];
    // find index of student need to get
    for(var i = 0; i < registers.length; i++){
        if(registers[i].id == parseInt(req.params.id)) courseOfStudent.push(registers[i].codeOfCourse)
    }
    if(courseOfStudent.length == 0)res.status(404).send('Not found!');
    reader()
        .fromFile(csvCourseFilename)
        .then((jsonObj2)=>{
            var courses = jsonObj2;
            var nameOfCourseOfSt = [];
            for(let i = 0; i<courseOfStudent.length; i++)
             for(let j = 0; j<courses.length; j++){
                 if(courseOfStudent[i]==courses[j].codeOfCourse) nameOfCourseOfSt.push(courses[j])
             }
             res.send(nameOfCourseOfSt);
        })

    });
});

module.exports = routerRegister;