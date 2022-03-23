const eventRouter = require('express').Router();
const User = require('../models/user')
const Task = require('../models/task')
const Event = require('../models/event')

const { userSchema, eventSchema, taskSchema } = require('../schemas.js');
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, isAdmin, isInvited} = require('../middleware'); 
const task = require('../models/task');



// View the events user created/got invited to 
/**
 * @swagger
 * /events:
 *  get:
 *      description: View the events user created/got invited to 
 *      tags:
 *        - Events 
 *        - Get
 *      responses:
 *          '200':
 *              description: {{eventList}}
 *          '500':
 *              description: unexepected error
 */
eventRouter.get('/events', isLoggedIn, catchAsync(async(req, res) => {
	const id = req.user._id
	const events = await Event.find({$or: [{guests:id}, {admin:id}]})
	res.json({ events })
}))


// View the guests of a specific event
/**
 * @swagger
 * /events/{eventId}/guests:
 *  get:
 *      description: View the guests of a specific event
 *      tags:
 *        - Events 
 *        - Get
 *      parameters:
 *          -   in: path
 *              name: eventId
 *              schema:
 *                  type: string
 *                  example: 623018e31d596470d49769e0
 *              required: true
 *              description: "The ID of the event, from which we are pulling guest information from"
 *              
 *      responses:
 *          '200':
 *              description: list of guests.
 *          '500':
 *              description: unexepected error
 *          '403':
 *              description: party was not found (you were not invited)"
 *              
 */
eventRouter.get('/events/:eventId/guests', isLoggedIn, isInvited, catchAsync(async(req, res) => {
	const { eventId } = req.params;
	const currEvent = await Event.findById(eventId).populate('guests')
    console.log(currEvent)
	res.json({guests: currEvent.guests});
}))

// View the details of a specific event
/**
 * @swagger
 * /events/{eventId}:
 *  get:
 *      description: View the details of a specific event
 *      tags:
 *        - Events 
 *        - Get
 *      parameters:
 *          -   in: path
 *              name: eventId
 *              schema:
 *                  type: string
 *                  example: 623018e31d596470d49769e0
 *              required: true
 *              description: "The ID of the event, from which we are the event info from"
 *              
 *      responses:
 *          '200':
 *              description: event information.
 *          '500':
 *              description: unexepected error
 *          '403':
 *              description: party was not found (you were not invited)"
 *              
 */
eventRouter.get('/events/:eventId', isLoggedIn, isInvited, catchAsync(async(req, res) => {
	const { eventId } = req.params;
	const currEvent = await Event.findById(eventId).populate('guests').populate('tasks').populate('admin')
	res.json({ currEvent });
}))

// View the tasks of a specific event
/**
 * @swagger
 * /events/{eventId}/tasks:
 *  get:
 *      description: View the guests of a specific event
 *      tags:
 *        - Events 
 *        - Get
 *      parameters:
 *          -   in: path
 *              name: eventId
 *              schema:
 *                  type: string
 *                  example: 623018e31d596470d49769e0
 *              required: true
 *              description: "The ID of the event, from which we are pulling task information from"
 *              
 *      responses:
 *          '200':
 *              description: list of tasks.
 *          '500':
 *              description: unexepected error
 *          '403':
 *              description: party was not found (you were not invited)"
 *              
 */
eventRouter.get('/events/:eventId/tasks', isLoggedIn, isInvited, catchAsync(async(req, res) => {
	const { eventId } = req.params;
	const currEvent = await Event.findById(eventId)
	.populate({ 
		path: 'tasks',
		populate: {
		  path: 'assignees',
		  model: 'User'
		} 
	 })
	res.json({tasks: currEvent.tasks});
}))

