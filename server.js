const express = require('express');
const app = express();
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3500;

const whiteList = ['http://localhost:4200', 'https://www.thunderclient.com'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());    

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
//app.use(verifyJWT);
app.use('/courses', require('./routes/courses'));
app.use('/authors', require('./routes/authors'));


app.get('/*', (req, res) => {
    res.status(404);
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

