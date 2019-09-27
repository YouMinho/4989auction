const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

app.locals.pretty = true;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

//-----------DB------------------
const connection = mysql.createConnection({
	host: '183.101.196.138',
	user: 'admin4989',
	password: 'admin4989',
	database: 'auction4989'
});

connection.connect((err) => {
    if (err) { 
        console.log(err);
        throw err;
    }
    console.log('connerct success : ' + connection.threadId);
});
//-----------DB------------------

app.get('/', (req, res) => {
    res.render('main', {category: 'ALL'})
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/item_add', (req, res) => {
    res.render('item_add')
})

app.get('/item_add_content', (req, res) => {
    res.render('item_add_content')
})

app.get('/main/:category', (req, res) => {
    var category = req.params.category
    res.render('main', {category: category})
})

app.get('/item_info', (req, res) => {
    res.render('item_info')
})
app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/find_idpw', (req, res) => {
    res.render('find_idpw')
})

app.listen(8888, () => {
    console.log('8888 port opened!!!');
})