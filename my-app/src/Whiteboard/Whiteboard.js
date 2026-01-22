import React, {
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import rough from "roughjs/bundled/rough.esm";
import { v4 as uuid } from "uuid";

import Menu from "./Menu";
import { connectWithSocketServer } from "../socketConn/socketConn";
import { emitCursorPosition } from "../socketConn/socketConn";

import { actions, cursorPositions, toolTypes } from "../constants";
import {
  createElement,
  updateElement,
  drawElement,
  adjustmentRequired,
  adjustElementCoordinates,
  getElementAtPosition,
  getCursorForPosition,
  getResizedCoordinates,
  updatePencilElementWhenMoving,
} from "./utils";

import { updateElement as updateElementInStore } from "./whiteboardSlice";

let emitCursor = true;
let lastCursorPosition;

const Whiteboard = () => {
  const { roomId } = useParams();

  const canvasRef = useRef(null);
  const textAreaRef = useRef(null);

  const toolType = useSelector((state) => state.whiteboard.tool);
  const elements = useSelector((state) => state.whiteboard.elements);

  const [action, setAction] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  const dispatch = useDispatch();

  /* ================= SOCKET CONNECT ================= */
  useEffect(() => {
    if (roomId) {
      connectWithSocketServer(roomId);
    }
  }, [roomId]);

  /* ================= CANVAS RESIZE FIX ================= */
  useEffect(() => {
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  /* ================= DRAW ELEMENTS ================= */
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);
    elements.forEach((element) => {
      drawElement({ roughCanvas, context: ctx, element });
    });
  }, [elements]);

  /* ================= MOUSE DOWN ================= */
  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;

    if (selectedElement && action === actions.WRITING) return;

    switch (toolType) {
      case toolTypes.RECTANGLE:
      case toolTypes.LINE:
      case toolTypes.PENCIL: {
        const element = createElement({
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          toolType,
          id: uuid(),
        });

        setAction(actions.DRAWING);
        setSelectedElement(element);
        dispatch(updateElementInStore(element));
        break;
      }

      case toolTypes.TEXT: {
        const element = createElement({
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          toolType,
          id: uuid(),
        });

        setAction(actions.WRITING);
        setSelectedElement(element);
        dispatch(updateElementInStore(element));
        break;
      }

      case toolTypes.SELECTION: {
        const element = getElementAtPosition(clientX, clientY, elements);

        if (
          element &&
          (element.type === toolTypes.RECTANGLE ||
            element.type === toolTypes.TEXT ||
            element.type === toolTypes.LINE)
        ) {
          setAction(
            element.position === cursorPositions.INSIDE
              ? actions.MOVING
              : actions.RESIZING
          );

          setSelectedElement({
            ...element,
            offsetX: clientX - element.x1,
            offsetY: clientY - element.y1,
          });
        }

        if (element && element.type === toolTypes.PENCIL) {
          setAction(actions.MOVING);

          setSelectedElement({
            ...element,
            xOffsets: element.points.map((p) => clientX - p.x),
            yOffsets: element.points.map((p) => clientY - p.y),
          });
        }
        break;
      }

      default:
        break;
    }
  };

  /* ================= MOUSE MOVE ================= */
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;

    lastCursorPosition = { x: clientX, y: clientY };

    if (emitCursor) {
      emitCursorPosition({ x: clientX, y: clientY });
      emitCursor = false;

      setTimeout(() => {
        emitCursor = true;
        emitCursorPosition(lastCursorPosition);
      }, 50);
    }

    if (action === actions.DRAWING) {
      const index = elements.findIndex(
        (el) => el.id === selectedElement.id
      );

      if (index !== -1) {
        updateElement(
          {
            index,
            id: elements[index].id,
            x1: elements[index].x1,
            y1: elements[index].y1,
            x2: clientX,
            y2: clientY,
            type: elements[index].type,
          },
          elements
        );
      }
    }

    if (toolType === toolTypes.SELECTION) {
      const element = getElementAtPosition(clientX, clientY, elements);
      event.target.style.cursor = element
        ? getCursorForPosition(element.position)
        : "default";
    }

    if (
      selectedElement &&
      toolType === toolTypes.SELECTION &&
      action === actions.MOVING &&
      selectedElement.type === toolTypes.PENCIL
    ) {
      const newPoints = selectedElement.points.map((_, index) => ({
        x: clientX - selectedElement.xOffsets[index],
        y: clientY - selectedElement.yOffsets[index],
      }));

      const index = elements.findIndex(
        (el) => el.id === selectedElement.id
      );

      if (index !== -1) {
        updatePencilElementWhenMoving({ index, newPoints }, elements);
      }
      return;
    }

    if (
      toolType === toolTypes.SELECTION &&
      action === actions.MOVING &&
      selectedElement
    ) {
      const { id, x1, x2, y1, y2, offsetX, offsetY, type, text } =
        selectedElement;

      const width = x2 - x1;
      const height = y2 - y1;

      const newX1 = clientX - offsetX;
      const newY1 = clientY - offsetY;

      const index = elements.findIndex((el) => el.id === id);

      if (index !== -1) {
        updateElement(
          {
            id,
            x1: newX1,
            y1: newY1,
            x2: newX1 + width,
            y2: newY1 + height,
            type,
            index,
            text,
          },
          elements
        );
      }
    }

    if (
      toolType === toolTypes.SELECTION &&
      action === actions.RESIZING &&
      selectedElement
    ) {
      const { id, type, position, ...coords } = selectedElement;
      const { x1, y1, x2, y2 } = getResizedCoordinates(
        clientX,
        clientY,
        position,
        coords
      );

      const index = elements.findIndex((el) => el.id === id);

      if (index !== -1) {
        updateElement(
          { id, type, x1, y1, x2, y2, index },
          elements
        );
      }
    }
  };

  /* ================= MOUSE UP ================= */
  const handleMouseUp = () => {
    const index = elements.findIndex(
      (el) => el.id === selectedElement?.id
    );

    if (index !== -1 && adjustmentRequired(elements[index].type)) {
      const { x1, y1, x2, y2 } = adjustElementCoordinates(
        elements[index]
      );

      updateElement(
        {
          id: selectedElement.id,
          index,
          x1,
          y1,
          x2,
          y2,
          type: elements[index].type,
        },
        elements
      );
    }

    setAction(null);
    setSelectedElement(null);
  };

  /* ================= TEXT BLUR ================= */
  const handleTextareaBlur = (event) => {
    const index = elements.findIndex(
      (el) => el.id === selectedElement.id
    );

    if (index !== -1) {
      updateElement(
        {
          id: selectedElement.id,
          x1: selectedElement.x1,
          y1: selectedElement.y1,
          type: selectedElement.type,
          text: event.target.value,
          index,
        },
        elements
      );
    }

    setAction(null);
    setSelectedElement(null);
  };

  return (
    <>
      <Menu />

      {action === actions.WRITING && (
        <textarea
          ref={textAreaRef}
          onBlur={handleTextareaBlur}
          style={{
            position: "absolute",
            top: selectedElement.y1 - 3,
            left: selectedElement.x1,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            background: "transparent",
          }}
        />
      )}

      <canvas
        ref={canvasRef}
        id="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
};

export default Whiteboard;
