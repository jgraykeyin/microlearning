let fs = require('fs');
let mysql = require('mysql');
let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let path = require('path')
let bcrypt = require('bcrypt');
let https = require('https');

const USE_HTTPS = false;
const PORT = 3000;
const SSL_KEY_FILE_LOCATION = path.join(__dirname, 'ssl/RootCA.key');
const SSL_CERT_FILE_LOCATION = path.join(__dirname, 'ssl/RootCA.crt');


let connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'keyintesting',
});

// Create the Database and tables
connection.query(`CREATE DATABASE IF NOT EXISTS \`nodelogin\` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci`);
connection.query(`USE \`nodelogin\``);
connection.query(`CREATE TABLE IF NOT EXISTS \`accounts\` (
    \`id\` int(11) NOT NULL,
    \`username\` varchar(50) NOT NULL,
    \`password\` varchar(255) NOT NULL,
    \`email\` varchar(100) NOT NULL,
    \`salt\` varchar(255) NOT NULL
  ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;`);

// connection.query(`ALTER TABLE \`accounts\` ADD PRIMARY KEY (\`id\`)`);  
// connection.query(`ALTER TABLE \`accounts\` MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;`); 
//   ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;`);

connection.query(`CREATE TABLE IF NOT EXISTS \`progress\` (
       \`id\` int(11) NOT NULL,
       \`performance\` INT(11) NOT NULL,
       \`devops\` INT(11) NOT NULL,
       \`culture\` INT(11) NOT NULL,
       \`stress\` INT(11) NOT NULL,
       \`budgets\` INT(11) NOT NULL,
       \`email\` VARCHAR(255) NOT NULL
   ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;`);

/* connection.query(`ALTER TABLE \`progress\` ADD PRIMARY KEY (\`id\`)`); */

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

app.post('/correct', function(request, response) {
    let userid = request.session.userid
    let course = request.body.course;
    let email = request.session.email;
    let progress = request.body.progress;
    console.log(`Progress: ${progress}`);
    console.log(`Course: ${course}`)
    
    connection.query(`UPDATE progress SET ${course}='${progress}' WHERE email='${email}'`, function(err) {
        if(err) {
            console.error("Failed to insert progress");
        } else {
            console.log("INSERT success");
        }
    });
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

                            // After creating the account, create an entry in the progress table for the user
                            connection.query(`INSERT INTO progress (performance,devops,culture,stress,budgets,email) VALUES ('0','0','0','0','0','${email}')`), function(err) {
                                if(err) {
                                    console.error("Progress insert failed");
                                }
                            }

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
                            request.session.userid = results[0].id;
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
        console.log(`${request.session.email} has logged in`);
        console.log(`User ID: ${request.session.userid}`);
        response.sendFile(path.join(__dirname, '/homepage.html'));
    } else {
        // response.send('Please login to view this page!');
        // response.end();
        response.sendFile(path.join(__dirname, '/error2.html'));
    }
});

app.get('/performance', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, '/performance.html'));
    } else {
        // response.send('Please login to view this page!');
        // response.end();
        response.sendFile(path.join(__dirname, '/error2.html'));
    }
});

app.get('/devcritbudgets', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, '/devcritbudgets.html'));
    } else {
        // response.send('Please login to view this page!');
        // response.end();
        response.sendFile(path.join(__dirname, '/error2.html'));
    }
});

app.get('/devopplans', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, '/devopplans.html'));
    } else {
        // response.send('Please login to view this page!');
        // response.end();
        response.sendFile(path.join(__dirname, '/error2.html'));
    }
});

app.get('/culture', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, '/culture.html'));
    } else {
        // response.send('Please login to view this page!');
        // response.end();
        response.sendFile(path.join(__dirname, '/error2.html'));

    }
});

app.get('/timestress', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, '/stress.html'));
    } else {
        // response.send('Please login to view this page!');
        // response.end();
        response.sendFile(path.join(__dirname, '/error2.html'));

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