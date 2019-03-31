
var express = require('express'); // create router
var fs = require('fs');// file system
// var csvWriter = require('csv-write-stream');// write to csv file
// var writer = csvWriter();//write header for csv file
var reader =require('csvtojson');// read from csv file
var { Parser } = require('json2csv');// write to csv file
const csvFilename = "./public/student.csv"; // path to file student.csv
const fields = ['id', 'name', 'codeOfCourse'];

var routerRigister = express.Router(); 
//all student of course
routerRigister.get('/:codeOfCourse/student',(req, res)=>{
// read file from csv to handle
reader()
.fromFile(csvFilename)
.then((jsonObj)=>{
var students = jsonObj;
// find index of student need to get
const student = students.find(c => c.codeOfCourse == parseInt(req.params.codeOfCourse));
if(!student) res.status(404).send('Not found!');
const student_course = [student.codeOfCourse];
for(let i = 0; i<students.length;i++){
    if(students[i].codeOfCourse == parseInt(req.params.codeOfCourse)) student_course.push(students[i].name); 
}

res.send(student_course); 
 // parser json, write it to csv file
const json2csvParser = new Parser({ fields }); 
const csv = json2csvParser.parse(students);
    fs.writeFile(csvFilename, csv, (err)=>{
        if (err) throw err;
    });

});
});
//all course of student
routerRigister.get('/:id/student',(req, res)=>{
// read file from csv to handle
reader()
.fromFile(csvFilename)
.then((jsonObj)=>{
var students = jsonObj;
// find index of student need to get
const student = students.find(c => c.id == parseInt(req.params.id));
if(!student) res.status(404).send('Not found!');
const course_student = [student.name];
for(let i = 0; i<students.length;i++){
    if(students[i].id == parseInt(req.params.id)) course_student.push(students[i].codeOfCourse); 
}

res.send(course_student); 
 // parser json, write it to csv file
const json2csvParser = new Parser({ fields }); 
const csv = json2csvParser.parse(students);
    fs.writeFile(csvFilename, csv, (err)=>{
        if (err) throw err;
    });

})
});

module.exports = routerRigister;