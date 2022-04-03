const request = require("supertest")
const app = require('./server')


/* Outline
describe("GET/POST/PUT/DELETE /path", () => {
	test("description", async () => {
		const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
	})      
	
	cookie = login.headers['set-cookie'];
	
		const response = await request(app).whatever.set('cookie', cookie)
		expect(response.statusCode).toBe();
	})
})
*/

///////////////////////////////////
// EVENTS

describe("GET /events ", () => {
  test("No authentication should return 401", async () => {
    const response = await request(app).get("/events")
    expect(response.statusCode).toBe(401);
  })
})

describe("GET /events ", () => {
  test("Get all user's events (authenticated)", async () => {
	  const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
	})
	
	cookie = login.headers['set-cookie'];
	
    const response = await request(app).get("/events").set('cookie', cookie)
    expect(response.statusCode).toBe(200);
  })
})

describe("POST /events GET /events/:eventId and then DELETE /events/:eventId", () => {
  test("Creates a new event, gets it, and then deletes it", async () => {
	  const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
	})      
	
	cookie = login.headers['set-cookie']; 
	
    const response = await request(app).post("/events").send({
		name: "movienight",
		description: "movie night with the boys",
		tags: "movie",
		address: "1333 something lane",
		date: "Monday"
	}).set('cookie', cookie)
	
    expect(response.statusCode).toBe(200);
	
	expect(response.body.newEvent.name).toEqual("movienight");
	expect(response.body.newEvent.description).toEqual("movie night with the boys");
	expect(response.body.newEvent.tags[0]).toEqual("movie");
	expect(response.body.newEvent.address).toEqual("1333 something lane");
	expect(response.body.newEvent.date).toEqual("Monday");
	
	id = response.body.newEvent._id;
	
	const check = await request(app).get(`/events/${id}`).set('cookie', cookie)
	expect(check.statusCode).toBe(200)
	expect(check.body.currEvent.name).toEqual("movienight")
	
	const update = await request(app).put(`/events/${id}`).send({
			name: "movienighttest",
			description: "movie night with the boys",
			tags: "movie",
			address: "1333 something lane",
			date: "Monday"
		}).set('cookie', cookie)
			
		expect(update.statusCode).toBe(200);
		expect(update.body.updatedEvent.name).toEqual("movienighttest")
		expect(update.body.updatedEvent.date).toEqual("Monday")
	
	const del = await request(app).delete(`/events/${id}`).set('cookie', cookie)
	
	expect(del.statusCode).toBe(200)
  })
})

/*describe("POST /events/:eventId/guests/:guestId", () => {
	test("Adds a guest to an event", async () => {
		const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
	})      
	
		cookie = login.headers['set-cookie'];
	
		const response = await request(app).post("/events/6244dd656ebe9a9ac8d30bed/guests/623cf2b92f5edc1694f36fb6").set('cookie', cookie)
		
		expect(response.statusCode).toBe(200);
		expect(response.body.newGuest.lastName).toEqual("Joe")
	})
})*/

/*describe("GET /events/:eventId/guests", () => {
	test("Gets the guests from an event", async () => {
		const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
	})      
	
		cookie = login.headers['set-cookie'];
	//6245d6946ebe9a9ac8d30cf0
		const response = await request(app).get("/events/6244dd656ebe9a9ac8d30bed/guests").set('cookie', cookie)
		
		expect(response.statusCode).toBe(200);
		expect(response.body.guests[0].lastName).toEqual("Joe")
	})
})*/

/*describe("DELETE /events/:eventId/guests/:guestId", () => {
	test("Deletes a guest of an event", async () => {
		const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
	})      
	
		cookie = login.headers['set-cookie'];
	
		const response = await request(app).delete("/events/6244dd656ebe9a9ac8d30bed/guests/623cf2b92f5edc1694f36fb6").set('cookie', cookie)
		
		expect(response.statusCode).toBe(200);
	})
})*/

