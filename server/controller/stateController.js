const State = require('../model/stateModel')


const createState = async (req, res) => {
    const { name, description, status, createdBy } = req.body;
    const newState = new State({
        name,
        description,
        status,
        createdBy
    });

    try {
        const state = await newState.save();
        res.status(201).json(state);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



const getStates = async (req, res) => {
    try {
        const states = await State.find();
        res.status(200).json(states);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const updateState = async (req, res) => {

    try {
        const state = await State.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        if (!state) {
            return res.status(404).json({ error: 'State not found' });
        }
        res.status(200).json(state);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

};

const deleteState = async (req, res) => {

    try {
        const state = await State.findByIdAndDelete(req.params.id);
        if (!state) {
            return res.status(404).json({ error: 'State not found' });
        }
        res.status(200).json({ message: 'State deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { getStates, createState, updateState, deleteState }