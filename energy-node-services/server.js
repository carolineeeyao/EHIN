var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var port = 8080;
var router = express.Router();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "SeniorDesign",
    multipleStatements: true
});

con.connect(function(err) {
    if (err) throw err
});

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

function addData(table, txid)
{
    var dataPoint = getRandomArbitrary(0,100);
    var query = "insert into " + table + " (Txid, Value, TimeRead) Values (" + txid + ", " + + dataPoint + ", '1970-01-01 00:00:01');";

        con.query(query, function (err, result, fields) {
          if (err) throw err;
          //console.log(result);
          
        });
}

function getInitialData(table, txid, callback)
{
    var query = "select * from " + table + " where Txid = " + txid + " order by Id desc limit 12";

        con.query(query, function (err, result, fields) {
          if (err) throw err;
          //console.log(result);
          return callback(result);
        });
}

function getUpdatedData(table, callback)
{
    var query1 = "select * from " + table + " where Txid = 1 order by Id desc limit 1;"
    var query2 = "select * from " + table + " where Txid = 2 order by Id desc limit 1;"
    //var query = "select * from " + table + " order by Id desc limit 2";
    var query = query1 + query2;

        con.query(query, function (err, result, fields) {
          if (err) throw err;
          //console.log(result);
          myResult = [];
          myResult.push(result[0][0]);
          myResult.push(result[1][0]);

          return callback(myResult);
        });
}

function getAdditionalData(callback)
{
    var accel_query1 = "select * from Accelerometer where Txid = 1 order by Id desc limit 1;"
    var accel_query2 = "select * from Accelerometer where Txid = 2 order by Id desc limit 1;"

    var gyro_query1 = "select * from Gyroscope where Txid = 1 order by Id desc limit 1;"
    var gyro_query2 = "select * from Gyroscope where Txid = 2 order by Id desc limit 1;"

    var mag_query1 = "select * from MagneticForce where Txid = 1 order by Id desc limit 1;"
    var mag_query2 = "select * from MagneticForce where Txid = 2 order by Id desc limit 1;"

    var query = accel_query1 + accel_query2 + gyro_query1 + gyro_query2 + mag_query1 + mag_query2;

    con.query(query, function (err, result, fields) {
        if (err) throw err;
        //console.log(result);
        myResult = [];
        accelData = [];
        gyroData = [];
        magData = [];

        accelData.push(result[0][0]);
        accelData.push(result[1][0]);
        gyroData.push(result[2][0]);
        gyroData.push(result[3][0]);
        magData.push(result[4][0]);
        magData.push(result[5][0]);

        myResult.push(accelData);
        myResult.push(gyroData);
        myResult.push(magData);

        return callback(myResult);
      });

}


router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});


router.get('/getinitial/:table/:txid', function(req, res) {  
    getInitialData(req.params.table, req.params.txid, function(result)
    {
        addData(req.params.table, req.params.txid);
        res.json(result);
    });
});

router.get('/getupdateddata/:table/', function(req, res) {  
    getUpdatedData(req.params.table, function(result)
    {
        //addData(req.params.table, 1);
        //addData(req.params.table, 2);
        res.json(result);
    });
});

router.get('/additionaldata', function(req, res) {
    getAdditionalData(function(result)
    {
        res.json(result);
    });
});



app.use('/api', router);

app.listen(port, '0.0.0.0');
console.log('Starting port ' + port);
