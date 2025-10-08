require("dotenv").config()
const bodyParser = require("body-parser")
const express = require('express')
const helmet = require('helmet')
const cors = require('cors');
const { xss } = require("express-xss-sanitizer");
const { requestLogger } = require("./middleware/logger");
const { allowedOrigins } = require("./config/allowed_origins");
const path = require("path");
const http = require('http');

const app = express()
const server = http.createServer(app);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      imgSrc: [`'self'`, 'https:', 'data:', 'blob:']
    }
  }
}))
app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({ origin: allowedOrigins, exposedHeaders: 'Content-Type' }))
app.use(xss())
app.use(requestLogger)

// master routes
const usersRoutes = require('./features/routes/users')
const roomsRoutes = require('./features/routes/rooms')
const linenTypesRoutes = require('./features/routes/linen_types')

// transaction routes
const linenRoutes = require('./features/routes/linens')
const washingRoutes = require('./features/routes/washings')
const iotRoutes = require('./features/routes/iot')

// report and notif routes
const dashboardRoutes = require('./features/routes/dashboards')
const notifRoutes = require('./features/routes/notifs')

app.get('/api/version', (req, res) => { return res.status(200).send({ build: process.env.BUILD_VERSION, api: "0.0.1" }) })
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/rooms', roomsRoutes);
app.use('/api/v1/linen_types', linenTypesRoutes);

app.use('/api/v1/linens', linenRoutes)
app.use('/api/v1/washings', washingRoutes)
app.use('/api/v1/iot', iotRoutes)

app.use('/api/v1/dashboards', dashboardRoutes)
app.use('/api/v1/notifs', notifRoutes)

// serve react build
app.use('/', express.static(path.join(__dirname, "build")));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.get('*', (req, res) => {
//   res.status(404).json({ message: '[Not Found]' })
// })

// SOCKET IO
const { Server } = require("socket.io");
const { checkInRoom, checkOutRoom } = require("./features/websockets/washings");
const { notificationSocket, setNotifServerIO, notifRunner } = require("./features/websockets/notifs");

const io = new Server(server, {
  maxHttpBufferSize: 10e6, // 10 mb
  cors: { origin: allowedOrigins, exposedHeaders: 'Content-Type' },
  transports: ['websocket', 'polling']
});

io.of("/check_in").on("connection", checkInRoom);
io.of("/check_out").on("connection", checkOutRoom)

setNotifServerIO(io.of("/notification"))
io.of("/notification").on("connection", notificationSocket)
notifRunner() // start notif runner

server.listen(process.env.APP_PORT, () => {
  console.log(`SERVER IS RUNNING ${process.env.APP_ENV} MODE ON ${process.env.APP_PORT}`)
})
