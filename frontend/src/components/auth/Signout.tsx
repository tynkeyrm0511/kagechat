import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const Signout = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const handleSignOut = async() => {
    try {
        await signOut();
        navigate("/signin");
    } catch (error) {
        console.error(error)
    }
  };
  return <Button className="hover:cursor-pointer" onClick={handleSignOut}>Đăng xuất</Button>;
};

export default Signout;
