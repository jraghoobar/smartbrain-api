const handleRegister = (req, res, db, bcrypt, saltRounds) => {
	// destructuring


	const { email, name, password } = req.body;

	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}

	const hash = bcrypt.hashSync(password, saltRounds);

	// ADD SO U CANT REGISTER W SAME EMAIL.
	// it doesnt save to the database rn but 
	// it lets u log in. fix that
	// also.. pics stay there lol

	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
			// loginEmail is an array, so use index 0
			// to get regular email
			email: loginEmail[0],
			name: name,
			joined: new Date()
			})
			.then(user => {
				//ALWAYS RESPOND
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
		
	.catch(err => res.status(400).json('unable to register'));
	// err gives you a lot of details about why
	// something failed. sometimes too much info
	
}

module.exports = {
	handleRegister: handleRegister
}