describe("POST /events/:eventId/guests/:guestId, GET /events/:eventId/guests, DELETE /events/:eventId/guests/:guestId", () => {
	test("Creates an event, adds a guest to it, gets the guest, deletes the guest and event", async () => {
	const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
		})   
		
		cookie = login.headers['set-cookie'];
		
		const newEv = await request(app).post("/events").send({
		name: "testing tasks",
		description: "event to test tasks",
		tags: "test",
		address: "1333 something lane",
		date: "Monday"
		}).set('cookie', cookie)
	
		expect(newEv.statusCode).toBe(200);
		id = newEv.body.newEvent._id
		
		const response = await request(app).post(`/events/${id}/guests/623cf2b92f5edc1694f36fb6`).set('cookie', cookie)
		
		expect(response.statusCode).toBe(200);
		expect(response.body.newGuest.lastName).toEqual("Joe")
		
		const check = await request(app).get(`/events/${id}/guests`).set('cookie', cookie)
		
		expect(check.statusCode).toBe(200);
		expect(check.body.guests[0].lastName).toEqual("Joe")
		
		const del = await request(app).delete(`/events/${id}/guests/623cf2b92f5edc1694f36fb6`).set('cookie', cookie)
		
		expect(del.statusCode).toBe(200);
		
		const delE = await request(app).delete(`/events/${id}`).set('cookie', cookie)
	
		expect(delE.statusCode).toBe(200)
	})
})

/*describe("GET /events/:eventId", () => {
	test("View the details of a specific event", async () => {
		const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
		})      
	
		cookie = login.headers['set-cookie'];
		
		const events = await request(app).post("/events").send({
			name: "test",
			description: "test",
			tags: "test",
			address: "test",
			date: "test"
		}).set('cookie', cookie)
		
		id = events.body.newEvent._id
		
		const response = await request(app).get(`/events/${id}`).set('cookie', cookie)
			
		expect(response.statusCode).toBe(200);
		expect(response.body.currEvent.name).toEqual("test")
		
		
	})
})*/

/*describe("PUT /events/:eventId", () => {
	test("Update a specific event", async () => {
		const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
		})      
	
		cookie = login.headers['set-cookie'];
		
		const response = await request(app).put("/events/6244dd656ebe9a9ac8d30bed").send({
			name: "movienighttest",
			description: "movie night with the boys",
			tags: "movie",
			address: "1333 something lane",
			date: "Monday"
		}).set('cookie', cookie)
			
		expect(response.statusCode).toBe(200);
		expect(response.body.updatedEvent.name).toEqual("movienighttest")
		expect(response.body.updatedEvent.date).toEqual("Monday")
		
		const undo = await request(app).put("/events/6244dd656ebe9a9ac8d30bed").send({
			name: "movienight3",
			description: "movie night with the boys",
			tags: "movie",
			address: "1333 something lane",
			date: "Monday"
		}).set('cookie', cookie)
			
		expect(undo.statusCode).toBe(200);
		expect(undo.body.updatedEvent.name).toEqual("movienight3")
		expect(undo.body.updatedEvent.date).toEqual("Monday")
	})
})*/

/*describe("GET /events/:eventId/tasks", () => {
	test("View the tasks of a specific event", async () => {
		const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
	})      
	
	cookie = login.headers['set-cookie'];
	
		const response = await request(app).get("/events/6245e5397fdb13cd895954e5/tasks").set('cookie', cookie)
		expect(response.statusCode).toBe(200);
	})
})*/

