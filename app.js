const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('main')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.listen(8888, () => {
    console.log('8888 port opened!!!');
})