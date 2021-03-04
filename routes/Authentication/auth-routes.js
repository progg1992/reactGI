const express = require("express");
const router = express.Router();
//const config = require('config');
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const auth = require("../../config/middleware/auth");
const bcrypt = require('bcryptjs');
const config = require('config');
// @route POST api/auth
// @desc POST login User
// @access Public
router.post("/", (req, res) => {
	const { username, password } = req.body;
	// Simple Validation
	if (!username || !password) {
		return res.status(400).json({ msg: "Please enter all fields" });
	}
	// Check for existing user
	User.findOne({ username }).then((user) => {
		if (!user) return res.status(400).json({ msg: "User does not exist" });
		// Validate Password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
			// Signing the token
			jwt.sign(
				// payload
				{ id: user.id },
				//jwt secret
				config.get("jwtSecret"),
				// Expires in a hour
				{ expiresIn: 60 },
				(err, token) => {
					if (err) throw err;
					res.json({
						token,
						user: {
							id: user.id,
							username: user.username,
							email: user.email,
						},
					});
				}
			);
		});
	});
	// @route GET api/auth/user
	// @desc Get user data
	// @access Private
	router.get("/api/auth/user", auth, (req, res) => {
		User.findById(req.user.id)
			.select("-password")
			.then((user) => res.json(user));
	});
});

module.exports = router;
