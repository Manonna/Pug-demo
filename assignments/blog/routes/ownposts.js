'use strict'
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const bcrypt	= require('bcrypt-nodejs')
const session = require ('express-session')
const Sequelize = require('sequelize')

const db 		 = new Sequelize ( 'blog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	server: 'localhost',
	dialect: 'postgres'
} )

let User = db.define( 'user', {
	name: Sequelize.STRING,
	email: {type: Sequelize.STRING, unique: true},
	password: Sequelize.STRING
})
//create blogpost model
let Blogpost = db.define( 'blogpost', {
	title: Sequelize.STRING,
	body: Sequelize.STRING
})
//create relationships
User.hasMany( Blogpost )
Blogpost.belongsTo( User )


router.use( session( {
	secret: 'muy secreto si si',
	resave: true,
	saveUninitialized: false
} ) )

// list of current users posts
router.get('/ownposts', (req, res) => {
	User.findOne({
		where: {
			email: req.session.user.email
		},
		attributes: ['name'],
		include: [{
			model:Blogpost,
			attributes: ['title', 'body']
		}]
	}).then( (user) =>{
		res.send( user )
	})
})

module.exports = router