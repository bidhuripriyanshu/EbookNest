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
        validate: {
            validator: function (v) {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message: 'Invalid email address.'
        }
    },
    password: {
        type: String,
        required: true,
        
    },
    mobile: {
        type: Number,
        required: true,
    },
    age: {
        type: Number,
        required: true
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