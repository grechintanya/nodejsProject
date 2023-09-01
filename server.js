require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/DBconn');
const PORT = process.env.PORT || 3500;

connectDB();

const allowedOrigins = ['http://localhost:4200', 'https://www.thunderclient.com'];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
};

const credentials = (req, res, next) => {
    const origin = req.header.origin;
    if (allowedOrigins.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());    

app.use('/auth', require('./routes/auth'));
app.use('/courses', require('./routes/courses'));
app.use('/authors', require('./routes/authors'));


app.get('/*', (req, res) => {
    res.status(404);
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})