describe("POST /events/:eventId/tasks then PUT, GET, and DELETE /events/:eventId/tasks/:taskId", () => {
	test("Creates an event, adds a task to it, gets it, updates it, then deletes the task and event", async () => {
		const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
		})   
		
		cookie = login.headers['set-cookie'];
		
		const newEv = await request(app).post("/events").send({
		name: "testing tasks",
		description: "event to test tasks",
		tags: "test",
		address: "1333 something lane",
		date: "Monday"
		}).set('cookie', cookie)
	
		expect(newEv.statusCode).toBe(200);
		id = newEv.body.newEvent._id
		
		const response = await request(app).post(`/events/${id}/tasks`).send({
			name: "Bring cookies",
			description: "bring chocolate chip and sugar cookies",
			assignees: "623cf2b92f5edc1694f36fb6"
			
		}).set('cookie', cookie)
		expect(response.statusCode).toBe(200);
		expect(response.body.retval.tasks[0].name).toEqual("Bring cookies")
		
		const check = await request(app).get(`/events/${id}/tasks`).set('cookie', cookie)
		expect(check.statusCode).toBe(200)
		expect(check.body.tasks[0].name).toEqual("Bring cookies")
		
		taskId = response.body.retval.tasks[0]._id
		
		const cTask = await request(app).put(`/events/${id}/tasks/${taskId}`).send({
			name: "test",
			description: "bring chocolate chip and sugar cookies",
			assignees: "623cf2b92f5edc1694f36fb6",
			done: "false"
		}).set('cookie', cookie)
		expect(cTask.statusCode).toBe(200);
		
		const check2 = await request(app).get(`/events/${id}/tasks`).set('cookie', cookie)
		expect(check2.statusCode).toBe(200)
		expect(check2.body.tasks[0].name).toEqual("test")
		
		const del = await request(app).delete(`/events/${id}/tasks/${taskId}`).set('cookie', cookie)
		expect(del.statusCode).toBe(200)
		
		const delE = await request(app).delete(`/events/${id}`).set('cookie', cookie)
	
		expect(delE.statusCode).toBe(200)
	})
})

/*describe("POST /events/:eventId/tasks", () => {
	test("Add a task to a specific event", async () => {
		const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
	})      
	
	cookie = login.headers['set-cookie'];
	
		const response = await request(app).post("/events/6245e5397fdb13cd895954e5/tasks").send({
			name: "Bring cookies",
			description: "bring chocolate chip and sugar cookies",
			assignees: "623cf2b92f5edc1694f36fb6"
			
		}).set('cookie', cookie)
		expect(response.statusCode).toBe(200);
		
	})
	
})*/

/*describe("GET /events/:eventId/tasks/:taskId", () => {
	test("View the details of a task of a specific event", async () => {
		const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
	})      
	
	cookie = login.headers['set-cookie'];
	
		const response = await request(app).get("/events/6245e5397fdb13cd895954e5/tasks/6245f254eadfbef07637aa4d").set('cookie', cookie)
		expect(response.statusCode).toBe(200);
	})
})*/

/*describe("PUT /events/:eventId/tasks/:taskId", () => {
	test("Edit the details of a task of a specific event", async () => {
		const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
	})      
	
	cookie = login.headers['set-cookie'];
	
		const response = await request(app).put("/events/6245e5397fdb13cd895954e5/tasks/6245f254eadfbef07637aa4d").send({
			name: "test",
			description: "bring chocolate chip and sugar cookies",
			assignees: "623cf2b92f5edc1694f36fb6",
			done: "false"
		}).set('cookie', cookie)
		expect(response.statusCode).toBe(200);
		
		const undo = await request(app).put("/events/6245e5397fdb13cd895954e5/tasks/6245f254eadfbef07637aa4d").send({
			name: "Bring cookies",
			description: "bring chocolate chip and sugar cookies",
			assignees: "623cf2b92f5edc1694f36fb6",
			done: "false"
		}).set('cookie', cookie)
			
		expect(undo.statusCode).toBe(200);
	})
})*/

