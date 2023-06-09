const express = require('express')

var bodyParser = require('body-parser')

const app = express()
const port = 5000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const { getUsers, Register, Login, Logout, addUser } = require("./controller/UserController");
const { verifyToken } = require("./middleware/VerifyToken")
const { addCars, getCars, editCar, deleteCar, getDeletedCars } = require('./controller/CarController')
const { isAdmin, isMember, isSuperAdmin } = require('./middleware/CheckRole')
const prefix = "/v1/api/";

app.get('/', (req, res) => {
    res.send('Hello World!')
})

//user apis
app.get(prefix + "users", verifyToken, getUsers);
app.post(prefix + "register", Register);
app.post(prefix + "login", Login);
app.delete(prefix + "logout", Logout);

// Car API
app.get(prefix + "getCars", verifyToken, getCars);
app.get(prefix + "getDeletedCars", verifyToken, isAdmin, getDeletedCars);
app.post(prefix + "addCar", verifyToken, isAdmin, addCars);
app.put(prefix + "editCar/:id", verifyToken, isAdmin, editCar);
app.put(prefix + "deleteCar/:id", verifyToken, isAdmin, deleteCar);

app.post(prefix + "addUser", verifyToken, isSuperAdmin, addUser);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})