import { BrowserRouter, Routes, Route } from "react-router";

import LandingPage from "./pages/LandingPage";
import MainLayout from "./pages/_layout";
import Piece from "./pages/Piece";
import LoginPage from "./pages/LoginPage";

import AdminLayout from "./pages/Home/_layout";
import CreatePiece from "./pages/Home/CreatePiece";
import ManageCategories from "./pages/Home/ManageCategories";

import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="/piece/:id" element={<Piece />} />
            <Route path="/admin/login" element={<LoginPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/piece/create" element={<CreatePiece />} />
              <Route path="/admin/categories" element={<ManageCategories />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
