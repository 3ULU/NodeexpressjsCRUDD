// filepath: c:\Users\mrpoo\OneDrive\Documentos\Actividad Node Express JS\nodejs-crud-with-expressjs-mysql-master\nodejs-crud-with-expressjs-mysql-master\routes\index.js
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { username: '' }); 
});

module.exports = router;