// View the details of a particular task
/**
 * @swagger
 * /events/{eventId}/tasks/{taskId}:
 *  get:
 *      description: View the details of a particular task
 *      tags:
 *        - Events 
 *        - Get
 *      parameters:
 *          -   in: path
 *              name: eventId
 *              schema:
 *                  type: string
 *                  example: 623018e31d596470d49769e0
 *              required: true
 *              description: "The ID of the event, from which we are the event info from"
 *          -   in: path
 *              name: taskId
 *              schema:
 *                  type: string
 *                  example: 623018e31d596470d49769e0
 *              required: true
 *              description: "The ID of the task, from which we are the task info from"
 * 
 *              
 *      responses:
 *          '200':
 *              description: task information.
 *          '500':
 *              description: unexepected error
 *          '403':
 *              description: party was not found (you were not invited)"
 *          '404':
 *              description: task does not exist
 *              
 */

/**
 * 
 * @todo we added IsInvited middleware, test this endpoint
 * 
 * 
 */
eventRouter.get('/events/:eventId/tasks/:taskId', isLoggedIn, isInvited, catchAsync(async(req, res) => {
	const { taskId } = req.params;
	const currTask = await Task.findById(taskId).populate('assignees')
    if(!currTask) return res.status(411).json({error:'Task does not exist'})

	res.json({ currTask });
}))

/*
*	Nick's Routes
*/



/**
 * 
 * @swagger
 * /events:
 *  post:
 *      description: Create a new event.
 *      tags:
 *        - Events
 *        - Post
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: The name of the event
 *                              example: movienight
 *                          description:
 *                              type: string
 *                              description: NOT REQUIRED, the  description of the event
 *                              example: movie night with the boys
 *                          tags:
 *                              type: array
 *                              items:
 *                                  type: string
 *                                  example: movie
 *                              description: tags for the event
 *                          address:
 *                              type: string
 *                              description: the event address
 *                              example: 1333 something lane                       
 *                          date:
 *                              type: string
 *                              description: the date, TODO, Make this datatime instead of a string
 *                              example: Monday 
 * 
 *         
 *      responses:
 *          '200':
 *              description: new event
 *          '500':
 *              description: There is an unexepected issue creating this event
 *          '403':
 *              description: not authorized
 *              
 */
eventRouter.post('/events', isLoggedIn, catchAsync(async(req, res)=>{

    const {name, description="", tags=[], address, date} = req.body;
    const admin = await User.findById(req.user._id)
    const newEvent = new Event({name : name, description : description, tags : tags, address : address, date : date, admin : admin});
    await newEvent.save();
    
    res.status(200).json({newEvent});
}))


//Checks if the event exists and deletes it if so
/**
 * @swagger
 * /events/{eventId}:
 *  delete:
 *      description: Checks if the event exists and deletes it if so
 *      tags:
 *        - Events
 *        - Delete
 *      parameters:
 *          -   in: path
 *              name: eventId
 *              schema:
 *                  type: string
 *                  example: 17de19ce2d431d191350cb31912dbf2796f84bb1
 *              required: true
 *              description: "the ID of the event which you are trying to delete"
 *          
 *      responses:
 *          '200':
 *              description: successfully deleted event
 *          '500':
 *              description: unexepected error
 *          '403':
 *              description: you are not authenticated to do that
 *              
 */
eventRouter.delete('/events/:eventId', isLoggedIn, isInvited, catchAsync(async(req, res)=>{
    const {eventId} = req.params;
    const userId = req.user._id
    const event = await Event.findById(eventId)
    const user = await User.findById(userId)
    const admin = event.admin

    try
    {
        if(admin._id.toString() == userId){
            await Event.findByIdAndDelete(eventId);
        }

        else{
            await Event.findByIdAndUpdate(event._id, {$pull: {guests: user._id}}, {new: true, runValidators: true})
            await User.findByIdAndUpdate(user._id, {$pull: {events: event._id}}, {new: true, runValidators: true})
        }
    }
    catch(err)
    {
        return res.json({error:'Event does not exist'})
    }
    
    res.status(200).json({status:'successfully deleted event'});
}))




