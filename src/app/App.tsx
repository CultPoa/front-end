import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { MapView } from "./components/MapView";
import { LocalDetails } from "./components/LocalDetails";
import { Events } from "./components/Events";
import { Badges } from "./components/Badges";
import { Messages } from "./components/Messages";
import { Share } from "./components/Share";
import { Profile } from "./components/Profile";
import { BottomNav } from "./components/BottomNav";

export default function App() {
  return (
    <BrowserRouter>
      <div className="size-full bg-[#FAFAFA]">
        <Routes>
          <Route path="/" element={<MapView />} />
          <Route path="/local/:id" element={<LocalDetails />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/insignias" element={<Badges />} />
          <Route path="/mensagens" element={<Messages />} />
          <Route path="/compartilhar" element={<Share />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <BottomNav />
        <Toaster position="top-center" richColors />
      </div>
    </BrowserRouter>
  );
}
