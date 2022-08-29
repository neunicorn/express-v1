//import library or modules
const express= require('express');
const morgan = require('morgan');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const {body, validationResult, check} = require('express-validator');
const {loadContact, findContact, addContact, deleteContact, updateContact} = require('./utils/contact');

const app = express();
const port = 3001;

// set view engine ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);

// middleware
app.use(morgan('dev'));
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

//config flash
app.use(cookieParser('secret'));
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

const mahasiswa = [
    {
        nama: 'Rizki',
        email: 'rizki@gmail.com'
    },
    {
        nama: 'zulfan',
        email: 'zulfan@gmail.com'
    },
    {
        nama: 'ilham',
        email: 'ilham@gmail.com'
    }
];

app.get('/', (req, res)=>{
    res.render('index', {
        title: 'Halaman Home',
        nama: 'Zulfan',
        layout: 'layouts/main-layout',
        mahasiswa
    });
});
app.get('/about', (req, res) =>{
    res.render('about', {
        title: 'Halaman About',
        layout: 'layouts/main-layout'
    });
});
app.get('/contact', (req, res) =>{
    const msg = req.flash('msg');
    console.log('=====================');
    console.log(req.flash('msg'));
    console.log('=====================');
    const contacts = loadContact();
    res.render('contact', {
        title: 'Halaman contact',
        layout: 'layouts/main-layout',
        contacts,
        msg
    });
});
app.get('/contact/add', (req, res)=>{
    res.render('add-contact', {
        title: 'Halaman add contact',
        layout: 'layouts/main-layout'
    });
});
app.post('/contact',[
    check('email', 'Email tidak valid!').isEmail(),
    check('nohp', 'nomor hp tidak valid!').isMobilePhone('id-ID')
], (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.render('add-contact', {
            title: 'Halaman add contact',
            layout: 'layouts/main-layout',
            errors: errors.array()
        });
    }else{
        const data = req.body;
        addContact(data);
        //kirim flash message
        req.flash('msg', 'Data contact berhasil ditambahkan!');
        res.redirect('/contact');
    }
});
app.delete('/contact/:id', (req, res)=>{
    const {id} = req.params
    deleteContact(id);
    //kirim flash message
    req.flash('msg', 'Data contact berhasil dihapus!');
    res.redirect('/contact');
});
app.update('/contact/:id', (req, res)=>{
    const {id} = req.params;
    const newContact = req.body;
    updateContact(id, newContact);
    //kirim flash message
    req.flash('msg', 'Data contact berhasil diupdate!');
    res.redirect('/contact');
});
app.get('/contact/:id', (req, res) =>{
    const contact = findContact(req.params.id);
    res.render('contact-detail', {
        title: 'Halaman contact detail',
        layout: 'layouts/main-layout',
        contact
    })
});
app.use('/', (req, res)=>{
    res.send('<h1 style= "color:red;text-align:center;">404 Page not found</h1></br><a href="/">back to home</a>');
});

app.listen(port, () => console.log(`Server started on http://localhost:${port}`));