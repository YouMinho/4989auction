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
    let hot_item = `
        select id, hit
        from item
        order by hit desc
    `
    connection.query(hot_item, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error!!!')           
        }
        console.log(results);
        
        res.render('main', {article: results, category: 'ALL'})
    })
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

app.get('/item_info/:num', (req, res) => {
    let num = req.params.num
        let item_select = `
        select i.max_price, i.title, i.content, i.seller_id, u.phone
        from item i, users u
        where i.seller_id = u.id
        and i.id = ?
    `
    connection.query(item_select, [num], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error!!!')           
        }
        res.render('item_info', {article: results[0]})
    })
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