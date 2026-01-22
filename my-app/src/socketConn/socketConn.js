import { io } from "socket.io-client";
import {
  updateCursorPosition,
  removeCursorPosition,
} from "../CursorOverlay/cursorSlice";
import { store } from "../store/store";
import { setElements, updateElement } from "../Whiteboard/whiteboardSlice";

let socket;

export const connectWithSocketServer = (roomId) => {
  const URL =
    process.env.NODE_ENV === "production"
      ? window.location.origin
      : "http://localhost:3003";

  socket = io(URL, {
    transports: ["websocket"],
    query: {
      roomId,
    },
  });

  socket.on("connect", () => {
    console.log("connected to socket.io server");
  });

  socket.on("whiteboard-state", (elements) => {
    store.dispatch(setElements(elements));
  });

  socket.on("element-update", (elementData) => {
    store.dispatch(updateElement(elementData));
  });

  socket.on("whiteboard-clear", () => {
    store.dispatch(setElements([]));
  });

  socket.on("cursor-position", (cursorData) => {
    store.dispatch(updateCursorPosition(cursorData));
  });

  socket.on("user-disconnected", (disconnectedUserId) => {
    store.dispatch(removeCursorPosition(disconnectedUserId));
  });
};

export const emitElementUpdate = (elementData) => {
  socket.emit("element-update", elementData);
};

export const emitClearWhiteboard = () => {
  socket.emit("whiteboard-clear");
};

export const emitCursorPosition = (cursorData) => {
  socket.emit("cursor-position", cursorData);
};
