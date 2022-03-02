const brain = require("brain.js");
//const json = require("./data_new.json");
//const fs = require("fs");
const trainedNet = require('./trained-net_1646019188710_goal.js');
const getoddsdata = require('./getoddsdata.js')
const sorszamok = [12909, 44685, 24765, 19650, 26724, 60591, 67314, 67606, 67654, 67751, 67799];

resp = (async function(){
    data = await getoddsdata(sorszamok);
    console.log(data);
    for (var id in data){
        trainData = {
        h: data[id].hazai,
        d: data[id].dontetlen,
        a: data[id].vendeg
        };
        console.log(trainedNet(trainData));

    }
})();
