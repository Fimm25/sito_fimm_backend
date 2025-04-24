import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Schema per il contatore
const counterSchema = new Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: -1 }
});

const Counter = model('counters', counterSchema);

// Schema per meterReader
const meterReaderSchema = new Schema({
    image: {
        type: Buffer,
        required: true
    },
    contentType: {
        type: String,  // Questo campo salverà il tipo MIME (es. 'image/jpeg')
        required: true
    },
    name: {
        type: String,
        required: true,
        minLength: 2
    },
    surname: {
        type: String,
        required: true,
        minLength: 2
    },
    matricola: {
        type: String,
        required: true,
    },
    publishedAt: {
        type: Date,
        default: Date.now, // Imposta la data di pubblicazione al momento della creazione
    },
    isActive: {  
        type: Boolean,
        default: true,
    }
});

// Modello per meterReader
const MeterReader = model('meterReader', meterReaderSchema);

export { MeterReader, Counter };
