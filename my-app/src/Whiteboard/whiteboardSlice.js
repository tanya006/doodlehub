import { toolTypes } from "../constants";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tool: toolTypes.PENCIL,
  elements: [],
  color: "#000000",
  size: 2,
};

const whiteboardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    setToolType: (state, action) => {
      state.tool = action.payload;
    },
    setColor(state, action) {
      state.color = action.payload;
    },
    setSize(state, action) {
      state.size = action.payload;
    },
    updateElement: (state, action) => {
      const { id } = action.payload;

      const index = state.elements.findIndex((element) => element.id === id);

      if (index === -1) {
        state.elements.push(action.payload);
      } else {
        // if index will be found
        // update element in our array of elements

        state.elements[index] = action.payload;
      }
    },
    setElements: (state, action) => {
      state.elements = action.payload;
    },
  },
});

export const { setToolType, updateElement, setElements, setColor, setSize } =
  whiteboardSlice.actions;

export default whiteboardSlice.reducer;
