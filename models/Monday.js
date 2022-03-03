const mongoose = require('mongoose');

const MondaySchema = mongoose.Schema({
    eventWeek: Number,
    events:[{
        eventId: Number,
        eventName: String,
        eventDate: Date,
        competitionName: String,
        bettingStatus: Number,
        eventParticipants: [{
            participantName: String,
            participantId: Number
        }, {
            participantName: String,
            participantId: Number
        }],
        markets: [{
            marketId: Number,
            outcomes: [{
                    fixedOdds: Number,
                }, {
                    fixedOdds: Number,
                }, {
                    fixedOdds: Number,
                }],
                marketRealNo: String
        }],
        date:{
            type: Date,
            default: Date.now
        },

    }]
})

module.exports = Monday = mongoose.model('monday', MondaySchema);