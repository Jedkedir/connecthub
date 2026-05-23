import { io } from "socket.io-client"

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? "http://localhost:5000"

let socket = null

export function initSocket(userId) {
  if (socket?.connected) return socket

  socket = io(API_ORIGIN, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    query: {
      userId: userId.toString(),
    },
  })
  socket.on("connect", () => {
    console.log("Socket connected", socket.id)
  })

  socket.on("disconnect", () => {
    console.log("Socket disconnected")
  })

  socket.on("error", (error) => {
    console.error("Socket error:", error)
  })

  return socket
}

export function getSocket() {
  return socket
}

export function setSocket(nextSocket) {
  socket = nextSocket
  return socket
}

export function disconnectSocket() {
  if (socket?.disconnect) {
    socket.disconnect()
  }

  socket = null
}
