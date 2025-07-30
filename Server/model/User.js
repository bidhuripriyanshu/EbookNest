import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        
    },
    mobile: {
        type: Number,
       
    age: {
        type: Number,
       
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        required: true,
    }
}, {
    timestamps: true
})

const User = model("User", userSchema);

export default User;
