let express = require('express')
let app = express()
let server = require('http').createServer(app)
let io = require('socket.io').listen(server)

const STATUS_SUCCESS = ''

server.listen(3000)
//Mysql config
let mysql = require('mysql')
let con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'superShipper'
})

con.connect(function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('connected!!!')
  }
})
//socket
let clients = {}
io.sockets.on('connection', function (socket) {
  let userId = socket.handshake.query.token
  console.log('user %s connected', userId)
  let param = [userId]
  let sql = 'SELECT id, firstName, lastName, avatar FROM User WHERE id = ?'
  con.query(sql, param, function (err, result) {
    let data = {
      'user': result[0]
    }
    socket.broadcast.emit('onUserOnline', data)
  })
  clients[userId] = {
    'socket': socket.id
  }
  sql = 'SELECT Rooms.id FROM Rooms INNER JOIN RoomUsers ON Rooms.id = RoomUsers.idRoom WHERE RoomUsers.idUser = ?'
  param = [userId]
  con.query(sql, param, function (err, result) {
    result.forEach(room => {
      socket.join(room.id)
    })
  })

  socket.on('sendMessage', function (data) {
    socket.broadcast.to(data.roomId).emit('receiverMessage', data)
  })

  socket.on('getUsersOnline', function (data) {
    let mineId = socket.handshake.query.token
    let userIds = []
    for (let name in clients) {
      if (name != mineId) {
        userIds.push(parseInt(name))
      }
    }
    let param = [userIds]
    let sql = 'SELECT id, firstName, lastName, avatar FROM User WHERE id IN (?)'
    con.query(sql, param, function (err, result) {
      let res = {
        'users': result
      }
      socket.emit('getUsersOnline', res)
    })
  })

  socket.on('news', async function (data) {
    io.emit('news', data)
    if (data && data.news) {
      try{
		  data = JSON.parse(data.news)
	      const id = data.idNews
	      const idUser = data.user.id
	      const description = data.description
	      const image = data.imageView
	      const type = data.type || 1
	      const createdAt = new Date()
	      const sqlInsertNews = 'INSERT INTO News (id, idUser, description, image, type, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
	      const paramNews = [id,idUser,description,image,type,createdAt]
	      const result = await query(sqlInsertNews, paramNews)
	      console.log('result create news: ',result)
      }catch(err) {

      }
    }
  })

  socket.on('likeNews',async function (data) {
    io.emit('likeNews', data)
    if (data && data.news && data.user) {
      try{
        const news = JSON.parse(data.news)
        const userLike = JSON.parse(data.user)
        const idNews = news.idNews
        const idUser = userLike.id
        const sqlInsert = 'INSERT INTO LikeNews (idNews, idUser) VALUES (?, ?)'
        const sqlDelete = 'DELETE FROM LikeNews WHERE idNews = ? AND idUser = ?'
        const param = [idNews,idUser]
        let resultQuery = ''
        query('SELECT * FROM LikeNews').then(result => {
          let isExists = false
          for (let i =0; i < result.length; i++) {
            if (result[i] && result[i].idNews === idNews && result[i].idUser === idUser) {
              isExists = true;
              break
            }
          }
          if (isExists) {
            resultQuery = query(sqlDelete,param)
          } else {
            resultQuery = query(sqlInsert,param)
          }
        })
      }catch(err) {

      }
    }
  })

  socket.on('comment', async function (data) {
    io.emit('comment', data)
    if (data && data.comment) {
      try{
        data = JSON.parse(data.comment)
        const id = data.idComment
        const idNews = data.idNews
        const idUser = data.user.id
        const comment = data.comment
        const createdAt = new Date()
        const sqlInsertComment = 'INSERT INTO Comment (id, idNews, idUser, comment, createdAt) VALUES (?, ?, ?, ?, ?)'
        const paramComment = [id,idNews,idUser,comment,createdAt]
        const result = await query(sqlInsertComment, paramComment)
      }catch(err) {

      }
    }
  })


  socket.on('turnOnCamera', function (data) {
    socket.broadcast.to(data.roomId).emit('turnOnCamera', data)
  })

  socket.on('call', function (data) {
    socket.broadcast.to(data.roomId).emit('call', data)
  })

  socket.on('callContent', function (data) {
    socket.broadcast.to(data.roomId).emit('callContent', data)
  })

  socket.on('callAccept', function (data) {
    socket.broadcast.to(data.roomId).emit('callAccept', data)
  })

  socket.on('callBusy', function (data) {
    socket.broadcast.to(data.roomId).emit('callBusy', data)
  })

  socket.on('callStop', function (data) {
    socket.broadcast.to(data.roomId).emit('callStop', data)
  })

  //Removing the socket on disconnect
  socket.on('disconnect', function () {
    let sender = socket.handshake.query.token
    console.log('user %s disconnected', sender)
    let param = [sender]
    let sql = 'SELECT id, firstName, lastName, avatar FROM User WHERE id = ?'
    con.query(sql, param, function (err, result) {
      let data = {
        'user': result[0]
      }
      socket.broadcast.emit('onUserOffline', data)
    })
    for (let name in clients) {
      if (clients[name].socket === socket.id) {
        delete clients[name]
        break
      }
    }
  })
})

