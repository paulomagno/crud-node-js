// Load Mongoose
const mongoose  = require('mongoose');

// Load Variabels of environment
require('dotenv').config({path:'variables.env'});

// Database connection
mongoose.connect(process.env.DATABASE, { 
    useNewUrlParser: true , 
    useUnifiedTopology: true ,
    useFindAndModify : false,
});

// Use global promise 
mongoose.Promise = global.Promise;

mongoose.connection.on('error', (error) => {
    console.log("ERRO : " + error.message);
});

// Load models
require('./models/Post');

// App Settings
const app = require('./app');
app.set('port',process.env.PORT || 7777);

// Server Settings
const server = app.listen(app.get('port'), () => {
    console.log(" Servidor rodando na porta : " + server.address().port);
});