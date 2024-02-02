require('dotenv').config();
const http = require("http");
require("./config/dbConnect")
const app = require('./app/app');

const PORT = process.env.PORT || 2026

//server
const server = http.createServer(app)
server.listen(PORT, console.log(`Server is running on port ${PORT}`));


// wLCN3I8xD7pVJwkm