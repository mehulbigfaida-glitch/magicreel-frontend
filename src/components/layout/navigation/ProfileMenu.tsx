import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  UserRound,
  LogOut,
} from "lucide-react";

import { useAuthStore } from "../../../store/authStore";

import "./ProfileMenu.css";

interface ProfileMenuProps {
  onClose: () => void;
}

export default function ProfileMenu({
  onClose,
}: ProfileMenuProps) {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="mr-profile-menu">

      <Link
        to="/dashboard"
        className="mr-profile-item"
        onClick={onClose}
      >
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </Link>

      <Link
        to="/account"
        className="mr-profile-item"
        onClick={onClose}
      >
        <UserRound size={18} />
        <span>My Account</span>
      </Link>

      <Link
        to="/plans"
        className="mr-profile-item"
        onClick={onClose}
      >
        <CreditCard size={18} />
        <span>Billing & Pricing</span>
      </Link>

      <button
        className="mr-profile-item mr-profile-logout"
        onClick={handleLogout}
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>

    </div>
  );
}