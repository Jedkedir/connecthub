let socket = null

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
