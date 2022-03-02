//const request = require('request');
const axios = require('axios');

var options = {
  'method': 'POST',
  'url': 'https://api.tippmix.hu/tippmix/search',
  'headers': {
    'Accept-Language': 'en-US,en;q=0.9,hu;q=0.8,de;q=0.7',
    'Content-Type': 'application/json',
    'Origin': 'https://www.tippmix.hu',
    'Referer': 'https://www.tippmix.hu/',
    'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site'
  },
  body: {
    'sportId':1,
    'competitionGroupId':0,
    'competitionId':0,
    'type':0,
    'date':'0001-01-01T00:00:00.000Z',
    'minOdds':null,
    'maxOdds':null
  }
};

module.exports = async function getoddsdata(rawInput) {
    console.log(rawInput);
    var sorszamok = rawInput;
    const response = await axios.post('https://api.tippmix.hu/tippmix/search', options);
    var ker_sorszam=0;
    var talalatok=[];
    const events = response.data.data.events;
        //console.log(resp.data.events);
        //var hazai = events[1].markets[0].marketRealNo;
        for (var i=1; i<events.length; i++){
            try {
                ker_sorszam = events[i].markets[0].marketRealNo
                //console.log(ker_sorszam);

                for (var sorszam of sorszamok){
                    if (ker_sorszam == sorszam){
                        console.log(`A ${ker_sorszam} mérkőzést megtaláltam!`);
                        var hazai = Number(events[i].markets[0].outcomes[0].fixedOdds);
                        var dontetlen = Number(events[i].markets[0].outcomes[1].fixedOdds);
                        var vendeg = Number(events[i].markets[0].outcomes[2].fixedOdds);
                        talalatok.push({
                            sorszam: ker_sorszam,
                            hazai: hazai,
                            dontetlen: dontetlen,
                            vendeg: vendeg
                        })
                    }       
                }
            } catch (error) {
               console.log(error.message); 
               console.log(`A ${i}. event nem aktuális!`); 
            }
        }
        //console.log(talalatok);
    return talalatok;
}
