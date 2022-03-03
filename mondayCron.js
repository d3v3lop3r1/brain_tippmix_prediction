const Monday = require('./models/Monday');
//const config = require('config');
const request = require('request');

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
  body: JSON.stringify({
    "sportId":1,
    "competitionGroupId":0,
    "competitionId":0,
    "type":0,
    "date":"0001-01-01T00:00:00.000Z",
    "minOdds":null,
    "maxOdds":null
  })
  
};


function getNumberOfWeek() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function mondayCron () {
    var eventWeek = getNumberOfWeek();
    console.log('Cron start....');
    (async () => {
        try {
            let mondayNow = await Monday.findOne({eventWeek});
            
            request(options, function (error, response) {
                if (error) throw new Error(error);
                if (!mondayNow){
                    console.log(`Első mintavétel a ${eventWeek}. héten`);
                }
                var newEvents = [];
                var events = response.data.data.events;
                var savedEvents = mondayNow.events || null;
                var selected;
                for ( let id  in events){
                    selected, hazai, dontetlen, vendeg = null;
                    if (typeof events[id].markets[0] !== 'undefined'){
                        if (typeof events[id].markets[0].outcomes[0] !== 'undefined' && typeof events[id].markets[0].outcomes[1] !== 'undefined' && typeof events[id].markets[0].outcomes[2] !== 'undefined'){
                            hazai = Number(savedEvents[id].markets[0].outcomes[0].fixedOdds) || Number(events[id].markets[0].outcomes[0].fixedOdds);
                            dontetlen = Number(savedEvents[id].markets[0].outcomes[1].fixedOdds) || Number(events[id].markets[0].outcomes[1].fixedOdds);
                            vendeg = Number(savedEvents[id].markets[0].outcomes[2].fixedOdds) || Number(events[id].markets[0].outcomes[2].fixedOdds);
                        }
                        if ( hazai > 2.4 && hazai < 2.6 && hazai+0.25 <= vendeg ) {
                            selected = 1;
                        }
                            
                        if ( vendeg > 2.35 && vendeg < 2.6 && vendeg+0.25 <= hazai ) {
                            selected = 1;
                        }
                        
                        if (selected){
                            newEvents[id] = {
                                eventId: events[id].eventId,
                                eventName: events[id].eventName,
                                eventDate: events[id].eventDate,
                                competitionName: events[id].competitionName,
                                bettingStatus: events[id].bettingStatus,
                                eventParticipants: [{
                                    participantName: events[id].eventParticipants[0].participantName,
                                    participantId: events[id].eventParticipants[0].participantId
                                }, {
                                    participantName: events[id].eventParticipants[1].participantName,
                                    participantId: events[id].eventParticipants[1].participantId
                                }],
                                markets: [{
                                    marketId: events[id].markets[0].marketId,
                                    outcomes: [{
                                            fixedOdds: hazai || null,
                                        }, {
                                            fixedOdds: dontetlen || null,
                                        }, {
                                            fixedOdds: vendeg || null,
                                        }],
                                    marketRealNo: events[id].markets[0].marketRealNo
                                }]
                                
                            } // newEvents object
    
                        } // if selected
        
                    } // if market[0] isset
        
                } // for loop
    
                var monday = new Monday();
    
                monday = {
                    eventWeek: Number,
                    events: newEvents,
                };
    
                monday.save();
            
            }); // request from tippmix

        
        } catch (error) {
            console.log('Hiba');
        }

    })

}

module.exports = mondayCron;