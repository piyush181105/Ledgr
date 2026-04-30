import React, { use, useEffect, useRef, useState } from 'react'
import { navbarStyles } from '../assets/dummyStyles';
import img1 from "../assets/img1.png";
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, LogOut } from 'lucide-react';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

const Navbar = ({ user: propUser, onLogOut}) => {
  const navigate = useNavigate();
  const menuRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(propUser || { name: "", email: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token || token === "true") return;

        try {
        const response = await axios.get(`${BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` }, 
        });
        const userData = response.data.user || response.data;
        setUser(userData);

      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };
    if (!propUser) {
      fetchUserData();
    }
  }, [propUser]);


  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const handleLogOut = () => {
    setMenuOpen(false);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    onLogOut?.();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <header className={navbarStyles.header}>
      <div className={navbarStyles.container}>
        {/* LOGO SECTION */}
        <div className={navbarStyles.logoContainer} onClick={() => navigate("/")}>
          <div className={navbarStyles.logoImage}>
            <img src={img1} alt="logo" />
          </div>
          <span className={navbarStyles.logoText}>Ledgr</span>
        </div>

        {/* USER SECTION */}
        {true && (
          <div className={navbarStyles.userContainer} ref={menuRef}>
            <button onClick={toggleMenu} className={navbarStyles.userButton}>
              <div className="relative">
                <div className={navbarStyles.userAvatar}>
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className={navbarStyles.statusIndicator}></div>
              </div>
              <div className={navbarStyles.userTextContainer}>
                <p className={navbarStyles.userName}>{user?.name || "User"}</p>
                <p className={navbarStyles.userEmail}>{user?.email || "user@ledgr.com"}</p>
              </div>
              <ChevronDown className={navbarStyles.chevronIcon(menuOpen)} />
            </button>

            {/* DROPDOWN MENU */}
            {menuOpen && (
              <div className={navbarStyles.dropdownMenu}>
                <div className={navbarStyles.dropDownHeader}>
                  <div className="flex items-center gap-3">
                    <div className={navbarStyles.dropdownAvatar}>
                      {user?.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <div className={navbarStyles.dropdownName}>{user?.name || "User"}</div>
                      <div className={navbarStyles.dropdownEmail}>{user?.email || "user@ledgr.com"}</div>
                    </div>
                  </div>
                </div>
                <div className={navbarStyles.menuItemContainer}>
                  <button onClick={() => {setMenuOpen(false);navigate("/profile");}}className={navbarStyles.menuItem}>
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                </div>
                <div className={navbarStyles.menuItemBorder}>
                  <button onClick={handleLogOut} className={navbarStyles.logoutButton}>
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;

