let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
// connect to our goal model
let Goal = require('../model/goal');

function requireAuth(req,res,next)
{
    if(!req.isAuthenticated())
    {
        if(req.path.startsWith('/api') || req.accepts('json')) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        return res.redirect('/login')
    }
    next();
}

// GET route for displaying the data from DB --> Read Operation (Web + API)
router.get('/',requireAuth,async(req,res,next)=>{
    try{
        const GoalList = await Goal.find({user: req.user._id});
        if (req.accepts('html')) {
            res.render('Goals/list', {
                title: 'Goals',
                GoalList: GoalList,
                displayName: req.user ? req.user.displayName : ""
            });
        } else {
            res.json(GoalList);
        }
    }
    catch(err)
    {
        console.log(err);
        if(req.accepts('json')) {
            res.status(500).json({error:'Error on the Server'})
        } else {
            res.render('Goals/list',
                {
                    error:'Error on the Server'
                }
            )
        }
    }
});

// GET route for displaying the Add Page --> Create Operation
router.get('/add',requireAuth,async(req,res,next)=>{
    try
    {
        res.render('Goals/add',{
            title:'Add Goal',
            displayName: req.user?req.user.displayName:""
        });
    }
    catch(err)
    {
        console.log(err);
        res.render('Goals/list',
            {
                error:'Error on the Server'
            }
        )
    }
})

// handler to create a goal (used by both '/' and '/add')
async function createGoalHandler(req, res, next) {
    try {
        let newGoal = Goal({
            "user": req.user._id,
            "title": req.body.title,
            "targetAmount": req.body.targetAmount,
            "deadline": req.body.deadline
        });
        const goal = await Goal.create(newGoal);
        if (req.accepts('html')) {
            return res.redirect('/goals');
        }
        return res.json(goal);
    } catch (err) {
        console.log(err);
        if (req.accepts('html')) {
            return res.render('Goals/list', { error: 'Error on the Server' });
        }
        return res.status(500).json({ error: 'Error on the Server' });
    }
}

router.post('/', requireAuth, createGoalHandler);
router.post('/add', requireAuth, createGoalHandler);

// GET route for displaying the Edit Page --> Update Operation
router.get('/edit/:id',requireAuth,async(req,res,next)=>{
    try
    {
        const id = req.params.id;
        const goalToEdit = await Goal.findById(id);
        res.render("Goals/edit",
            {
                title: 'Edit Goal',
                Goal: goalToEdit,
                displayName: req.user?req.user.displayName:""
            }
        )
    }
    catch(err)
    {
        console.log(err);
        next(err);
    }
})

// PUT route for processing the Edit Page --> Update Operation (API)
router.put('/:id',requireAuth,async(req,res,next)=>{
    try{
        let id = req.params.id;
        let updateGoal = {
            "title":req.body.title,
            "targetAmount":req.body.targetAmount,
            "currentAmount":req.body.currentAmount,
            "deadline":req.body.deadline,
            "completed":req.body.completed || false
        }
        Goal.findByIdAndUpdate(id,updateGoal, {new: true}).then((goal)=>{
            res.json(goal);
        })
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: err.message});
    }
})

// POST route for processing the Edit Page --> Update Operation (Web)
router.post('/edit/:id',requireAuth,async(req,res,next)=>{
    try{
        let id = req.params.id;
        let updateGoal = Goal({
            "_id":id,
            "user": req.user._id,
            "title":req.body.title,
            "targetAmount":req.body.targetAmount,
            "currentAmount":req.body.currentAmount,
            "deadline":req.body.deadline,
            "completed":req.body.completed
        })
        Goal.findByIdAndUpdate(id,updateGoal).then(()=>{
            res.redirect("/goals")
        })
    }
    catch(err)
    {
        console.log(err);
        next(err);
    }
})

// DELETE route to perform Delete Operation (API)
router.delete('/:id',requireAuth,async(req,res,next)=>{
    try{
        let id = req.params.id;
        Goal.deleteOne({_id:id}).then(()=>{
            res.json({message: 'Deleted'});
        })
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: err.message});
    }
})

// GET route to perform Delete Operation (Web)
router.get('/delete/:id',requireAuth,async(req,res,next)=>{
    try{
        let id = req.params.id;
        Goal.deleteOne({_id:id}).then(()=>{
            res.redirect("/goals")
        })
    }
    catch(err)
    {
        console.log(err);
        next(err);
    }
})

module.exports = router;