//Api
let bodyParser = require('body-parser')
app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))
let body = {}

app.get('', function (req, res) {
  body.status = 200
  body.message = STATUS_SUCCESS
  body.data = 'Server OK!'
  res.send(body)
})

app.post('/user/login', function (req, res) {
  let sql = 'SELECT id, firstName, lastName, createdAt, avatar FROM User WHERE userName = ? and password = ?'
  let param = [req.body.userName, req.body.password]
  con.query(sql, param, function (err, result) {
    if (result != null && result != '') {
      body.status = 200
      body.message = STATUS_SUCCESS
      body.data = result[0]
      res.send(body)
    } else {
      body.status = 201
      body.message = 'userName or password is wrong'
      body.data = null
      res.send(body)
    }
  })
})

app.post('/user/register', function (req, res) {
  let sql = 'SELECT * FROM User WHERE userName = ?'
  let param = [req.body.userName]
  con.query(sql, param, function (err, result) {
    if (result == null || result == '') {
      sql = 'INSERT INTO User (userName, password, firstName, lastName) VALUES (?, ?, ?, ?)'
      param = [req.body.userName, req.body.password, req.body.firstName, req.body.lastName]
      con.query(sql, param, function (err, result) {
        if (err) {
          body.status = 201
          body.message = err
          body.data = null
          res.send(body)
        } else {
          body.status = 200
          body.message = STATUS_SUCCESS
          body.data = {
            'id': result.insertId
          }
          res.send(body)
        }
      })
    } else {
      body.status = 201
      body.message = 'Duplicate userName'
      body.data = null
      res.send(body)
    }
  })
})

app.post('/user', function (req, res) {
  let params = [
    { firstName: req.body.firstName },
    { lastName: req.body.lastName },
    { avatar: req.body.avatar },
    { id: req.headers.authorization }
  ]
  let sql = 'UPDATE User SET ?, ?, ? WHERE ?'
  con.query(sql, params, function (err, result) {
    body.data = null
    if (err) {
      body.status = 201
      body.message = err
      res.send(body)
    } else {
      body.status = 200
      body.message = STATUS_SUCCESS
      res.send(body)
    }
  })
})

app.get('/news', async function (req, res) {
  let resNews = []
  const sqlGetNews = 'SELECT * FROM News'
  const sqlGetUser = `SELECT * FROM User WHERE id = ?`
  const sqlGetListLikeNews = `SELECT * FROM LikeNews WHERE idNews = ?`
  const sqlGetListComment = `SELECT * FROM Comment WHERE idNews = ?`
  const  sqlGetUserLike = `SELECT DISTINCT * FROM User INNER JOIN LikeNews ON LikeNews.idUser = User.id WHERE LikeNews.idNews = ?`
  let reqNews = await query(sqlGetNews)
  for (let i = 0; i < reqNews.length; i++) {
    const idOwner = reqNews[i].idUser
    const idNews = reqNews[i].id
    const owner = await query(sqlGetUser, idOwner)
    const requestLikeNews = await query(sqlGetListLikeNews, idNews)
    const requestComment = await query(sqlGetListComment, idNews)
    const requestUserLike = await query(sqlGetUserLike, idNews)
    let news = {
      'idNews': idNews,
      'user': owner[0],
      'description': reqNews[i].description,
      'imageView': reqNews[i].image,
      'isLike': requestLikeNews.length || 0,
      'usersLike': requestUserLike || [],
      'countComment': requestComment.length || 0,
      'createdAt': reqNews[i].createdAt,
    }
    resNews.push(news)
    if (reqNews.length === resNews.length) {
    body.status = 200
    body.message = STATUS_SUCCESS
    body.data =  resNews
    res.send(body)
    }
  }
})

