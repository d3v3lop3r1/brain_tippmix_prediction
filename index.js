const brain = require("brain.js");
const datas = require("./datas.json");
const network = new brain.NeuralNetwork();

const dataObj=[]
const dataLength = datas.datas.length;
var resultH,resultV,oddsH,oddsD,oddsA, winner, selected;
const timeStart = new Date();

for(id in datas.datas){
    selected = 0;
    resultH = Number(datas.datas[id].FTHG);
    resultV = Number(datas.datas[id].FTAG);
    
    if (resultH > resultV){
        winner = 0;
    } else if (resultH < resultV){
        winner = 1;
    } else if (resultH === resultV){
        winner = 2;
    }
    oddsH = Number(datas.datas[id].B365H);
    oddsD = Number(datas.datas[id].B365D);
    oddsA = Number(datas.datas[id].B365A);
    if ( oddsH === NaN || oddsD === NaN || oddsA === NaN) continue;

    if ( oddsH > 2.4 && oddsH < 2.65 && oddsH+0.25 <= oddsA ) {
        selected = 1;
    }
        
    if ( oddsA > 2.35 && oddsA < 2.65 && oddsA+0.25 <= oddsH ) {
        selected = 1;
    }
    // if (!selected) continue;


    if ( oddsH > 1.8 && oddsH < 2 && oddsA > 3.8 && oddsA < 5 ) {
        selected = 1;
    }
        
    if ( oddsA > 1.85 && oddsA < 2 && oddsH > 3.8 && oddsH < 5 ) {
        selected = 1;
    }
    if (!selected) continue;

    dataObj.push({input:[oddsH, oddsD, oddsA], output:[winner]});
}
console.log("Tanítás folyamatban ...")
console.log("Objektum mérete : ", dataObj.length)

network.train(dataObj);

const pred = network.run([2.33,2.62,2.84]);
const timeEnd = new Date();
const timeDiff = timeEnd - timeStart;
console.log("Time:", timeDiff);
console.log("Prediction:",pred.toString());