import express from 'express';
import lavoro from '../models/lavoro.js';


const router = express.Router();

/*
/*
// POST aggiunta nuova offerta (solo utenti autenticati)
router.post('/', authMiddleware, async (req, res) => {
    if (!req.body) {
        return res.status(400).send(`Non mi hai inviato l'offerta`);
    }

    try {
        const job = await lavoro.create(req.body);
        return res.send(job);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

// DELETE eliminazione di una singola offerta (solo utenti autenticati)
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedJob = await lavoro.findByIdAndDelete(id);
        if (!deletedJob) {
            return res.status(404).send('Offerta non trovata');
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PATCH aggiornamento di una singola offerta (solo utenti autenticati)
router.patch('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedJob = await lavoro.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedJob) {
            return res.status(404).send('Offerta non trovata');
        }
        return res.send(updatedJob);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

export default router;


*/



// Rotta protetta
router.get('/some-protected-route', (req, res) => {
  res.send('Questa è una rotta protetta!');
});



// Rotta per creare una nuova offerta di lavoro
router.post('/' , async (req, res) => {
    const { title, description, ideal_profile, site, contract } = req.body;
    const authorId = req.user.authorId; // L'ID dell'autore autenticato

    if (!title || !description || !ideal_profile || !site || !contract) {
        return res.status(400).send('Tutti i campi sono obbligatori');
    }

    try {
        const job = new lavoro({ title, description, ideal_profile, site, contract, author: authorId }); // Usa 'lavoro' con la 'l' minuscola
        await job.save();
        return res.send(job);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

// Rotta per eliminare un'offerta di lavoro
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const authorId = req.user.authorId; // L'ID dell'autore autenticato

    try {
        const job = await lavoro.findOneAndDelete({ _id: id, author: authorId }); // Cancella solo se l'autore corrisponde
        if (!job) {
            return res.status(404).send('Offerta non trovata o non autorizzato');
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rotta per aggiornare un'offerta di lavoro
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const authorId = req.user.authorId; // L'ID dell'autore autenticato

    try {
        const updatedJob = await lavoro.findOneAndUpdate(
            { _id: id, author: authorId }, // Aggiorna solo se l'autore corrisponde
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedJob) {
            return res.status(404).send('Offerta non trovata o non autorizzato');
        }
        return res.send(updatedJob);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

export default router;
