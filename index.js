// mysql
// var mysql = require('mysql');
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'message-app'
// });
// connection.connect();
const express = require('express');
const socket = require('socket.io');
//app setup
const app = express();
var server = app.listen(4000, "0.0.0.0", function() {
    console.log('listening to p4000');
});
app.use(express.static('public'));
// socket setup
var io = socket(server);
io.on('connect', function(socket) {
    var seshid = socket.id;
    // connection.query('SELECT * from messages ORDER BY id DESC LIMIT 30', function(err, rows, fields) {
        // if (!err) {
        //     io.emit('reply', rows)
        //     console.log(rows[0].msg_from + '- result');
        // } else console.log('Error while performing Query.');
    // });
    socket.on('message', function(data) {
        io.emit('message', data)
        // send to db
        // var sql = `INSERT INTO messages (msg_from, msg_content) VALUES ('${data.user}', '${data.content}')`;
        // connection.query(sql, function(err, result) {
        //     if (err) console.log('error');
        //     console.log("1 record inserted");
        // });
    });
    // istyping
    socket.on('istyping', () => {
        io.emit('istyping');
    });
});