import { io } from "socket.io-client";

const socket = io("http://localhost:3000",{
    autoConnect: false,
    withCredentials: true
})

export const connectSocket = function() {
    if(!socket.connected) {
        socket.connect()
    }
}

export const disconnectSocket = function() {
    if(socket.connected) {
        socket.disconnect()
    }
}

export default socket
