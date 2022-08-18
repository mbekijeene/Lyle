const express = require('express');
const mongoose = require('mongoose');
const dbConfig = require('./config/db.config'); 

const auth = require ( './middlewares/auth' );
const errors = ('./middlewares/errors');

const unless = require('express-unless');
const { application } = require('express');

const app = express
mongoose.promise = global.promise;
mongoose
.connect(dbConfig.db,{
   usNewUrlParser: true,
    useunifiedTopology: true,
})
.then(
  () => {
    console.log("Dtabase connected");
},  
(error) => {
 console.log("Database can't be connected: " + error);
}
);

auth.authenticatetoken.unless = unless;
app.use(
   auth.authenticatetoken.unless({
        path: [
            { url : "/users/login", methods:["POST"] },
            { url : "/users/register", methods:["POST"] },
          ],
       })
);

app.use(express.json ());

app.use("/user",require("./routes/users.routes"));

app.use(errors.errorHandler);

app.listen(process.env.part || 4000, function () {
console.log("Ready to Go")
});