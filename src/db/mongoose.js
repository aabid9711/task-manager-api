const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL,{

useNewUrlParser:true,
useCreateIndex:true,
useUnifiedTopology: true,
useFindAndModify:false
})


// const task = new Task({
//     description:'  Lean Java  ',
//     completed:true
// })

// task.save(    
// ).then(()=>{
// console.log(task)
// }).catch((error)=>{
// console.log(error)
// })