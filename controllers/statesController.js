const data = require('../model/statesData.json');
const State = require('../model/State');
const path = require('path');
const { mongo } = require('mongoose');

//All states data returned.
const getAllStates = async (req, res) =>{
    //res.json(data.states);
    //console.log(data);
    const states = await State.find(); //Retrieves all stateCodes and funfacts from MongoDB.
    if(!states) return res.status(404).json({'message': 'No states found.'});
    
    //Loop through statesData.json
    //console.log(states.find(obj));
    
    //let state = states.find(state => state.stateCode === "OK");
    //console.log(state);
    
    const resultStates = [];
    //console.log(data);
    //Loops through each state in statesData.
    if(req.query.contig != 'true'){ //If there is no contig query parameter OR the parameter is set to false.
        let match = false;
        
        for(let i = 0; i < data.length; i++){
            if(req.query.contig === 'false'){ //If the contig query parameter is set to false, then only HI and AK are returned.
                if(data[i].code === "AK" || data[i].code === "HI"){
                    //Loops through each of the data in MongoDB
            for(let j = 0; j < states.length; j++){
                if(data[i].code === states[j].stateCode){ //If the code from statesData matches stateCode from MongoDB.
                    //console.log(states[j].stateCode);
                    resultStates.push({...data[i], funfacts: states[j].funfacts});
                    match = true;
                } 
            }
            if(!match){ //Makes sure that if the state with the funfact was added, it won't be added again.
                resultStates.push({...data[i]});
            }   
            match = false;
            }
            } else {
                //Loops through each of the data in MongoDB
                for(let j = 0; j < states.length; j++){
                    if(data[i].code === states[j].stateCode){ //If the code from statesData matches stateCode from MongoDB.
                        //console.log(states[j].stateCode);
                        resultStates.push({...data[i], funfacts: states[j].funfacts});
                        match = true;
                    } 
                }
                if(!match){ //Makes sure that if the state with the funfact was added, it won't be added again.
                    resultStates.push({...data[i]});
                }   
                //console.log(data[i].slug);
                match = false;
            }
        }
    } else { //If there is a contig query parameter set to true.
        let match = false;
        //Loops through each state in statesData.
        for(let i = 0; i < data.length; i++){
            if(data[i].code !== "AK" && data[i].code !== "HI"){
                //Loops through each of the data in MongoDB
                for(let j = 0; j < states.length; j++){
                    if(data[i].code === states[j].stateCode){ //If the code from statesData matches stateCode from MongoDB.
                        //console.log(states[j].stateCode);
                        resultStates.push({...data[i], funfacts: states[j].funfacts});
                        match = true;
                    } 
                }
                if(!match){ //Makes sure that if the state with the funfact was added, it won't be added again.
                    resultStates.push({...data[i]});
                }   
                match = false;
            } 
        }
    }
    //console.log(resultStates);
    res.json(resultStates);
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
    if(!req?.params?.state){
        return res.status(400).json({'message': 'State required'});
    } 

    const state = req.params.state.toLowerCase();

    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy"){
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } else { //If the statecode is valid:
        const states = await State.find(); //Retrieves all stateCodes and funfacts from MongoDB.
        if(!states) return res.status(204).json({'message': 'No states found.'});

        for(let i = 0; i < data.length; i++){ //Loop through all the statesData.json
            //console.log(data[i].code);
            if(data[i].code.toLowerCase() == state){ //If the state code matches the state parameter
                //Loops through each of the data in MongoDB
                for(let j = 0; j < states.length; j++){
                    if(data[i].code === states[j].stateCode){ //If the code from statesData matches stateCode from MongoDB.
                        //console.log(states[j].stateCode);
                        //resultState.push({...data[i], funfacts: states[j].funfacts});
                        const resultState = { //Sets a new object to the state's statesData data, plus the funfacts from MongoDB.
                            ...data[i],
                            funfacts: states[j].funfacts
                        }
                        return res.json(resultState);
                    } 
                }
                const resultState = {
                    ...data[i]
                }
                return res.json(resultState);
            } 
        }
    }
}

