const mondayCron = require('./mondayCron.js');

var mondaySampling = mondayCron();
if (mondaySampling){
    console.log('Sikeres mintavétel!')
} else {
    console.log('Hiba a mintavétel során!')

}
