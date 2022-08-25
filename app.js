const express= require('express');
const morgan = require('morgan');
const {nanoid} = require('nanoid');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const {loadContact, findContact, addContact} = require('./utils/contact');

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
    const contacts = loadContact();
    console.log(contacts)
    res.render('contact', {
        title: 'Halaman contact',
        layout: 'layouts/main-layout',
        contacts
    });
});
app.get('/contact/add', (req, res)=>{
    res.render('add-contact', {
        title: 'Halaman add contact',
        layout: 'layouts/main-layout'
    });
});
app.post('/contact', (req, res) =>{
    const data = req.body;
    console.log(data)
    addContact(data);
    console.log('data berhasil ditambahkan');
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