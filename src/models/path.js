const mongoose = require('mongoose')

const pathSchema = new mongoose.Schema({
    storyPath:{
        type:String
    },
    storyLine:[{
        id:{
            type:Number
        },
        senderTextArr:[{
            senderText: String
        }],
        questionArr:[{
            questText: String,
            nextDialogId: Number
        }]
    }]
})

const Path = new mongoose.model('Path', pathSchema)
module.exports = Path;