//Checks if the guest is already in the event and adds them if not

/**
 * @swagger
 * /events/{eventId}/guests/{guestId}:
 *  post:
 *      description: Checks if the guest is already in the event and adds them if not
 *      tags:
 *        - Events
 *        - Post
 *      parameters:
 *          -   in: path
 *              name: eventId
 *              schema:
 *                  type: string
 *                  example: 17de19ce2d431d191350cb31912dbf2796f84bb1
 *              required: true
 *              description: "the ID of the event which you are adding a guest to."
 *          -   in: path
 *              name: guestId
 *              schema:
 *                  type: string
 *                  example: 17de19ce2d431d191350cb31912dbf2796f84bb1
 *              required: true
 *              description: "the ID of the guest which you are adding to the event."
 *      responses:
 *          '200':
 *              description: successfully added guest
 *          '500':
 *              description: unexepected error
 *          '403':
 *              description: you are not authenticated to do that
 *          '410':
 *              description: guest already found in list
 *          '411':
 *              description: event does not exist
 *              
 */
eventRouter.post('/events/:eventId/guests/:guestId', isLoggedIn, isAdmin, catchAsync(async(req, res)=>{

    const {eventId, guestId} = req.params;
    const event = await Event.findById(eventId);
    const guest = await User.findById(guestId)

    if(!event){return res.status(411).json({error:'Event does not exist'})}
    if(event.guests.indexOf(guestId) != -1){ return res.status(410).json({error:'Guest already found in guest list'})}

    await Event.findByIdAndUpdate(event._id, { $addToSet: { guests: guest } }, {new: true, runValidators: true})
    const newGuest = await User.findByIdAndUpdate(guest._id, { $addToSet: { events: event } }, {new: true, runValidators: true})

    res.status(200).json({newGuest});
}))

//Delete a guest from an event
//Checks if the guest is in the list and deletes it based on index if so

/**
 * @swagger
 * /events/{eventId}/guests/{guestId}:
 *  delete:
 *      description: Deletes a guest if the guest is in the event
 *      tags:
 *        - Events
 *        - Delete
 *      parameters:
 *          -   in: path
 *              name: eventId
 *              schema:
 *                  type: string
 *                  example: 17de19ce2d431d191350cb31912dbf2796f84bb1
 *              required: true
 *              description: "the ID of the event which you are deleting the guest from."
 *          -   in: path
 *              name: guestId
 *              schema:
 *                  type: string
 *                  example: 17de19ce2d431d191350cb31912dbf2796f84bb1
 *              required: true
 *              description: "the ID of the guest which you are deleting from the event."
 *      responses:
 *          '200':
 *              description: successfully deleted the guest
 *          '500':
 *              description: unexepected error
 *          '403':
 *              description: you are not authenticated to do that
 *          '404':
 *              description: Event does not exist
 *          '410':
 *              description: guest not in list
 *          '411':
 *              description: event does not exist
 *              
 */
eventRouter.delete('/events/:eventId/guests/:guestId', isLoggedIn, isAdmin, catchAsync(async(req, res)=>{

    const {eventId, guestId} = req.params;
    const event = await Event.findById(eventId);

    if(!event){return res.status(404).json({error:'Event does not exist'})}
    const guestIndex = event.guests.indexOf(guestId);
    if(guestIndex == -1){ return res.status(500).json({error:'Guest not found in guests list'})}

    if(event.admin._id.toString() == guestId){
        return res.status(500).json({error:"Cannot delete admin from the event"})
    }

    const updateEvent =  await Event.findByIdAndUpdate(event._id, {$pull: {guests: guestId}}, {new: true, runValidators: true})
    await User.findByIdAndUpdate(req.user._id, {$pull: {events: event._id}}, {new: true, runValidators: true})
    await Task.updateMany({}, {$pull: {assignees: req.user._id}}, {new: true, runValidators: true})

    const remainingGuests = updateEvent.guests
    res.status(200).json({remainingGuests});
}))


