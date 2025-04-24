/*
import express from 'express';
import lavoro from '../models/lavoro.js';

const router = express.Router();

// GET lista di tutte le offerte (visibile a tutti)
router.get('/', async (req, res) => {
    try {
        const jobs = await lavoro.find();
        return res.send(jobs);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Errore del server');
    }
});

// GET informazioni su una singola offerta (visibile a tutti)
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

export default router;

*/
// routes/jobs.js
import express from 'express';
import Lavoro from '../models/lavoro.js';
import { MeterReader, Counter } from '../models/meterReader.js';
const router = express.Router();

// Rotta per ottenere tutte le offerte pubbliche
router.get('/', async (req, res) => {
    try {
        const jobs = await Lavoro.find().populate('author', 'first_name last_name'); // Popola con nome e cognome dell'autore
        return res.send(jobs);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Errore del server');
    }
});

// Rotta per ottenere i dettagli di una singola offerta pubblica
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const job = await Lavoro.findById(id).populate('author', 'first_name last_name');
        if (!job) {
            return res.status(404).send('Offerta non trovata');
        }
        return res.send(job);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Errore del server');
    }
});



export default router;
