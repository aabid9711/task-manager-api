const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/tasks')
const userSchema = new mongoose.Schema({

  name:{
      type:String,
      required:true,
      lowercase:true,
      trim:true
  }
  ,
  Email:{
      type:String,
      required:true,
      trim:true,
      unique:true,
      lowercase:true,
      validate(value){

          if(!validator.isEmail(value)){
            throw new Error('email is not valid')
          }
      }
  },
  password:{
      type:String,
      required:true,
      trim:true,
      minLength:7,
      validate(value){
         if(value.toLowerCase().includes('password')){
            throw new Error('password can not be "passsword"')
         }
      }
  },
  age:{
    type:Number,
    default:0,
    validate(value){
      if(value<0){
        throw new Error("Age can't be negative")
      }
   }
  },
  tokens:[{
    token:{
      type:String,
      require:true
    }
  }],
  avatar:{
    type:Buffer
  }
},{
  timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function(){

  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar
  return userObject
}


userSchema.methods.getAuthToken = async function(){

   const user = this 

   const token = jwt.sign({_id:user._id},process.env.JWT_SECRET)

   user.tokens = user.tokens.concat({token})

  await user.save()

   return token
}




// check the user is authention using email and p/w
userSchema.statics.findByCredentials = async(email,password)=>{

  const user = await User.findOne({Email:email})
  
  if(!user){
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password,user.password)

  if(!isMatch){
    throw new Error('Unable to login')
  }

  return user
}

// middleware used for hashed the p/w
userSchema.pre('save',async function(next){

  const user = this

  if(user.isModified('password')){
    
    user.password = await bcrypt.hash(user.password,8)
  }
  next()
})

//Delete user tasks when user is removed
userSchema.pre('remove',async function(next){

  const user = this
  await Task.deleteMany({owner:user._id})
  next()
})

const User = mongoose.model('User',userSchema)

module.exports=User
