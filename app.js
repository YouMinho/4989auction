const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer')
const session = require('express-session');

const app = express();
var upload = multer({ dest: 'uploads/' });

app.locals.pretty = true;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    res.locals.user = req.session;
    next();
});

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
    sess = req.session;
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
        res.render('main', { article: results, category: 'ALL' });
    })
})

app.get('/login', (req, res) => {
    const sess = req.session;
    res.render('login', { pass: true });
})

app.post('/login', (req, res) => {
    const sess = req.session;
    let values = [req.body.username, req.body.password];
    let login_query = `
	select *
    from users
    where id=? and password=?;
	`;
    connection.query(login_query, values, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error!!!')
        }

        if (results.length == 1) {
            sess.userid = results[0].id;
            sess.name = results[0].name;
            sess.grade = results[0].grade;
            req.session.save(() => {
                res.redirect('/');
            });
        } else {
            res.render('login', { pass: false });
        }
    })
})

app.get('/logout', (req, res) => {
    const sess = req.session;
    sess.destroy();
    res.redirect('/');
});

app.get('/item_add', (req, res) => {
    res.render('item_add')
})

app.get('/item_add_content', (req, res) => {
    res.render('item_add_content')
})

app.get('/main/:category', (req, res) => {
    var category = req.params.category
    res.render('main', { category: category })
})

app.get('/item_info/:num', (req, res) => {
    let num = req.params.num
    let item_select = `
        select format(i.max_price, 0) price, timediff(i.end_time, now()) time, i.title, i.content, i.seller_id, u.phone
        from item i, users u
        where i.id = ?
    `
    connection.query(item_select, [num], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error!!!')
        }
        console.log(results);

        res.render('item_info', { article: results[0] })
    })
})

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const sess = req.session;

    let id = req.body.id;
    let name = req.body.name;
    let password = req.body.pass;
    let email = req.body.emailid + "@" + req.body.emaildomain;
    let phone = req.body.tel1 + req.body.tel2 + req.body.tel3;
    let address = req.body.address;

	let values = [id, password, "G", name, email, phone, address];
	let users_insert = `
	insert into users (id, password, grade, name, email, phone, address)
	values(?, ?, ?, ?, ?, ?, ?)
	`;
	connection.query(users_insert, values, (err, result) => {
        sess.userid = id;
        sess.name = name;
        sess.grade = "G";
        req.session.save(() => {
            res.redirect('/');
        });
	});
});

app.get('/find_idpw', (req, res) => {
    res.render('find_idpw')
})

app.listen(8888, () => {
    console.log('8888 port opened!!!');
})