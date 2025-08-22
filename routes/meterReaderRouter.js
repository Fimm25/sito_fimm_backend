import express from 'express';
import multer from 'multer';
import { MeterReader, Counter } from '../models/meterReader.js';

const router = express.Router();

// Configurazione di multer per gestire il caricamento delle immagini
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limita la dimensione del file a 5MB (puoi modificare questo valore)
});

//Funzione per generare lettera casuale dalla a alla z
const getRandomLetter = () => {
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
return alphabet[Math.floor(Math.random() * alphabet.length)];
}


// Funzione per ottenere la prossima matricola
const getNextSequenceValue = async (sequenceName) => {
    const sequenceDocument = await Counter.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    //Genera due lettere casuali 
    const randomLetters = getRandomLetter() + getRandomLetter();

    
    // Aggiungi 1 qui per restituire il valore incrementato
    return `FIMM${sequenceDocument.sequence_value + 1}${randomLetters.toUpperCase()}`; // Restituisce la matricola in maiuscolo
};

// Endpoint per aggiungere un letturista
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('Nessuna immagine fornita.');
        }

        if (req.file.mimetype !== 'image/jpeg') {
            return res.status(400).send('L\'immagine deve essere in formato JPG.');
        }

        const { name, surname } = req.body;

        // Validazione dei campi name e surname
        if (!name || !surname) {
            return res.status(400).send('Nome e cognome sono obbligatori.');
        }

        const matricola = await getNextSequenceValue('meterReaderId');

        const newMeterReader = new MeterReader({
            image: req.file.buffer,
            contentType: req.file.mimetype,
            name,
            surname,
            matricola
        });

        await newMeterReader.save();
        res.status(201).send(newMeterReader);
    } catch (error) {
        console.error('Errore durante la creazione del letturista:', error);
        res.status(500).send('Errore del server');
    }
});

// Nuovo endpoint per ottenere un letturista in base alla matricola
router.get('/:matricola', async (req, res) => {
    try {
        let { matricola } = req.params;
        matricola = matricola.trim().toUpperCase(); // Rimuovi spazi bianchi e converti in maiuscolo
        const letturista = await MeterReader.findOne({ matricola, isActive: true }); // Confronta la matricola in maiuscolo e controlla isActive

        if (!letturista) {
            return res.status(404).send('Letturista non trovato.'); // Cambiato messaggio per chiarezza
        }

        const base64Image = letturista.image ? letturista.image.toString('base64') : null;

        res.status(200).json({
            ...letturista.toObject(),
            image: base64Image // Assicurati che l'immagine sia in base64
        });
    } catch (error) {
        console.error('Errore durante il recupero del letturista:', error);
        res.status(500).send('Errore del server');
    }
});

// Nuovo endpoint per ottenere tutti i letturisti
router.get('/', async (req, res) => {
    try {
        const letturisti = await MeterReader.find();

        if (letturisti.length === 0) {
            return res.status(404).send('Nessun letturista trovato.');
        }

        const letturistiResponse = letturisti.map(letturista => ({
            matricola: letturista.matricola,
            name: letturista.name,
            surname: letturista.surname,
            publishedAt: letturista.publishedAt,
            isActive: letturista.isActive,
            image: letturista.image ? letturista.image.toString('base64') : null // Gestisci il caso in cui l'immagine non esiste
        }));

        res.status(200).json(letturistiResponse);
    } catch (error) {
        console.error('Errore durante il recupero dei letturisti:', error);
        res.status(500).send('Errore del server');
    }
});

// Endpoint per modificare un letturista
router.put('/:matricola', upload.single('image'), async (req, res) => {
    try {
        const { matricola } = req.params;
        const updateData = {};

        console.log('Matricola ricevuta:', matricola);  // Debug matricola
        console.log('File ricevuto:', req.file);        // Debug file
        console.log('Body ricevuto:', req.body);        // Debug dati dal body

        if (req.file) {
            updateData.image = req.file.buffer;
            updateData.contentType = req.file.mimetype;
        }
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.surname) updateData.surname = req.body.surname;

        const updatedLetturista = await MeterReader.findOneAndUpdate(
            { matricola },
            { $set: updateData },
            { new: true }
        );

        if (!updatedLetturista) {
            console.log('Nessun letturista trovato per la matricola:', matricola);  // Debug se letturista non trovato
            return res.status(404).send('Letturista non trovato.');
        }

        console.log('Letturista aggiornato con successo:', updatedLetturista);  // Debug se aggiornamento avvenuto
        res.status(200).json(updatedLetturista);
    } catch (error) {
        console.error('Errore durante la modifica del letturista:', error);
        res.status(500).send('Errore del server');
    }
});

// Endpoint per eliminare un letturista
router.delete('/:matricola', async (req, res) => {
    try {
        const { matricola } = req.params;

        const deletedLetturista = await MeterReader.findOneAndDelete({ matricola });

        if (!deletedLetturista) {
            return res.status(404).send('Letturista non trovato.');
        }

        res.status(200).send('Letturista eliminato con successo.');
    } catch (error) {
        console.error('Errore durante l\'eliminazione del letturista:', error);
        res.status(500).send('Errore del server');
    }
});

// Endpoint per disabilitare un letturista
router.patch('/disable/:matricola', async (req, res) => {
    try {
        const { matricola } = req.params;

        const updatedLetturista = await MeterReader.findOneAndUpdate(
            { matricola },
            { $set: { isActive: false } }, // Imposta isActive a false
            { new: true }
        );

        if (!updatedLetturista) {
            return res.status(404).send('Letturista non trovato.');
        }

        res.status(200).send('Letturista disabilitato con successo.');
    } catch (error) {
        console.error('Errore durante la disabilitazione del letturista:', error);
        res.status(500).send('Errore del server');
    }
});

// Endpoint per abilitare un letturista
router.patch('/enable/:matricola', async (req, res) => {
    try {
        const { matricola } = req.params;

        const updatedLetturista = await MeterReader.findOneAndUpdate(
            { matricola },
            { $set: { isActive: true } }, // Imposta isActive a true
            { new: true }
        );

        if (!updatedLetturista) {
            return res.status(404).send('Letturista non trovato.');
        }

        res.status(200).send('Letturista abilitato con successo.');
    } catch (error) {
        console.error('Errore durante l\'abilitazione del letturista:', error);
        res.status(500).send('Errore del server');
    }
});

// Esportazione del router
export default router;
