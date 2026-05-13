import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import WeddingPage from "./pages/WeddingPage";
import OwnerGallery from "./pages/OwnerGallery";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/welcome/:token"
          element={<WeddingPage />}
        />

        <Route
          path="/gallery/:token"
          element={<OwnerGallery />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;