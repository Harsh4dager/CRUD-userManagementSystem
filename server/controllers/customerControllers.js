const mongoose = require('mongoose');
const customer = require('../models/customer')
const flash = require('connect-flash');

// Home route
exports.homepage = async (req, res)=>{
    const msg = await req.flash('Info'); //passed this msg from /add to / using flash

    const locals = {
        title: "NodeJs",
        description: "Free NodeJs User Management System"
    }

    // pagination
    let perPage = 4;
    let page = req.query.page || 1;  // http://localhost:5000/?page=2

    try {
        const customers = await customer.aggregate([ { $sort: { updatedAt: -1 }}]) // sorting by updated At
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
            
        // let's count the customers
        const count = await customer.countDocuments();

        res.render('index', {
            locals,
            customers,
            current: page,
            pages: Math.ceil(count / perPage),
            msg
        })

    } catch (error) {
        console.log(error);
    }
    
}

// about route
exports.aboutPage = async (req, res)=>{
   
    const locals = {
        title: "NodeJs",
        description: "Free NodeJs User Management System"
    }

    try {
        res.render('about', {
            locals,
             customer
        })
    } catch (error) {
     console.log(error)   
    }
    
}

// add route page
exports.addCustomer = async (req, res)=>{
    const locals = {
        title: "NodeJs",
        description: "Free NodeJs User Management System"
    }
    res.render('customer/add', locals);
}

// post customer 
exports.postCustomer = async (req, res)=>{
    const newCustomer = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        tel: req.body.tel,
        details: req.body.details
    }

    try {
        await customer.create(newCustomer);
        await req.flash('Info', 'New customer has been added'); 
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}

// get customer data
exports.view = async (req, res)=>{
    try{
        const customerData = await customer.findOne({ _id: req.params.id});

        const locals = {
            title: "View customer Data",
            description: "Free NodeJs User Management System"
        };

        res.render('customer/view', {
            locals,
            customerData
        })

    }
    catch(err){
        console.log(err);
    }
}


// edit customer data
exports.edit = async (req, res)=>{
    try{
        const customerData = await customer.findOne({ _id: req.params.id});

        const locals = {
            title: "Edit customer Data",
            description: "Free NodeJs User Management System"
        };

        res.render('customer/edit', {
            locals,
            customerData
        })

    }
    catch(err){
        console.log(err);
    }
}

// update customer data
exports.editPost = async (req, res) => {
    try {
        const updatedCustomer = await customer.findByIdAndUpdate(
            req.params.id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                tel: req.body.tel,
                details: req.body.details,
                email: req.body.email,
                updatedAt: new Date() // Optionally, update the updatedAt field
            },
            { new: true } // Return the modified document
        );

        if (!updatedCustomer) {
            // Handle case where customer is not found
            return res.status(404).send("Customer not found");
        }

        // Redirect to the view page for the updated customer
        res.redirect(`/view/${req.params.id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating customer");
    }
};

// delete customer data
exports.deleteCustomer = async (req, res) => {
    try {
        await customer.deleteOne({ _id: req.params.id});
        res.redirect("/");
    } catch (error) {
        console.log(error)
    }
   
};

// search controller
exports.searchController = async (req, res)=> {

    const locals = {
        title: "Search customer Data",
        description: "Free NodeJs User Management System"
    };

    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const customers = await customer.find({
            $or: [
                {firstName: { $regex: new RegExp(searchNoSpecialChar, "i")}},
                { lastName: {$regex: new RegExp(searchNoSpecialChar, "i")}}
            ]
        });

        res.render("search", {
            locals,
            customers
        })
    } catch (error) {
        console.log(error)
    }
}