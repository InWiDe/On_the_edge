const express = require('express')
const router = new express.Router()
const Path = require('../../models/path.js')

 /**
 * Endpoint, that retrieves all paths from db
 * @returns 200 response with all paths from db
 * @error returns 400 response
 */
router.get('/paths',async(req,res) => {
    try{
        const paths = await Path.find();
        res.status(200).send(paths)
    }catch{
        res.status(400).send('Problem occured while getting paths')
    }
})

 /**
 * Endpoint, that retrieves specific path from db 
 * 
 * @param {Integer} pathid id of path
 * @returns 200 response with specific path from db
 * @error returns 400 response
 */
router.get('/paths/:pathId',async(req,res) => {
    try{
        const path = await Path.findOne({_id:req.params.id});
        res.status(200).send(path);
    }catch{
        res.status(400).send('Problem occured while getting story')
    }
})

 /**
 * Endpoint, that adds new path to the db
 * 
 * @returns 200 response if path has been added into the db
 * @error returns 400 response
 */
router.post('/paths',async(req,res) => {
    const newPath = new Path({
        ...req.body,
    })
    try{
        if(req.body.storyLine.length !== 0)
        {
            await newPath.save()
            res.status(200).send(newPath)
        }
    }catch(e){
        res.status(400).send(e)
    }
})


 /**
 * Endpoint, that updates path regarding to the JSON. Needs to have json check implemented in the future
 * 
 * @returns 200 response if path was updated. Returns updated Path
 * @error returns 500 response
 */
router.patch('/path/:pathId',async(req,res) => {
try{
        const updatedPath = await Path.findByIdAndUpdate(req.params.pathId, req.body);
        updatedPath.save();
        res.send(updatedPath).status(200)
    }
     catch(e)
    {
        return res.status(500).send()
    }
})

 /**
 * Endpoint, Deletes path from the db
 * 
 * @returns 200 response if path was deleted
 * @error returns 400 response
 */
router.delete('/paths/:pathId',async(req,res) => {
    try {
        await Path.findOneAndDelete({_id:req.params.pathId})
        res.status(200).send('Path was deleted')
    }
     catch(e)
    {
        res.status(400).send('Deletion was not successful')
    }
})

module.exports = router