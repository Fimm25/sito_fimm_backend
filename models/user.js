import mongoose from 'mongoose';
import validator from 'validator';

const { isStrongPassword, isEmail } = validator;

const strongPasswordOptions = {
    minLength: 8,
    minLowerCase: 1,
    minUpperCase: 1,
    minNumbers: 1,
    minSymbols: 1,
};

const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email è obbligatoria'],
        trim: true,
        unique: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, 'Password è obbligatoria'],
        trim: true,
    },
});

// Middleware per assicurarsi che l'email sia sempre presente
userSchema.pre('save', function (next) {
    if (!this.email) {
        const error = new Error('Email è obbligatoria.');
        error.statusCode = 400;
        return next(error);
    }
    next();
});


userSchema.statics.signUp = async function (email, password) {
    // Verifica che email e password siano forniti
    if (!email || !password) {
        const error = new Error('Email e password sono richiesti.');
        error.statusCode = 400;
        throw error;
    }

    if (!isEmail(email)) {
        const error = new Error('Devi inserire un Email valida');
        error.statusCode = 400;
        throw error;
    }

    if (!isStrongPassword(password, strongPasswordOptions)) {
        const error = new Error('La password non è valida');
        error.statusCode = 400;
        throw error;
    }

    // Controlla se l'email esiste già
    const emailExists = await this.exists({ email });
    if (emailExists) {
        const error = new Error('La tua Email è già in uso!');
        error.statusCode = 400;
        throw error;
    }

    // Crea un nuovo utente
    const user = await this.create({ email, password });
    return user;
};

// Metodo per il login
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    const fail = () => {
        const error = new Error('Email o Password non corretti!');
        error.statusCode = 401;
        throw error;
    };

    if (!user) {
        fail();
    }

    if (user.password !== password) {
        fail();
    }

    return user;
};

// Registra il modello
const User = model('User', userSchema);

export default User;