app.get('/comment', async function (req, res) {
  let resComment = []
  const sqlGetComment = 'SELECT * FROM Comment'
  let reqComment = await query(sqlGetComment)
  for (let i = 0; i < reqComment.length; i++) {
    const sqlGetUser = `SELECT * FROM User WHERE id = ?`
    const owner = await query(sqlGetUser, reqComment[i].idUser)
    let news = {
      'idComment': reqComment[i].id,
      'user': owner[0],
      'comment': reqComment[i].comment,
      'idNews': reqComment[i].idNews,
      'createdAt': reqComment[i].createdAt,
    }
    resComment.push(news)
    if (resComment.length === reqComment.length) {
      body.status = 200
      body.message = STATUS_SUCCESS
      body.data =  resComment
      res.send(body)
    }
  }
})

app.get('/rooms', async function (req, res) {
  let sql = 'SELECT id, roomName, avatar, type FROM Rooms INNER JOIN RoomUsers ON Rooms.id = RoomUsers.idRoom WHERE RoomUsers.idUser = ?'
  let param = [req.headers.authorization]
  let result = await query(sql, param)
  let rooms = []
  sql = 'SELECT User.id, userName, firstName, lastName, avatar FROM User INNER JOIN RoomUsers ON User.id = RoomUsers.idUser WHERE RoomUsers.idRoom = ?'
  for (let i = 0; i < result.length; i++) {
    param = [result[i].id]
    let users = await query(sql, param)
    let room = {
      'roomId': result[i].id,
      'roomName': result[i].roomName,
      'avatar': result[i].avatar,
      'type': result[i].type,
      'users': users
    }
    rooms.push(room)
  }
  body.status = 200
  body.message = STATUS_SUCCESS
  body.data = rooms
  res.send(body)
})

app.post('/room', async function (req, res) {
  let sql = 'INSERT INTO Rooms (roomName, type) VALUES (?, ?)'
  let param = [req.body.roomName, req.body.type]
  let result = await query(sql, param)
  let roomId = result.insertId
  let ids
  if (!Array.isArray(req.body.ids)) {
    ids = []
    ids.push(req.body.ids)
  } else {
    ids = req.body.ids

  }
  ids.push(req.headers.authorization)
  param = ids.map(id => {
    return [
      parseInt(id),
      roomId
    ]
  })
  ids.forEach(id => {
    if (clients[id]) {
      io.sockets.connected[clients[id].socket].join(roomId)
    }
  })

  sql = 'SELECT User.id, User.userName, User.firstName, User.lastName, User.avatar FROM User INNER JOIN RoomUsers ON User.id = RoomUsers.idUser WHERE RoomUsers.idRoom = ?'
  param = [roomId]
  body.status = 200
  body.message = STATUS_SUCCESS
  body.data = {
    'roomId': roomId,
    'roomName': req.body.roomName,
    'type': req.body.type,
    'users': await query(sql, param)
  }
  onCreatedRoom(req.headers.authorization, body.data)
  res.send(body)

})

app.get('/room/:id', async function (req, res) {
  const roomId = req.params.id
  let sql = 'SELECT * FROM Rooms WHERE id = ?'
  let param = [roomId]
  let rooms = await query(sql, param)
  if (rooms.length === 0) {
    body.status = 201
    body.message = 'Room does not exist'
    body.data = {}
  } else {
    let room = {}
    room.roomId = rooms[0].id
    room.type = rooms[0].type
    room.roomName = rooms[0].roomName
    sql = 'SELECT User.id, User.userName, User.firstName, User.lastName, User.avatar FROM User INNER JOIN RoomUsers ON User.id = RoomUsers.idUser WHERE RoomUsers.idRoom = ?'
    param = [roomId]
    room.users = await query(sql, param)
    body.status = 200
    body.message = STATUS_SUCCESS
    body.data = room
  }
  res.send(body)

})

function query (sql, param) {
  return new Promise((resolve, reject) => {
    con.query(sql, param, function (err, result) {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

function onCreatedRoom (sender, room) {
  io.sockets.connected[clients[sender].socket].broadcast.to(room.roomId).emit('onCreatedRoom', room)
}
