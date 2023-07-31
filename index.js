const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require("http");
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');


const UserModel  = require('./src/models/Users');
const userRouter = require('./src/routes/users');
const commentRouter = require('./src/routes/comments');


const app = express();
const server = http.createServer(app);
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

//Add Admin user to the Database
const admin = {
  username : process.env.USERNAME,
  email : process.env.EMAIL,
  password : process.env.PASSWORD
}

const CORS_ORIGIN = process.env.CORS_ORIGIN;
const DATABASE_URL = process.env.DATABASE_URL;
const dbName = "MyPortfolio";
const PORT = process.env.PORT || 5000;


const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === CORS_ORIGIN || origin.startsWith(CORS_ORIGIN)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

//Middlewares
app.use(express.json());
app.use(cors(corsOptions));


// auth is an Endpoint
app.use("/auth" , userRouter );
app.use("/comment" , commentRouter);


//Connecting to the Local Database
//const path = "mongodb://localhost:27017/MyPortfolio";
const path = `${DATABASE_URL}/${dbName}?retryWrites=true&w=majority`;
mongoose.connect( path , {
  useNewUrlParser : true,
  useUnifiedTopology: true,
  })
.then(() => console.log("Connected to MongoDB Database:"))
.catch((err) => console.log("Error while connecting Database = ",err))



const AddAdmin = async() => {
  const user = await UserModel.findOne({email : admin.email});
  if(!user){
    const hashedPassword = await bcrypt.hash(admin.password , 10);
    const addAdmin = new UserModel({
      username : admin.username,
      email : admin.email,
      password : hashedPassword
    })
    await addAdmin.save();
  }
}
AddAdmin();

//Connecting to the express server
server.listen(PORT , ()=> console.log(`Server is Listening on Port ${PORT}`));
