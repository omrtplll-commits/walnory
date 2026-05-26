import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CreateEventPage from "./pages/CreateEventPage";
import EventPage from "./pages/EventPage";
import OwnerGallery from "./pages/OwnerGallery";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/create" element={<CreateEventPage />} />
      <Route path="/event/:id" element={<EventPage />} />
      <Route path="/owner/:ownerId" element={<OwnerGallery />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}

export default App;