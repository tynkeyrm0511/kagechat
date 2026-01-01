import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { LogOut } from "lucide-react";
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
  return <Button className="cursor-pointer" variant="compeleteGhost" onClick={handleSignOut}>
    <LogOut className="text-destructive" />
    Log out
  </Button>;
};

export default Signout;
