import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Nếu không có access token, thử refresh
        if (!accessToken) {
          await refresh();
        }

        // Nếu có token nhưng chưa có user, fetch thông tin
        const currentAccessToken = useAuthStore.getState().accessToken;
        if (currentAccessToken && !user) {
          await fetchMe();
        }
      } catch (error) {
        console.error("Lỗi khi khởi tạo protected route:", error);
      } finally {
        setStarting(false);
      }
    };

    init();
  }, []); // ✅ Dependency array trống để chỉ chạy 1 lần

  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Đang tải trang...</p>
        </div>
      </div>
    );
  }

  // ✅ Lấy accessToken mới nhất từ store
  const currentAccessToken = useAuthStore.getState().accessToken;

  if (!currentAccessToken) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
