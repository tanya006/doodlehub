import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Whiteboard from "./Whiteboard/Whiteboard";
import CursorOverlay from "./CursorOverlay/CursorOverlay";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/room/:roomId"
          element={
            <>
              <Whiteboard />
              <CursorOverlay />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
