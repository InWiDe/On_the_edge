const express = require('express')
const router = new express.Router()
const Story = require('../../models/story.js')

 /**
 * Endpoint, that retrieves all stories from db
 * @returns 200 response with all stories from db
 * @error returns 400 response
 */
router.get('/stories',async(req,res) => {
    try{
        const stories = await Story.find();
        res.status(200).send(stories)
    }catch{
        res.status(400).send('Problem occured while getting stories')
    }
})

 /**
 * Endpoint, that retrieves specific story from db 
 * 
 * @param {Integer} storyId id of story
 * @returns 200 response with specific story from db
 * @error returns 400 response
 */
router.get('/stories/:storyId',async(req,res) => {
    try{
        const story = await Story.findOne({_id:req.params.id});
        res.status(200).send(story);
    }catch{
        res.status(400).send('Problem occured while getting story')
    }
})

 /**
 * Endpoint, that adds new story to the db
 * 
 * @returns 200 response if story has been added into the db
 * @error returns 400 response
 */
router.post('/stories',async(req,res) => {
    const newStory = new Story({
        ...req.body,
    })
    try{
        if(req.body.storyLine.length !== 0)
        {
            await newStory.save()
            res.status(200).send(newStory)
        }
    }catch(e){
        res.status(400).send(e)
    }
})


 /**
 * Endpoint, that updates story regarding to the JSON. Needs to have json check implemented in the future
 * 
 * @returns 200 response if story was updated. Returns updatedStory
 * @error returns 500 response
 */
router.patch('/stories/:storyId',async(req,res) => {
try{
        const updatedStory = await Story.findByIdAndUpdate(req.params.storyId, req.body);
        updatedStory.save();
        res.send(updatedStory).status(200)
    }
     catch(e)
    {
        return res.status(500).send()
    }
})

 /**
 * Endpoint, Deletes story from the db
 * 
 * @returns 200 response if story was deleted
 * @error returns 400 response
 */
router.delete('/stories/:storyId',async(req,res) => {
    try {
        await Story.findOneAndDelete({_id:req.params.storyId})
        res.status(200).send('Story was deleted')
    }
     catch(e)
    {
        res.status(400).send('Deletion was not successful')
    }
})

module.exports = router