let fs = require('fs');
let mysql = require('mysql');
let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let path = require('path')
let bcrypt = require('bcrypt');
let https = require('https');

const USE_HTTPS = true;
const PORT = 3000;
const SSL_KEY_FILE_LOCATION = path.join(__dirname, 'ssl/key.pem')
const SSL_CERT_FILE_LOCATION = path.join(__dirname, 'ssl/cert.pem')
const SSL_PASSPHRASE = 'RANDOM';

let connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'keyintesting',
    database: 'nodelogin'
});

let app = express();

app.use(session({
    secret: 'keyinfinalteam',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/login.html'));
});

app.get("/signup", function(request, response){
    response.sendFile(path.join(__dirname, '/signup.html'));
})

app.post('/signup', function(request, response){
    let username = request.body.username;
	let password = request.body.password;
	let email = request.body.email;
    
    bcrypt.genSalt(10, function(err, salt){
        if(!err){
            bcrypt.hash(password, salt, function(err, password_hash){
                if(!err){
		            connection.query(`INSERT INTO accounts (username, password, email, salt) VALUES ('${username}', '${password_hash}', '${email}', '${salt}')`, function(err){
                        if(err){
                           console.error("Oh no! Insert failed!"); 
                           //response.send("Oh no! An error occured, please try again!")
        		           //response.redirect('/signup');
                        }else{
        		            response.redirect('/');
                        }
                    })
                }else{
                    console.error("Oh no! Hash failed!"); 
                    //response.send("Oh no! An error occured, please try again!")
        		    //response.redirect('/signup');
                }
            })
        }else{
            console.error("Oh no! SaltGen failed!"); 
            //response.send("Oh no! An error occured, please try again!")
            //response.redirect('/signup');
        }
    })
})


app.post('/auth', function(request, response) {
	let username = request.body.username;
	let password = request.body.password;
    
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
            console.log(error);
            if (results.length > 0) {
                bcrypt.hash(password, results[0].salt, function(err, password_hash){
                    if(err){
                        response.send("An error occured during hashing, please try again!");
                    }else{
                        if(results[0].password === password_hash){
        				    request.session.loggedin = true;
        				    request.session.username = username;
        				    response.redirect('/home');
                        }else{
        				    response.send('Incorrect Username and/or Password!');
                        }
                    }
                })
		    } else {
				response.send('Incorrect Username and/or Password!');
			}			
			//response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, '/new.html'));
    } else {
        response.send('Please login to view this page!');
        response.end();
    }
});

function launchCallback(proto, port){
    console.log(`Server is running at: ${proto}://localhost:${port}`);
}

if (USE_HTTPS){
    https.createServer({
        key: fs.readFileSync(SSL_KEY_FILE_LOCATION),
        cert: fs.readFileSync(SSL_CERT_FILE_LOCATION),
        passphrase: SSL_PASSPHRASE
    }, app).listen(PORT, ()=>launchCallback('https', PORT));
}else{
    app.listen(PORT, ()=>launchCallback('http', PORT));
}