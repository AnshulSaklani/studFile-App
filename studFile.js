let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
	);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});
//const port = 2410;
var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let { students } = require("./students.js");
let fs = require("fs");
let fname = "students.json";

app.get("/svr/resetData", function(req,res){
	const { performance } = require("perf_hooks");
	const t0 = performance.now();
	let data = JSON.stringify(students);
	fs.writeFile(fname, data, function(err) {
		if (err){
			const t2 = performance.now();
			let timeTaken = t2 - t0;
			res.status(404).send({data:err,status:404, timeTaken: timeTaken});
		}// res.status(404).send(err);
		else{
			const t1 = performance.now();
			let timeTaken = t1 - t0;
			res.send({data: ["Data in file is reset"], status :200+" OK", timeTaken : timeTaken});
		}
		//res.send("Data in file is reset");
	});
})

app.get("/svr/students", function(req, res){
	const { performance } = require("perf_hooks");
	const t0 = performance.now();
	fs.readFile(fname, "utf8", function(err, data){
		if (err){
			const t2 = performance.now();
			let timeTaken = t2 - t0;
			res.status(404).send({data:err,status:404, timeTaken: timeTaken});
		}// res.status(404).send(err);
		else {
			let studentsArray = JSON.parse(data);
			const t1 = performance.now();
			let timeTaken = t1 - t0;
			res.send({data: studentsArray, status :200+" OK", timeTaken : timeTaken});
			//res.send(studentsArray);
		}
	});
});

app.get("/svr/students/:id", function(req, res){
	const { performance } = require("perf_hooks");
	const t0 = performance.now();
	let id = req.params.id;
	fs.readFile(fname, "utf8", function(err, data){
		if (err){
			const t2 = performance.now();
			let timeTaken = t2 - t0;
			res.status(404).send({data:err,status:404, timeTaken: timeTaken});
		}// res.status(404).send(err);
		else {
			let studentsArray = JSON.parse(data);
			let student = studentsArray.find((st) => Number(st.id) === Number(id));
			const t1 = performance.now();
			let timeTaken = t1 - t0;
			if(student) {
				res.send({data: [student], status :200+" OK", timeTaken : timeTaken});
				//res.send(student);
			}
			else res.status(404).send("No student found");
		}
	});
});

app.get("/svr/students/course/:name", function(req, res){
	const { performance } = require("perf_hooks");
	const t0 = performance.now();
	let name = req.params.name;
	fs.readFile(fname, "utf8", function(err, data){
		if (err){
			const t2 = performance.now();
			let timeTaken = t2 - t0;
			res.status(404).send({data:err,status:404, timeTaken: timeTaken});
		}// res.status(404).send(err);
		else {
			const t1 = performance.now();
			let timeTaken = t1 - t0;
			let studentsArray = JSON.parse(data);
			let arr1 = studentsArray.filter((st) => st.course === name);
			res.send({data: arr1, status :200+" OK", timeTaken : timeTaken});
			//res.send(arr1);
		}
	});
});

app.post("/svr/students", function(req,res){
	const { performance } = require("perf_hooks");
	let body = req.body;
	const t0 = performance.now();
	fs.readFile(fname, "utf8", function(err, data) {
		if (err) {
			const t2 = performance.now();
			let timeTaken = t2 - t0;
			res.status(404).send({data:err,status:404, timeTaken: timeTaken});
		} //res.status(404).send(err);
		else {
			const t1 = performance.now();
			let timeTaken = t1 - t0;
			let studentsArray = JSON.parse(data);
			let maxid = studentsArray.reduce((acc,curr) => (curr.id > acc ? curr.id : acc), 0);
			let newid = maxid + 1;
			let newStudent = { ...body, id:newid };
			studentsArray.push(newStudent);
			let data1 = JSON.stringify(studentsArray);
			fs.writeFile(fname, data1, function (err) {
				if(err) res.status(404).send(err);
				else{
					res.send({data:[newStudent], status:200+" OK", timeTaken : timeTaken});
				} //res.send(newStudent);
			});
		}
	});
});

/*app.put("/svr/students/:id", function(req,res){
	let body = req.body;
	let id = +req.params.id;
	fs.readFile(fname, "utf8", function(err, data) {
		if (err) res.status(404).send(err);
		else {
			let studentsArray = JSON.parse(data);
			let index = studentsArray.findIndex(st => Number(st.id) === Number(id));
			if (index>=0) {
				let updatedStudent = {...studentsArray[index],...body};
				studentsArray[index] = updatedStudent;
				let data1 = JSON.stringify(studentsArray);
				fs.writeFile(fname, data1, function (err) {
				if(err) res.status(404).send(err);
				else res.send(updatedStudent);
			});
			}
			else res.status(404).send("No student found");
		}
	});
});

app.delete("/svr/students/:id", function(req,res){
	let body = req.body;
	let id = +req.params.id;
	fs.readFile(fname, "utf8", function(err, data) {
		if (err) res.status(404).send(err);
		else {
			let studentsArray = JSON.parse(data);
			let index = studentsArray.findIndex(st => Number(st.id) === Number(id));
			if (index>=0) {
				let deleteStudent = studentsArray.splice(index, 1);
				let data1 = JSON.stringify(studentsArray);
				fs.writeFile(fname, data1, function (err) {
				if(err) res.status(404).send(err);
				else res.send(deleteStudent);
			});
			}
			else res.status(404).send("No student found");
		}
	});
});*/