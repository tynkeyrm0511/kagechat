import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useThemeStore } from "./stores/useThemeStore";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocketStore } from "./stores/useSocketStore";
function App() {
  // Dong bo giao dien voi trang thai giao dien
  const { isDark, setTheme } = useThemeStore();

  // Lay token de ket noi socket
  const { accessToken } = useAuthStore();
  // Khi accessToken thay doi thi ket noi hoac ngat ket noi socket
  const { connectSocket, disconnectSocket } = useSocketStore();

  // Khi isDark thay doi thi cap nhat giao dien
  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    // Neu co accessToken thi ket noi socket
    if (accessToken) {
      connectSocket();
    }

    // Khi component unmount thi ngat ket noi socket
    return () => disconnectSocket();
  }, [accessToken]);

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
