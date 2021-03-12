require("dotenv").config();

const express = require("express");
const path = require("path"); // core module or inbuild module.

const app = express(); // express() returns the object of express , which is stored in app variable.

// CONFIGURING THE TEMPLATE ENGINE
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");



const PORT = process.env.PORT || 3000;
// process.env :  it is stored inside node process
// if there exists a varible PORT ,we will use that.
// if not present , we will run it on 3000.




const mongoose = require("mongoose");

const session = require("express-session");

const flash = require("express-flash");


// var MongoDbStore = require('connect-mongo')(session);

// var MongoDbStore = require('connect-mongodb-session')(session);
const MongoDbStore = require("connect-mongo").default;

const passport = require('passport')

const Emitter = require('events')




//Database Connection
const url = "mongodb+srv://xyz:xyz@cluster0.odtx5.mongodb.net/item?retryWrites=true&w=majority"


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
const connection = mongoose.connection;



connection.once('open', () => {
    console.log('Database Connected...');
}).catch(err => {
    console.log('Connection Failed... ');
});







// const url = "mongodb+srv://xyz:xyz@cluster0.odtx5.mongodb.net/item?retryWrites=true&w=majority"
// mongoose.connect(url, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useUnifiedTopology: true,
//         useFindAndModify: true,

//     },
//     console.log('Database connected...')
// );

// const url = "mongodb+srv://admin:anj1234@cluster0.8jt9w.mongodb.net/foodie?retryWrites=true&w=majority";






// Session Store
let mongoStore = MongoDbStore.create({
    mongoUrl: url,
    collectionName: "sessions",
});



// let mongoStore = MongoDbStore.create({
//     mongooseConnection: connection,
//     collection: 'sessions'
// })


//Event Emitter

const eventEmitter = new Emitter()

app.set('eventEmitter', eventEmitter)





// Session configuration 
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: mongoStore,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, //cookie valid for 24 hours
    })
);

// Passport Config
const passportInit = require('./app/config/passport')
passportInit(passport);
app.use(passport.initialize())
app.use(passport.session())




app.use(flash());


//ASSETS  ---> passing our static folder ---> public ---> to make it take css also to browser server.
app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }))

app.use(express.json())


//global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()

})


// SET TEMPLATE ENGINE
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"))
app.set("view engine", "ejs");



//routes
require("./routes/web")(app);
app.use((req, res) => {
    res.status(404).send('<h1>404 PAGE NOT FOUND</h1>')
})




const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});



//socket




const io = require('socket.io')(server)
io.on('connection', (socket) => {
    //Join
    console.log(socket.id)
    socket.on('join', (orderId) => {
        console.log(orderId)
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})