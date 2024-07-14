// require
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // npm install cors


// Create an instance of Express
const app = express();
app.use(express.json()) // express middlewear
app.use(cors())


// Define a route
// to access api thro url 


// sample in-memory storage for todo items
// let todos =[];


// connect to port
// Start the server
const port = 8000;
app.listen(port, () =>{
    console.log("Server is listening to port "+port);
})

// connecting mongodb
mongoose.connect('mongodb://localhost:27017')
.then(() => {
    console.log("DB connected")
})
.catch((err) => {
    console.log(err)
})

// creating schemas
const todo_schema= new mongoose.Schema({
    title : {
        required : true,
        type : String
    },
    description : {
        require : true,
        type : String
    }
   
})

// create a model
 const todoModel = mongoose.model('Todo',todo_schema);  // Here Todo is model name


// create a new todo item
app.post('/todos', async (req,res) => {
    const {title , description} = req.body;
    // const newtodo = {
    //     id:todos.length+1,
    //     title,
    //     description
    // };
    // todos.push(newtodo);
    // console.log(todos)
try {
    const newtodo = new todoModel({title,description});
    await newtodo.save();

    res.status(201).json(newtodo);
} catch(error){
    console.log(error)
    res.status(500).json({message: error.message});
}

})


// get items API
app.get('/todos', async (req,res) =>{
    try{
        const todos = await todoModel.find();
        res.json(todos); 
    } 
    catch(error){
        console.log(error)
        res.status(500).json({message :error.message })
    }
    
})

// update todo-Item  // put is a ROUTE used to update some data
app.put("/todos/:id" , async (req,res) =>{
    try{
        const {title,description} = req.body;
        const id = req.params.id;

        // now vve to update id and  input data , for that model needed
        const updated_todo = await todoModel.findByIdAndUpdate(
        id,
        {title,description} ,// new title and desc
        { new: true} // to get newly updated data in our postman 
    )
    
    if(!updated_todo){
        return res.status(404).json({message: " Todo not found"})
    }
    res.json(updated_todo)
    // :id =>parameter
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:error.message});
    }
    
})

// deleting a todo item from db
// delete route

app.delete('/todos/:id' , async (req , res)=>{
    try{
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end(); // 204 = job done succesfully but no return available
    }
    catch(error){
        console.log(error)
        res.status(500).json({message : error.message})
    }

})

// if v do any DB operation , it is optimal to have try{} , catch{}
// 204 - no content , but operation done sucessfully