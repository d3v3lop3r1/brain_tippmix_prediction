const brain = require("brain.js");
const datas = require("./data_new.json");
const fs = require("fs");


//const net = new brain.NeuralNetwork();
const net = new brain.recurrent.LSTMTimeStep();

var container = [];
for (var id in datas) {
    container[id]={input:{h:datas[id].B365H, d:datas[id].B365D, a:datas[id].B365A}, output:{winner:datas[id].winner}};
};

console.log("Tanítás folyamatban ...");
console.log("Objektum mérete : ", container.length);

//var dt = new Date;
var time = Math.floor(Date.now() / 1000)
console.log(time);
var strtime = String(time);

net.train(container, {
    iterations:2000,
    log: (stats)=>console.log(stats)
});
var newtime = Math.floor(Date.now() / 1000);
console.log(newtime);
var worktime = (newtime - time)

console.log(`A számoláshoz ${worktime} másodperc kellett.`);

// save json data
const json = net.toJSON();
// write to file system
fs.writeFileSync(`trained-net_${strtime}_winner.json`, JSON.stringify(json), 'utf8');

fs.writeFileSync(`trained-net_${strtime}_winner.js`, `module.exports = ${ net.toFunction().toString() };`);



console.log('Tréning kész!');