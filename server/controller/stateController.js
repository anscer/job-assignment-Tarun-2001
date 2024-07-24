const asyncWrapper = require('../middlewares/asyncWrapper');
const State = require('../model/stateModel')

const createState = asyncWrapper(async (req, res) => {
    const { name, description, status, createdBy } = req.body;
    const newState = new State({
        name,
        description,
        status,
        createdBy
    });
    if(!name||!description||!status||!createdBy)
        res.status(400).json({Message:"Please provide all details"})
    const state = await newState.save();
    res.status(201).json(state);
});

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
            req.params.stateID,
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
        const state = await State.findByIdAndDelete(req.params.stateID);
        if (!state) {
            return res.status(404).json({ error: 'State not found' });
        }
        res.status(200).json({ message: 'State deleted',state});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const isEmpty = (field, res) => {
    if (!field) {
        res.status(400).json({ Message: `Please provide ${field} field` })
    }
}
const aggregateStates = async (req, res) => {

    const period = req.query.period;
    if (!period || !['hour', 'day', 'month'].includes(period)) {
        return res.status(400).json({ error: 'Invalid or missing time period' });
    }
    let dateFormat;
    switch (period) {
        case 'hour':
            dateFormat = '%Y-%m-%d %H';
            break;
        case 'day':
            dateFormat = '%Y-%m-%d';
            break;
        case 'month':
            dateFormat = '%Y-%m';
            break;
        default: return res.status(400).json({ error: 'Invalid time period' });
    }

    try {
        const results = await State.aggregate([
            {
                $match: {
                    createdAt: { $type: 'date' }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
                    count: { $sum: 1 },
                    statuses: { $push: '$status' }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    count: 1,
                    statuses: 1
                }
            },
            {
                $sort: { date: 1 }
            }
        ]);

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getStates, createState, updateState, deleteState, aggregateStates }