//Add a task to an event
//Checks if the task is already in the event and adds it if not

/**
 * @TODO Issue, if the assignee doesnt correspond with a valid user the error is not handled
 * 
 * @swagger
 * /events/{eventId}/tasks:
 *  post:
 *      description: Adds a task in the event if there isn't a task.
 *      tags:
 *        - Events
 *        - Post
 *      parameters:
 *          -   in: path
 *              name: eventId
 *              schema:
 *                  type: string
 *                  example: 17de19ce2d431d191350cb31912dbf2796f84bb1
 *              required: true
 *              description: "the ID of the event which you are adding a guest to."
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: name of the task
 *                              example: Bring Soda
 *                          description:
 *                              type: string
 *                              description: description of the task
 *                              example: Bring Pepsi, Coke, and Fanta
 *                          assignees:
 *                              type: array
 *                              items:
 *                                  type: string
 *                                  example: asdas7d6a879yhi
 *                              description: guests to assign 
 *                      required:
 *                        - name
 *                      
 * 
 *      responses:
 *          '200':
 *              description: successfully added guest
 *          '500':
 *              description: unexepected error
 *          '403':
 *              description: you are not authenticated to do that
 *          '404':
 *              description: Event does not exist
 *          '405':
 *              description: Name cannot be blank
 *              
 */
eventRouter.post('/events/:eventId/tasks', isLoggedIn, isAdmin, catchAsync(async(req, res)=>{

    const {eventId} = req.params;
    const {name, description="", assignees = []} = req.body
    
    if(name == '') return res.status(405).json({error:"name cannot be blank"})

    const task = new Task({name:name, description:description, assignees:assignees, done:false, event:eventId})
    
    await task.save()
    const event = await Event.findById(eventId);
    
    if(!event) return res.status(404).json({error:"Event does not exist"})

    await Event.findByIdAndUpdate(event._id, { $addToSet: { tasks: task } }, {new: true, runValidators: true})

    res.status(200).json({task});
}))


//Delete a task from an event
//Checks if the task is in the list and deletes it based on index if so
/**
 * @swagger
 * /events/{eventId}/tasks/{taskId}:
 *  delete:
 *      description: Deletes a task if the task is in the event
 *      tags:
 *        - Events
 *        - Delete
 *      parameters:
 *          -   in: path
 *              name: eventId
 *              schema:
 *                  type: string
 *                  example: 17de19ce2d431d191350cb31912dbf2796f84bb1
 *              required: true
 *              description: "the ID of the event which you are deleting the guest from."
 *          -   in: path
 *              name: taskId
 *              schema:
 *                  type: string
 *                  example: 17de19ce2d431d191350cb31912dbf2796f84bb1
 *              required: true
 *              description: "the ID of the task which you are deleting from the event."
 *      responses:
 *          '200':
 *              description: successfully deleted the task
 *          '500':
 *              description: unexepected error
 *          '403':
 *              description: you are not authenticated to do that
 *          '404':
 *              description: task does not exist
 *          '410':
 *              description: task not in list
 *              
 */
eventRouter.delete('/events/:eventId/tasks/:taskId', isLoggedIn, isAdmin, catchAsync(async(req, res)=>{

    const {eventId, taskId} = req.params;
    const event = await Event.findById(eventId);

    if(!event){return res.status(404).json({error:'task does not exist'})}
    const taskIndex = event.tasks.indexOf(taskId);
    if(taskIndex == -1) {return res.status(410).json({error:'task does not in list'})}

    const updatedEvent = await Event.findByIdAndUpdate(event._id, {$pull: {tasks: taskId}}, {new: true, runValidators: true})
    await Task.findByIdAndDelete(taskId)

    const tasks = updatedEvent.tasks
    res.status(200).json({tasks});
}))

module.exports = eventRouter;