let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
// connect to our expense model
let Expense = require('../model/expense');

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
        const ExpenseList = await Expense.find({user: req.user._id});
        if (req.accepts('html')) {
            res.render('Expenses/list', {
                title: 'Expenses',
                ExpenseList: ExpenseList,
                displayName: req.user ? req.user.displayName : ""
            });
        } else {
            res.json(ExpenseList);
        }
    }
    catch(err)
    {
        console.log(err);
        if(req.accepts('json')) {
            res.status(500).json({error:'Error on the Server'})
        } else {
            res.render('Expenses/list',
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
        res.render('Expenses/add',{
            title:'Add Expense',
            displayName: req.user?req.user.displayName:""
        });
    }
    catch(err)
    {
        console.log(err);
        res.render('Expenses/list',
            {
                error:'Error on the Server'
            }
        )
    }
})

// shared handler to create an expense (used by both '/' and '/add')
async function createExpenseHandler(req, res, next) {
    try {
        let newExpense = Expense({
            "user": req.user._id,
            "title": req.body.title,
            "amount": req.body.amount,
            "category": req.body.category,
            "date": req.body.date || new Date(),
            "receiptUrl": req.body.receiptUrl
        });
        const expense = await Expense.create(newExpense);
        if (req.accepts('html')) {
            return res.redirect('/expenses');
        }
        return res.json(expense);
    } catch (err) {
        console.log(err);
        if (req.accepts('html')) {
            return res.render('Expenses/list', { error: 'Error on the Server' });
        }
        return res.status(500).json({ error: 'Error on the Server' });
    }
}

router.post('/', requireAuth, createExpenseHandler);
router.post('/add', requireAuth, createExpenseHandler);

// GET route for displaying the Edit Page --> Update Operation
router.get('/edit/:id',requireAuth,async(req,res,next)=>{
    try
    {
        const id = req.params.id;
        const expenseToEdit = await Expense.findById(id);
        res.render("Expenses/edit",
            {
                title: 'Edit Expense',
                Expense: expenseToEdit,
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
        let updateExpense = {
            "title":req.body.title,
            "amount":req.body.amount,
            "category":req.body.category,
            "date":req.body.date,
            "receiptUrl":req.body.receiptUrl
        }
        Expense.findByIdAndUpdate(id,updateExpense, {new: true}).then((expense)=>{
            res.json(expense);
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
        let updateExpense = Expense({
            "_id":id,
            "user": req.user._id,
            "title":req.body.title,
            "amount":req.body.amount,
            "category":req.body.category,
            "date":req.body.date,
            "receiptUrl":req.body.receiptUrl
        })
        Expense.findByIdAndUpdate(id,updateExpense).then(()=>{
            res.redirect("/expenses")
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
        Expense.deleteOne({_id:id}).then(()=>{
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
        Expense.deleteOne({_id:id}).then(()=>{
            res.redirect("/expenses")
        })
    }
    catch(err)
    {
        console.log(err);
        next(err);
    }
})

module.exports = router;
