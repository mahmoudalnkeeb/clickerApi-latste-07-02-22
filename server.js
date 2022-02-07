const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');
const app = express();

//connect database

//here u put ur moongose connect data
mongoose.connect(
    'mongodb+srv://Anwar:PASSWORDDB@hassanat.fvbzq.mongodb.net/hassanat?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

//midllewares
const corsOptions = {
    optionsSuccessStatus: 200,
    origin: '*',
};

app.use(express.urlencoded({ extended: false }));
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(cors(corsOptions));
app.use(logger);
app.use(errorHandler);
routes(app);

app.listen(3000);
