const express = require('express'); 
const app = express(); 
app.use(express.json()); 
//-------------------------------------------------------------------------------
//home
app.get('/', (req, res)=>{ 
    res.send('UNIVERSITY');
});

 app.use('/api/students', require('./student/students'));
 app.use('/api/courses', require('./course/courses'));
 app.use('/api/register', require('./register/register'));

const port = process.env.PORT || 3000;// chạy PORT ngẫu nhiên nếu PORT 3000
app.listen(port, ()=>{
    console.log(`Listen on port ${port}`);
})