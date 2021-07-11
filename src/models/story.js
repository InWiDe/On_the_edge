const mongoose = require('mongoose')

const storySchema = new mongoose.Schema([{
    storyPath:{
        type:String
    },
    storyLine:[{
        id:{
            type:Number
        },
        senderTextArr:[],
        questionArr:[{
            questText:{
                type:String
            },
            nextDialogId:Number
        }]
    }]
}])

const Story = new mongoose.model('Story', storySchema)
module.exports = Story;