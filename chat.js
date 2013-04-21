var express = require('express')
  , app     = require('express')()
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server)
  , count   = 0;

function getDate()
{
    var date = new Date();
    
    var   day   = date.getDate()
        , month = date.getMonth() + 1
        , year  = date.getFullYear()
        , hour  = date.getHours()
        , min   = date.getMinutes()
        , sec   = date.getSeconds();

    return day+'-'+month+'-'+year+' '+hour+':'+min+':'+sec;
}

server.listen(1026);

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res)
{
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket)
{
    count++;
    io.sockets.emit('count', {users: count});

    console.log(getDate() + ' User connected');

    socket.on('disconnect', function ()
    {
        console.log(getDate() + ' User disconnected');
        count--;
        
        io.sockets.emit('count', {users: count});
    });
});
