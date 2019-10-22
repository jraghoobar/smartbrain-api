const express = require('express');
const bodyParser = require('body-parser');

const bcrypt = require('bcrypt');
const cors = require('cors');

const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const saltRounds = 10;

const db = knex({
	client: 'pg',
	connection: {
		host : '127.0.0.1',
		user : 'JacobRaghoobar',
		password : '',
		database: 'smart-brain'
	}
});


db.select('*').from('users').then(data => {
	console.log(data);
});

const app = express();
// middleware
app.use(bodyParser.json());
app.use(cors());

// const database = {
// 	users: [
// 		{
// 			id: '123',
// 			name: 'John',
// 			email: 'john@gmail.com',
// 			password: 'cookies',
// 			entries: 0,
// 			joined: new Date()
// 		},
// 		{
// 			id: '124',
// 			name: 'Sally',
// 			email: 'sally@gmail.com',
// 			password: 'bananas',
// 			entries: 0,
// 			joined: new Date()
// 		}

// 	],

// 	login: [
// 		{
// 			id: '987',
// 			hash: '',
// 			email: 'john@gmail.com'
// 		}

// 	]
// }

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', signin.handleSignin(db, bcrypt, saltRounds))

app.post('/register', (req, res) => 
	{register.handleRegister(req, res, db, bcrypt, saltRounds) });

// is a param
app.get('/profile/:id', (req, res) => {
	profile.handleProfileGet(req, res, db)
})

app.put('/image', (req, res) => {
	image.handleImage(req, res, db)
	
})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)});



// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare(someOtherPlaintextPassword, hash, function(err, res) {
//     // res == false
// });


app.listen(3000, () => {
	console.log('app is running on port 3000');
});





/*

STATES & WHAT THEY RETURN

/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user

singing in - using post request bc query string is not safe. sending thru body
is better. ( use "raw" then configure to JSON)

*/