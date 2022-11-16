/********************************************************************************* 
* WEB700 � Assignment 05 
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students. 
* 
* Name: Shiva Jafari far Student ID: 169302213 Date: November 15th 
*
* Online (Cyclic) Link: https://easy-erin-indri-cape.cyclic.app  https://shiva-jafarifar.cyclic.app/
* 
********************************************************************************/
const cd = require('./modules/collegeData.js');
cd.initialize().then((value) => {
	var HTTP_PORT = process.env.PORT || 8080;
	const express = require("express");
	const exphbs = require("express-handlebars");
	var app = express();
	const path = require('path');
	app.use(function(req,res,next){
	let route = req.path.substring(1);
	app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
	next();
	});
	
	var hbs = exphbs.create({
		helpers: {
			navLink: function(url, options){
						return '<li' +
								((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
								'><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
			},
			equal: function (lvalue, rvalue, options) {
						if (arguments.length < 3)
							throw new Error("Handlebars Helper equal needs 2 parameters");
						if (lvalue != rvalue) {
							return options.inverse(this);
						} else {
							return options.fn(this);
						}
			}					
		},
		extname: 'hbs', 
		defaultLayout: 'main', 
		layoutsDir: 'views/layouts/'
	});
	app.engine('hbs', hbs.engine);
	app.set('view engine', 'hbs');
	//app.set('view engine', 'hbs');

	// setup a 'route' to listen on the default url path
	app.get("/", (req, res) => {
		res.render("home");
		//res.sendFile(path.join(__dirname, 'views/home.html'));
	});
	app.get("/about", (req, res) => {
		res.render("about");
		//res.sendFile(path.join(__dirname, 'views/about.html'));
	});
	app.get("/htmlDemo", (req, res) => {
		res.render("htmlDemo");
		//res.sendFile(path.join(__dirname, 'views/htmlDemo.html'));
	});
	app.get("/students/add", (req, res) => {
		res.render("addStudent");
		//res.sendFile(path.join(__dirname, 'views/addStudent.html'));
	});
	app.use(express.urlencoded({ extended: true }));
	app.post("/students/add", (req, res) => {
			cd.addStudent(req.body).then((value) => {
			res.clearCookie('respMessage').cookie('respMessage', '{"type":"success", "message":"a new student (studentNum='+value.studentNum+') has been created successfully!"}').redirect('/students');
			}).catch((error) => {
				res.clearCookie('respMessage').cookie('respMessage', '{"type":"error", "message":"' + error + '"}').redirect('/students');
			});
	});
	app.post("/student/update", (req, res) => { 
			cd.updateStudent(req.body).then((value) => {
			res.clearCookie('respMessage').cookie('respMessage', '{"type":"success", "message":"the student (studentNum='+value.studentNum+') has been updated successfully!"}').redirect('/students');
			}).catch((error) => {
				res.clearCookie('respMessage').cookie('respMessage', '{"type":"error", "message":"' + error + '"}').redirect('/students');
			});
			//console.log(req.body); res.redirect("/students"); 
	});
	app.get("/students", (req, res) => {
		if (req.query == null || req.query.course == null)
		{
			cd.getAllStudents().then((value) =>
				//res.send(JSON.stringify(value))
				res.render('students', {layout: 'main', students: value})
			).catch((error) =>
				//res.send('{message:"' + error + '"}')
				res.render('students', {layout: 'main', message: error})
			);
		}
		else {
			cd.getStudentsByCourse(req.query.course).then((value) =>
				//res.send(JSON.stringify(value))
				res.render('students', {layout: 'main', students: value})
			).catch((error) =>
				//res.send('{message:"' + error + '"}')
				res.render('students', {layout: 'main', message: error})
			);
		}
	});
	app.get("/student/:num", (req, res) => {
		cd.getStudentByNum(req.params.num).then((value) =>
			//res.send(JSON.stringify(value))
			res.render('student', {layout: 'main', student: value})
		).catch((error) =>{
			let unknownStudent = {studentNum: req.params.num};
			//res.send('{message:"' + error + '"}')
		res.render('student', {layout: 'main', student: unknownStudent, message: error})}
		);
	});
	app.get("/course/:id", (req, res) => {
		cd.getCourseById(req.params.id).then((value) =>
			//res.send(JSON.stringify(value))
			res.render('course', {layout: 'main', course: value})
		).catch((error) =>
			//res.send('{message:"' + error + '"}')
			res.render('course', {layout: 'main', message: error})
		);
	});

	app.get("/courses", (req, res) => {
		cd.getCourses().then((value) =>
			//res.send(JSON.stringify(value))
			res.render('courses', {layout: 'main', courses: value})
		).catch((error) =>
			//res.send('{message:"' + error + '"}')
			res.render('courses', {layout: 'main', message: error})
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


