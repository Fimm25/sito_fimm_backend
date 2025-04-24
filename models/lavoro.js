import mongoose from "mongoose";

const { Schema, SchemaTypes, model } = mongoose

const schema = new Schema ({
    image: {
        type: String,
    },
    title:{
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
    trim: true
    },
    author:{
        type: SchemaTypes.ObjectId,
        ref: "Author",
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    ideal_profile:{
        type: String,
        required: true,
    },
    site:{
        type: String,
        required: true,
    },
    contract:{
        type: String,
        required: true,
    },
    publishedAt: {
        type: Date,
        default: Date.now, // Imposta la data di pubblicazione al momento della creazione
      },

})



const lavoro = model ('lavoro', schema);

export default lavoro;

/*
// models/lavoro.js
import mongoose from "mongoose";

const { Schema, SchemaTypes, model } = mongoose;

const lavoroSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 100,
        trim: true
    },
    author: {
        type: SchemaTypes.ObjectId,
        ref: "Author",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ideal_profile: {
        type: String,
        required: true,
    },
    site: {
        type: String,
        required: true,
    },
    contract: {
        type: String,
        required: true,
    },
    publishedAt: {
        type: Date,
        default: Date.now, // Imposta la data di pubblicazione al momento della creazione
    },
});

const Lavoro = model('lavoro', lavoroSchema);

export default Lavoro;
*/