let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
// connect to our budget model
let Budget = require('../model/budget');

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
        const BudgetList = await Budget.find({user: req.user._id});
        if (req.accepts('html')) {
            res.render('Budgets/list', {
                title: 'Budgets',
                BudgetList: BudgetList,
                displayName: req.user ? req.user.displayName : ""
            });
        } else {
            res.json(BudgetList);
        }
    }
    catch(err)
    {
        console.log(err);
        if(req.accepts('json')) {
            res.status(500).json({error:'Error on the Server'})
        } else {
            res.render('Budgets/list',
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
        res.render('Budgets/add',{
            title:'Add Budget',
            displayName: req.user?req.user.displayName:""
        });
    }
    catch(err)
    {
        console.log(err);
        res.render('Budgets/list',
            {
                error:'Error on the Server'
            }
        )
    }
})

// handler for creating a budget (used by both '/' and '/add')
async function createBudgetHandler(req, res, next) {
    try {
        let newBudget = Budget({
            "user": req.user._id,
            "title": req.body.title,
            "category": req.body.category,
            "amount": req.body.amount,
            "period": req.body.period || 'monthly'
        });
        const budget = await Budget.create(newBudget);
        if (req.accepts('html')) {
            return res.redirect('/budgets');
        }
        return res.json(budget);
    } catch (err) {
        console.log(err);
        if (req.accepts('html')) {
            return res.render('Budgets/list', { error: 'Error on the Server' });
        }
        return res.status(500).json({ error: 'Error on the Server' });
    }
}

// POST route for processing the Add Page --> Create Operation (Web + API)
router.post('/', requireAuth, createBudgetHandler);

// POST route for API (alternative to /add)
router.post('/add', requireAuth, createBudgetHandler);

// GET route for displaying the Edit Page --> Update Operation
router.get('/edit/:id',requireAuth,async(req,res,next)=>{
    try
    {
        const id = req.params.id;
        const budgetToEdit = await Budget.findById(id);
        res.render("Budgets/edit",
            {
                title: 'Edit Budget',
                Budget: budgetToEdit,
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
        let updateBudget = {
            "title":req.body.title,
            "category":req.body.category,
            "amount":req.body.amount,
            "period":req.body.period
        }
        Budget.findByIdAndUpdate(id,updateBudget, {new: true}).then((budget)=>{
            res.json(budget);
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
        let updateBudget = Budget({
            "_id":id,
            "user": req.user._id,
            "title":req.body.title,
            "category":req.body.category,
            "amount":req.body.amount,
            "period":req.body.period
        })
        Budget.findByIdAndUpdate(id,updateBudget).then(()=>{
            res.redirect("/budgets")
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
        Budget.deleteOne({_id:id}).then(()=>{
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
        Budget.deleteOne({_id:id}).then(()=>{
            res.redirect("/budgets")
        })
    }
    catch(err)
    {
        console.log(err);
        next(err);
    }
})

module.exports = router;
