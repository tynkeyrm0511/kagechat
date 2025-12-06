import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useThemeStore } from "./stores/useThemeStore";
import { useEffect } from "react";
function App() {
  // Dong bo giao dien voi trang thai giao dien
  const { isDark, setTheme } = useThemeStore();
  // Khi isDark thay doi thi cap nhat giao dien
  useEffect(()=>{
    setTheme(isDark);
  }, [isDark]);

  return (
    <>
      <Toaster richColors /> {/*Thu vien hien thi thong bao*/}
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatAppPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