///////////////////////////////////
// USERS
describe("LOGIN /login", () => {
	test("Login a user", async () => {
		const response = await request(app).post("/login").send({
			username: "your",
			password: "mom"
	})
	
	/*const expected = 	{
						  "user": 
						  {
							"emailAuthToken": "1a701401546ed68e3c27a40d8ecf77bc4b28ff3b",
							"_id": "623d37426ca4ddb28c558404",
							"firstName": "your",
							"lastName": "mom",
							"username": "your",
							"phone": "1231231239811",
							"email": "fysuqyse@musiccode.me",
							"emailAuthenticated": true,
							"friends": [],
							"pendingRequests": [],
							"events": [],
							"emailAuthTokenCreation": "2022-03-25T03:30:10.588Z",
							"resetTokenCreation": "2022-03-25T03:30:10.380Z",
							"salt": "999e7382ada3676e228ec5c8429a69d51cdfc5a326845901e05bc5004084ef33",
							"hash": "297a101f64658d600af693a44097800d39db2f9f554cf957d9bfdf35b8570b1704e210e894987a8bb220a091eaa197e7c5d3a1ed29e9a0d1595c3f11995d6e7513c01a837c04815e2b0a6b3a3534b9949793ab4d0f215ab8b2159ae3f0189d153b68ef91b1df07c30dcf29c89f57347323f532df264d1bcd4aef74479359e697377aaee7fdc36da18c9334848222d41e499855ff2dc79f41eda0c988a93a125776a0dd22e62a6fdc48153c4d9450b31d46d994f1dcea84265615e9576caf0b1997efdfe96f237af7f9f2bbfa6be4bc83768224114d154d0dce8840682019b5300e397ea367faafca1ca8033c956b5dcddf264186dccc58562f2a98a0d861df3c0e63933f3c53f011704b3f003e0015d5b520b812140c32932e473c326347f916a742c736d620e347bca67f7b4094097fb8bc68785fbf4bf6d9c796679f0f56123641cee0415f13da2157ee95e76f5575b76dea763c8f9cb162b3d9f3b96ebbab0a2e96a0aa05d0bbddc254221c1544166227f74de17aec0a551f408ab94c76c757453c5821c25bb3cf27ea509f71f8921c6222259dee1a54858531d285aa26591d30607435cfe22233e24d76100b961291cd22e140190997eac9dd99daa0011b535985c98490be7a4c79a8d3fe8b4f818bcf74e2d17fd9e2df749a75c2409dd48cae20f5139ee0d8149cecf741da3523c185baf2129eee556b79eaa7755ccc7f",
							"createdAt": "2022-03-25T03:30:10.513Z",
							"updatedAt": "2022-03-30T20:52:25.749Z",
							"__v": 0
						  }
						}
						
	expect(response.body).toEqual(expected)*/
	expect(response.body.user.firstName).toEqual("your");
	expect(response.body.user.lastName).toEqual("mom");
	expect(response.statusCode).toBe(200);
	})
})

describe("GET /account ", () => {
  test("Get user's account info", async () => {
	  const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
	})
	
	cookie = login.headers['set-cookie'];
	
    const response = await request(app).get("/account").set('cookie', cookie)
    expect(response.statusCode).toBe(200);
	expect(response.body.user.firstName).toEqual("your")
	expect(response.body.user.lastName).toEqual("mom")
  })
})

describe("GET /friends ", () => {
  test("Get user's friends", async () => {
	  const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
	})
	
	cookie = login.headers['set-cookie'];
	
    const response = await request(app).get("/friends").set('cookie', cookie)
    expect(response.statusCode).toBe(200);
  })
})

describe("POST /friends/:friendId GET it and then DELETE", () => {
  test("Add a friend and then delete them", async () => {
	  const login = await request(app).post("/login").send({
			username: "your",
			password: "mom"
	})
	
	cookie = login.headers['set-cookie'];
	
    const response = await request(app).post("/friends/623cf2b92f5edc1694f36fb6").set('cookie', cookie)
    expect(response.statusCode).toBe(200);
	
	const check = await request(app).get("/friends/623cf2b92f5edc1694f36fb6").set('cookie', cookie)
    expect(check.statusCode).toBe(200);
	
	const del = await request(app).delete("/friends/623cf2b92f5edc1694f36fb6").set('cookie', cookie)
    expect(del.statusCode).toBe(200);
  })
})