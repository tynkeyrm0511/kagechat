import Signout from "@/components/auth/Signout";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/lib/axios";
import { toast } from "sonner";

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);
  const handleOnClick = async () => {
    try {
      await api.get("/users/test", { withCredentials: true });
      toast.success("oke");
    } catch (error) {
      console.error(error);
      toast.error("thất bại");
    }
  };
  return (
    <div>
      {user?.username}
      <Signout />
      <Button onClick={handleOnClick}>test</Button>
    </div>
  );
};

export default ChatAppPage;
