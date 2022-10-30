/********************************************************************************* 
* WEB700 � Assignment 04 
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students. 
* 
* Name: Shiva Jafari far Student ID: 169302213 Date: October 25th 
* 
********************************************************************************/
const cd = require('./modules/collegeData.js');
cd.initialize().then((value) => {
	var HTTP_PORT = process.env.PORT || 8080;
	const express = require("express");
	var app = express();
	const path = require('path');
	// setup a 'route' to listen on the default url path
	app.get("/", (req, res) => {
		res.sendFile(path.join(__dirname, 'views/home.html'));
	});
	app.get("/about", (req, res) => {
		res.sendFile(path.join(__dirname, 'views/about.html'));
	});
	app.get("/htmlDemo", (req, res) => {
		res.sendFile(path.join(__dirname, 'views/htmlDemo.html'));
	});
	app.get("/students/add", (req, res) => {
		res.sendFile(path.join(__dirname, 'views/addStudent.html'));
	});
	app.use(express.urlencoded({ extended: true }));
	app.post("/students/add", (req, res) => {
			cd.addStudent(req.body).then((value) => {
			res.clearCookie('respMessage').cookie('respMessage', '{"type":"success", "message":"a new student (studentNum='+value.studentNum+') has been created successfully!"}').redirect('/');
			}).catch((error) => {
				res.clearCookie('respMessage').cookie('respMessage', '{"type":"error", message:"' + error + '"}').redirect('/');
			});
	});
	app.get("/students", (req, res) => {
		if (req.query == null || req.query.course == null)
		{
			cd.getAllStudents().then((value) =>
				res.send(JSON.stringify(value))
			).catch((error) =>
				res.send('{message:"' + error + '"}')
			);
		}
		else {
			cd.getStudentsByCourse(req.query.course).then((value) =>
				res.send(JSON.stringify(value))
			).catch((error) =>
				res.send('{message:"' + error + '"}')
			);
		}
	});
	app.get("/student/:num", (req, res) => {
		cd.getStudentByNum(req.params.num).then((value) =>
			res.send(JSON.stringify(value))
		).catch((error) =>
			res.send('{message:"' + error + '"}')
		);
	});

	app.get("/courses", (req, res) => {
		cd.getCourses().then((value) =>
			res.send(JSON.stringify(value))
		).catch((error) =>
			res.send('{message:"' + error + '"}')
		);
	});

	app.get("/tas", (req, res) => {
		
		cd.getTAs().then((value) =>
			res.send(JSON.stringify(value))
		).catch((error) =>
			res.send('{message:"' + error + '"}')
		);
	});

	app.use(express.static('public'));
	app.use(function(req, res, next) {
	  res.send("Page Not Found");
	});
	
	
	// setup http server to listen on HTTP_PORT
	app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});
	}
).catch((error) =>
    console.log(error)
);


