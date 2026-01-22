import React from "react";
import { useDispatch, useSelector } from "react-redux";

import rectangleIcon from "../resources/icons/rectangle.svg";
import lineIcon from "../resources/icons/line.svg";
import rubberIcon from "../resources/icons/rubber.svg";
import pencilIcon from "../resources/icons/pencil.svg";
import textIcon from "../resources/icons/text.svg";
import selectionIcon from "../resources/icons/selection.svg";

import { toolTypes } from "../constants";
import { setElements, setToolType, setColor, setSize } from "./whiteboardSlice";
import { emitClearWhiteboard } from "../socketConn/socketConn";

const IconButton = ({ src, type, isRubber }) => {
  const dispatch = useDispatch();
  const selectedToolType = useSelector((state) => state.whiteboard.tool);

  return (
    <button
      onClick={() => dispatch(setToolType(type))} // ✅ FIX
      className={
        selectedToolType === type ? "menu_button_active" : "menu_button"
      }
    >
      <img
        width="80%"
        height="80%"
        src={src}
        className={isRubber ? "eraser_icon" : ""} // ✅ KEPT AS-IS
        alt=""
      />
    </button>
  );
};

const Menu = () => {
  const dispatch = useDispatch();

  return (
    <div className="menu_container">
      <div style={{ display: "flex", gap: "20px", marginRight: "-30px", marginLeft: "-20px" }}>
        <IconButton src={rectangleIcon} type={toolTypes.RECTANGLE} />
        <IconButton src={lineIcon} type={toolTypes.LINE} />
        <IconButton src={rubberIcon} type={toolTypes.ERASER} isRubber />{" "}
        <IconButton src={pencilIcon} type={toolTypes.PENCIL} />
        <IconButton src={textIcon} type={toolTypes.TEXT} />
        <IconButton src={selectionIcon} type={toolTypes.SELECTION} />
      </div>
      <div
        style={{
          width: "1.5px",
          height: "40px",
          background: "#3A3A3A",
          opacity: 1,
        }}
      />
      {/* COLOR PICKER */}
      <div style={{ display: "flex", gap: "6px", marginLeft: "-25px", marginRight: "-30px"}}>
        {["#000000", "#EF4444", "#22C55E", "#3B82F6", "#A855F7", "#F59E0B"].map(
          (c) => (
            <button
              key={c}
              onClick={() => dispatch(setColor(c))}
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: c,
                border: "2px solid #3A3A3A",
                cursor: "pointer",
              }}
            />
          ),
        )}
      </div>
      {/* PEN / ERASER SIZE */}
      <input
        type="range"
        min={1}
        max={8}
        defaultValue={2}
        onChange={(e) => dispatch(setSize(+e.target.value))}
        style={{ marginRight: "-25px" }}
      />
      <div
        style={{
          width: "1.5px",
          height: "40px",
          background: "#3A3A3A",
          opacity: 1.0,
        }}
      />
      {/* CLEAR BOARD */}
      <button
        onClick={() => {
          dispatch(setElements([]));
          emitClearWhiteboard();
        }}
        className="menu_button"
        style={{ width: "70px", marginLeft: "-40px", fontSize: "15px", fontWeight: "510", marginRight: "-20px" }}
      >
        RESET
      </button>
    </div>
  );
};

export default Menu;
