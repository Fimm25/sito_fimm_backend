import express from 'express';
import lavoro from '../models/lavoro.js';

const router = express.Router();

// POST aggiunta nuova offerta
router.post('/', async (req, res) => {
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

// GET lista di tutte le offerte
router.get('/', async (req, res) => {
    try {
        const jobs = await lavoro.find();
        return res.send(jobs);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Errore del server');
    }
});

// GET informazioni su una singola offerta
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const job = await lavoro.findById(id);
        if (!job) {
            return res.status(404).send('Offerta non trovata');
        }
        return res.send(job);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Errore del server');
    }
});

// PATCH aggiornamento di una singola offerta
router.patch('/:id', async (req, res) => {
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

// DELETE eliminazione di una singola offerta
router.delete('/:id', async (req, res) => {
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

export default router;
