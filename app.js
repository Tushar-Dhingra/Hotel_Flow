if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const session = require('express-session');
const MongoStore = require('connect-mongo');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError')
const ejsMate = require('ejs-mate')
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')

const userRoutes = require('./routes/users')
const hotelRoutes = require('./routes/hotels')
const reviewRoutes = require('./routes/reviews')

const app = express();

// const dburl = process.env.DB_URL
const dburl = 'mongodb://127.0.0.1:27017/hotel'

mongoose
    .connect(dburl)
    .then(()=>console.log("Database Connected!"))
    .catch(err=>console.log(err))

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dburl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function(e){
    console.log("SESSION ERROR", e)
})

const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/hotels', hotelRoutes);
app.use('/hotels/:id/reviews', reviewRoutes)

app.get('/', (req,res)=>{
    res.render('home')
})



app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404))
})

app.use((err, req, res, next)=>{
    const {statusCode =500} = err;
    if(!err.message)  err.message = "Something went wrong";
    res.status(statusCode).render('error', {err})
})

app.listen(8000, ()=>{
    console.log("Listening on port 8000")
})
