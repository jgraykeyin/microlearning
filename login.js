let fs = require('fs');
let mysql = require('mysql');
let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let path = require('path')
let bcrypt = require('bcrypt');
let https = require('https');

const USE_HTTPS = false;
const PORT = 3001;
const SSL_KEY_FILE_LOCATION = path.join(__dirname, 'ssl/RootCA.key');
const SSL_CERT_FILE_LOCATION = path.join(__dirname, 'ssl/RootCA.crt');


let connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'keyintesting',
});


connection.query(`CREATE DATABASE IF NOT EXISTS \`nodelogin\` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci`);
connection.query(`USE \`nodelogin\``);
connection.query(`CREATE TABLE IF NOT EXISTS \`accounts\` (
    \`id\` int(11) NOT NULL,
    \`username\` varchar(50) NOT NULL,
    \`password\` varchar(255) NOT NULL,
    \`email\` varchar(100) NOT NULL,
    \`salt\` varchar(255) NOT NULL
  ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;`);

connection.query(`ALTER TABLE \`accounts\` ADD PRIMARY KEY (\`id\`)`);  
connection.query(`ALTER TABLE \`accounts\` MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;`); 


let app = express();

app.use(session({
    secret: 'keyinfinalteam',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// Add access to public css and image folders
// app.use(express.static(__dirname + '/css'));
// app.use(express.static(__dirname + '/images'));

app.use('/css', express.static('css'))
app.use('/images', express.static('images'))
app.use('/js', express.static('js'))
app.use('/jsondata', express.static('jsondata'))
app.use('/video', express.static('video'))


app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/mobile_login.html'));
});

app.get("/signup", function(request, response){
    response.sendFile(path.join(__dirname, '/mobile_signup.html'));
})

app.post('/signup', function(request, response){
    let fullname = request.body.fullname;
	let password = request.body.password;
	let email = request.body.email;
    
    bcrypt.genSalt(10, function(err, salt){
        if(!err){
            bcrypt.hash(password, salt, function(err, password_hash){
                if(!err){
		            connection.query(`INSERT INTO accounts (username, password, email, salt) VALUES ('${fullname}', '${password_hash}', '${email}', '${salt}')`, function(err){
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
	let email = request.body.email;
	let password = request.body.password;
    
	if (email && password) {
		connection.query('SELECT * FROM accounts WHERE email = ?', [email], function(error, results, fields) {
            console.log(error);
            if (results.length > 0) {
                bcrypt.hash(password, results[0].salt, function(err, password_hash){
                    if(err){
                        response.send("An error occured during hashing, please try again!");
                    }else{
                        if(results[0].password === password_hash){
        				    request.session.loggedin = true;
        				    request.session.email = email;
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

app.get('/logout', function(request, response) {
    response.redirect('/');
    request.session.destroy()
    response.end();
})

app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, '/homepage.html'));
    } else {
        response.send('Please login to view this page!');
        response.end();
    }
});

app.get('/performance', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, '/performance.html'));
    } else {
        response.send('Please login to view this page!');
        response.end();
    }
});

app.get('/devcritbudgets', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, '/devcritbudgets.html'));
    } else {
        response.send('Please login to view this page!');
        response.end();
    }
});

app.get('/devopplans', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, '/devopplans.html'));
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
        cert: fs.readFileSync(SSL_CERT_FILE_LOCATION)
    }, app).listen(PORT, ()=>launchCallback('https', PORT));
}else{
    app.listen(PORT, ()=>launchCallback('http', PORT));
}