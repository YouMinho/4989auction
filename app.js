const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('main', {category: 'ALL'})
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/item_add', (req, res) => {
    res.render('login')
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