import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import OffersRouter from './routes/offers.js'; // Gestisce tutte le offerte
import PublicRouter from './routes/publicoffers.js'; // Gestisce le offerte pubbliche
import PrivateRouter from './routes/privateOffers.js'; // Gestisce le offerte private
import User from './models/user.js';  // Importa il modello User
import meterReaderRouter from './routes/meterReaderRouter.js'; // Assicurati che il percorso sia corretto
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

const { MONGODB_URI } = process.env;
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: "*" }));

// Routes
app.use('/offers', OffersRouter); // Gestisce tutte le offerte (CRUD completo)
app.use('/offerpublic', PublicRouter); // Offerte pubbliche
app.use('/offerprivate', PrivateRouter); // Offerte private
app.use('/meterReader', meterReaderRouter); // Rotte per gestire i letturisti

// Rotta registrazione
app.post('/signup', async (req, res) => {  
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Attenzione, non hai inserito correttamente entrambi i dati!');
    }

    try {
        const user = await User.signUp(email, password);  
        return res.send(user);
    } catch (error) {
        console.error(error.message);
        const code = error.statusCode || 500;
        res.status(code).send(error.message);
    }
});

// Rotta login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Attenzione, non hai inserito correttamente entrambi i dati!');
    }

    try {
        const user = await User.login(email, password); 
        return res.status(202).send(user);
    } catch (error) {
        console.error(error.message);
        const code = error.statusCode || 500;
        res.status(code).send('Errore');
    }
});


// Serve i file statici di Vite
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve i file statici
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route per gestire tutte le altre rotte (quelle gestite dal frontend)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// Connect to MongoDB and start the server
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connesso con successo a MongoDB');
    })
    .catch(err => console.error('Errore nella connessione a MongoDB:', err));
export default app;