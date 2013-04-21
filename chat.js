var express = require('express')
  , app     = require('express')()
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server)
  , count   = 0
  , users   = [];

function getDate()
{
    var date = new Date()
    
    var   day   = date.getDate()
        , month = date.getMonth() + 1
        , year  = date.getFullYear()
        , hour  = date.getHours()
        , min   = date.getMinutes()
        , sec   = date.getSeconds();

    return day+'-'+month+'-'+year+' '+hour+':'+min+':'+sec;
}

function isset(variable)
{
    if(typeof variable != "undefined")
        return true;
    else
        return false;
}

server.listen(1026);

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res)
{
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket)
{
    var user = {};
    
    console.log(getDate() + ' User connected');
    socket.emit('connected');
    
    count++;
    io.sockets.emit('count', {users: count});

    socket.on('name', function(data)
    {
        user.name = data.name;
        users.push(data.name);
        
        io.sockets.emit('users', {users: users});
    });

    socket.on('disconnect', function()
    {
        console.log(getDate() + ' User disconnected');
        count--;
        
        // Remove user name from user list if they gave us one
        if(isset(user.name))
        {
            var index = users.indexOf(user.name);
            
            if(index != -1)
                delete users[index];
        }
        
        io.sockets.emit('count', {count: count});
        io.sockets.emit('users', {users: users});
    });
});
