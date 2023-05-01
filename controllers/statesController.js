/*const data = {
    states: require('../model/states.json'),
    setStates: function(data) {this.states = data}
} */

const State = require('../model/State');

const getAllStates = async (req, res) =>{
    //res.json(data.states);
    const states = await State.find();
    if(!states) return res.status(204).json({'message': 'No states found.'});
    res.json(states);
}

//Creates a new funfact.
const createNewState = async (req, res)=>{
    if(!req?.body?.stateCode || !req?.body?.funfacts){
        return res.status(400).json({'message': 'stateCode and funfacts are required'})
    }

    try{
        const result = await State.create({
            stateCode: req.body.stateCode,
            funfacts: req.body.funfacts
        });
        res.status(201).json(result);
    } catch(err){
        console.error(err);
    }
}

const updateState = async (req, res) =>{
    if(!req?.body?.id){
        return res.status(400).json({'message': 'ID parameter is required'});
    }

    const state = await State.findOne({_id: req.body.id}).exec();
    if(!state){
        return res.status(204).json({"message": `No state matches ID ${req.body.id}.`});
    }
    if(req.body?.stateCode) state.stateCode = req.body.stateCode;
    if(req.body?.funfacts) state.funfacts = req.body.funfacts;
    const result = await state.save();
    res.json(result);
}

const deleteState = async (req, res) =>{
    if(!req?.body?.id){
        return res.status(400).json({'message': 'State ID required'});
    }

    const state = await State.findOne({_id: req.body.id}).exec();
    if(!state){
        return res.status(204).json({"message": `No state matches ID ${req.body.id}.`});
    }
    const result = await state.deleteOne({_id: req.body.id});
    res.json(result);
}

const getState = async (req, res) =>{
    if(!req?.params?.id){
        return res.status(400).json({'message': 'State ID required'});
    }
    const state = await State.findOne({_id: req.params.id}).exec();

    if(!state){
        return res.status(204).json({"message": `No state matches ID ${req.params.id}.`});
    }
    res.json(state);
}


module.exports = {
    getAllStates,
    createNewState,
    updateState,
    deleteState,
    getState
}
