import mongoose from "mongoose";

const { Schema, SchemaTypes, model } = mongoose

const schema = new Schema ({

    first_name:{
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
    trim: true
    },
    last_name:{
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        trim: true
        },
    author:{
        type: SchemaTypes.ObjectId,
        ref: "Author",
        required: true,
    },
})

const Author = model ('Author', schema);

export default Author;

/*
// models/author.js
import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const { Schema, SchemaTypes, model } = mongoose;

const authorSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 4,
        maxLength: 50,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    }
});

// Middleware per hashare la password prima di salvarla
authorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Metodo per verificare la password
authorSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Author = model('Author', authorSchema);

export default Author;
*/