const getFunfact = async (req, res) =>{
    if(!req?.params?.state){
        return res.status(400).json({'message': 'State required'});
    } 

    let state = req.params.state.toLowerCase();

    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy"){
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } else { //If the statecode is valid:
        state = state.toUpperCase();
        const stateInfo = await State.findOne({stateCode: `${state}`}); //Retrieves the stateCode and funfacts from MongoDB.

        for(let i = 0; i < data.length; i++){ //Loop through all the statesData.json
            if(data[i].code == state){ //If the state code matches the state parameter
                if(stateInfo == null){ //If the state is NOT located in MongoDB
                    return res.status(404).json({'message': `No Fun Facts found for ${data[i].state}`});
                } else if(data[i].code === stateInfo.stateCode){ //If the code from statesData matches stateCode from MongoDB.
                    const randomIndex = Math.floor(Math.random() * stateInfo.funfacts.length);    
                    const randomFact = stateInfo.funfacts[randomIndex];
                        const resultState = { //Sets a new object to the state's statesData data, plus the funfacts from MongoDB.
                            funfact: randomFact
                        }
                        return res.json(resultState);
                }
            } 
        } 
    }
}

const getCapital = async (req, res) =>{
    if(!req?.params?.state){
        return res.status(400).json({'message': 'State required'});
    } 

    let state = req.params.state.toLowerCase();

    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy"){
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } else { //If the statecode is valid:
        state = state.toUpperCase();
        
        for(let i = 0; i < data.length; i++){ //Loop through all the statesData.json
            if(data[i].code == state){ //If the state code matches the state parameter
                const resultState = { //Sets a new object to the state's statesData data.
                    state: data[i].state,
                    capital: data[i].capital_city
                }
                return res.json(resultState);
            } 
        } 
    }
}

const getNickname = async (req, res) =>{
    if(!req?.params?.state){
        return res.status(400).json({'message': 'State required'});
    } 

    let state = req.params.state.toLowerCase();

    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy"){
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } else { //If the statecode is valid:
        state = state.toUpperCase();

        for(let i = 0; i < data.length; i++){ //Loop through all the statesData.json
            if(data[i].code == state){ //If the state code matches the state parameter
                const resultState = { //Sets a new object to the state's statesData data.
                    state: data[i].state,
                    nickname: data[i].nickname
                }
                return res.json(resultState);
            } 
        } 
    }
}

const getPopulation = async (req, res) =>{
    if(!req?.params?.state){
        return res.status(400).json({'message': 'State required'});
    } 

    let state = req.params.state.toLowerCase();

    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy"){
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } else { //If the statecode is valid:
        state = state.toUpperCase();

        for(let i = 0; i < data.length; i++){ //Loop through all the statesData.json
            if(data[i].code == state){ //If the state code matches the state parameter
                const resultState = { //Sets a new object to the state's statesData data.
                    state: data[i].state,
                    population: data[i].population.toLocaleString("en-US")
                }
                return res.json(resultState);
            } 
        } 
    }
}

const getAdmission = async (req, res) =>{
    if(!req?.params?.state){
        return res.status(400).json({'message': 'State required'});
    } 

    let state = req.params.state.toLowerCase();

    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy"){
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } else { //If the statecode is valid:
        state = state.toUpperCase();

        for(let i = 0; i < data.length; i++){ //Loop through all the statesData.json
            if(data[i].code == state){ //If the state code matches the state parameter
                const resultState = { //Sets a new object to the state's statesData data.
                    state: data[i].state,
                    population: data[i].admission_date.toLocaleString("en-US")
                }
                return res.json(resultState);
            } 
        } 
    }
}

module.exports = {
    getAllStates,
    createNewState,
    updateState,
    deleteState,
    getState,
    getFunfact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission
}
