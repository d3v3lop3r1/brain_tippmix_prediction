const brain = require("brain.js");
//const json = require("./data_new.json");
//const fs = require("fs");
const trainedNet = require('./trained-net_1646334736_goal_LSTMTimeStep.js');
const getoddsdata = require('./getoddsdata.js')
const sorszamok = [7945,
    19173,
    6083,
    13064,
    70371,
    17826,
    68625];

resp = (async function(){
    data = await getoddsdata(sorszamok);
    console.log(data);
    for (var id in data){
        trainData = {
        h: data[id].hazai,
        d: data[id].dontetlen,
        a: data[id].vendeg
        };
        console.log(data[id].sorszam ,trainedNet(trainData));
    }
})();
