const express=require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path=require("path");

const app=express();

const port=3000;

// app.use('/static',express.static('static'));
app.use(express.static('public'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost/electricitySite', { useNewUrlParser: true, useUnifiedTopology: true });

// schema for complaint usedin complaint in PageForUser
const complaintSchema = new mongoose.Schema({
    name: String,
    phone:Number,
    email:String,
    address:String,
    complaint:String
});
const complaintModel = mongoose.model('Complaints', complaintSchema);


// schema for update used  in updatePageForDepartment
const updateSchema = new mongoose.Schema({
    update:String
});
const UpdateModel = mongoose.model('updates', updateSchema);

// Schema for details of department people used for signin
const officerSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});
const Officer = mongoose.model('officer', officerSchema);

// Schema for details of customer used for signin
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});
const User = mongoose.model('user', userSchema);


// all post requests

app.post('/saveComplaint', async (req, res) => {
    try {
      const { name,phone,mail,address,complaint } = req.body;
      const newComplaint = new complaintModel({ name,phone,mail,address,complaint });
      await newComplaint.save();
      res.send('Text saved to MongoDB!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

app.post('/saveUpdate', async (req, res) => {
    try {
      const { update } = req.body;
      console.log('Received update:', update); // Log the update to the console
      const newUpdate = new UpdateModel({ update });
      await newUpdate.save();
      res.send('Text saved to MongoDB!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});


// post request from department login page
app.post('/departmentlogin', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const officer = await Officer.findOne({ username, password });

        if (officer) {
            // Successful login
            console.log('Login successful:', officer);
            res.render('landingPageForDepartment.pug', { username: officer.username });
        } else {
            // Invalid credentials
            console.log('Invalid credentials');
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// post request from customer login page
app.post('/customerlogin', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ username, password });

        if (user) {
            // Fetch updates
            const updates = await UpdateModel.find();

            // Successful login
            console.log('Login successful:', user);
            res.render('landingPageForUsers.ejs', { user, updates });
        } else {
            // Invalid credentials
            console.log('Invalid credentials');
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// all get requests
app.get('/',(req,res)=>{
    const params={};
    res.status(200).render('classificationPage.pug',params);
})
app.get('/customerLoginpage',(req,res)=>{
    const params={};
    res.status(200).render('customerloginPage.ejs',params);
})
app.get('/departmentLoginPage',(req,res)=>{
    const params={};
    res.status(200).render('departmentLoginPage.ejs',params);
})

// app.get('/landingPageForUsers',(req,res)=>{
//     const params={};
//     res.status(200).render('landingPageForUsers.ejs',params);
// })

// app.get('/landingPageForUsers',(req,res)=>{
//     const params={};
//     res.status(200).render('landingPageForUsers.ejs',params);
// })

app.get('/landingPageForUsers', async (req, res) => {
    try {
        const updates = await UpdateModel.find();
        const userContent = await User.findOne({ username, password });// Fetch user-specific content

        res.render('landingpageForUsers.ejs', { updates, userContent });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
// app.get('/landingPageForUsers', async (req, res) => {
//     try {
//       const update = await UpdateModel.find();
//       console.log(update);
//       res.render('landingpageForUsers', { update });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     }
// });

app.get('/landingPageForDepartment',(req,res)=>{
    const params={};
    res.status(200).render('landingPageForDepartment.pug',params);
})
app.get('/billingPageForUsers',(req,res)=>{
    const params={};
    res.status(200).render('billingPageForUsers.pug',params);
})
app.get('/complaintsPageForUsers',(req,res)=>{
    const params={};
    res.status(200).render('complaintsPageForUsers',params);
})
app.get('/queriesPageForUsers',(req,res)=>{
    const params={};
    res.status(200).render('queriesPageForUsers.pug',params);
})
app.get('/queriesPageFordepartment',(req,res)=>{
    const params={};
    res.status(200).render('queriesPageForDepartment.pug',params);
})
app.get('/updatesPageFordepartment',(req,res)=>{
    const params={};
    res.status(200).render('updatesPageForDepartment.ejs',params);
})
// app.get('/complaintsPageFordepartment',(req,res)=>{
//     const params={};
//     res.status(200).render('complaintsPageForDepartment.ejs',params);
// })
app.get('/complaintsPageForDepartment', async (req, res) => {
    try {
      const complaint = await complaintModel.find();
      console.log(complaint);
      res.render('complaintsPageForDepartment', { complaint });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

