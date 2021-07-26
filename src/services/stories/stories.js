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
module.exports = router