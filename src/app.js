const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path")

let port = process.env.PORT || 3418
// app.listen(port, ()=> console.log("Servidor corriendo en el puerto "+port))

const http = require('http');
const server = http.createServer(app);
server.listen(port)

const socketIo = require("socket.io");
const io = new socketIo.Server(server);

// let mensajes = [];
let totalCount = 0;
let actualCount = 0;
let maxCount = {
    count: 0,
    time: Date.now()
};
io.on('connection', async (socket) => {
    console.log("Un usuario está dentro");

    socket.on('new-guest', () => {
        // console.log(io.sockets.sockets);
        actualCount = actualCount + 1;
        totalCount = totalCount + 1;
        if (actualCount > maxCount.count) {
            console.log("Se superó el record");
            maxCount.count = actualCount;
            maxCount.time = Date.now();
        };
        // console.log({total: totalCount, actual: actualCount , max: maxCount});
        io.sockets.emit("guest-list", {total: totalCount, actual: actualCount , max: maxCount});
    })

    socket.on("disconnect", () => {
        actualCount -= 1;
        io.sockets.emit("guest-list", {total: totalCount, actual: actualCount , max: maxCount});
    })
    
    socket.on("new-content", (data) => {
        io.sockets.emit("new-content", data);
    })
    // socket.on("messages-list", () =>{
    //     io.sockets.emit("messages", mensajes);
    // })

    // socket.on("new-message", (mensaje) => {
    //     mensajes.push({
    //         mensaje: mensaje.texto,
    //         emisor: mensaje.emisor
    //     })
    //     io.sockets.emit("messages", mensajes);
    // })
});

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../public")));

app.use("/", require("./router/index"));
app.use("/sorteo", require("./router/index"));
app.use("/brackets", require("./router/index"));
app.use("/handbook", require("./router/index"));

app.use((req,res,next) => {
    return res.redirect("/");
})
