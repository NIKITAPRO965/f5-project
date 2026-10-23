
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import Modal from "../Modal/Modal";

const logoUrl = `${import.meta.env.BASE_URL}images/logo.svg`;
const userUrl = `${import.meta.env.BASE_URL}images/profile.png`;

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  useEffect(() => {
    if (!isModalOpen && !isProfileOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen, isProfileOpen]);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleRegister = (newUser) => {
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileOpen(false);
  };

  const handleProfileClick = () => {
    setIsMenuOpen(false);

    if (user) {
      setIsProfileOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleProfileBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsProfileOpen(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="#home" className={styles.logo} aria-label="Home">
          <img src={logoUrl} alt="Logo" />
        </a>

        <button
          className={styles.menuToggle}
          type="button"
          onClick={handleMenuToggle}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span>Menu</span>

          <span
            className={`${styles.arrow} ${
              isMenuOpen ? styles.arrowOpen : ""
            }`}
          />
        </button>

        <div
          className={`${styles.mobilePanel} ${
            isMenuOpen ? styles.mobilePanelOpen : ""
          }`}
        >
          <nav className={styles.navigation}>
            <a href="#about" onClick={handleLinkClick}>
              Who we are
            </a>

            <a href="#contacts" onClick={handleLinkClick}>
              Contacts
            </a>

            <a href="#menu" onClick={handleLinkClick}>
              Menu
            </a>
          </nav>

          <div className={styles.actions}>
            {user ? (
              <>
                <span className={styles.userName}>{user.name}</span>

                <button
                  className={styles.signUp}
                  type="button"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                className={styles.signUp}
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsModalOpen(true);
                }}
              >
                Sign Up
              </button>
            )}

            <button
              className={styles.profile}
              type="button"
              aria-label="User profile"
              onClick={handleProfileClick}
            >
              <img src={userUrl} alt="" />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          onRegister={handleRegister}
        />
      )}

      {isProfileOpen && user && (
        <div
          className={styles.profileBackdrop}
          onClick={handleProfileBackdropClick}
        >
          <div
            className={styles.profileModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-title"
          >
            <button
              className={styles.profileClose}
              type="button"
              onClick={() => setIsProfileOpen(false)}
              aria-label="Close profile"
            >
              &times;
            </button>

            <h2 id="profile-title">My account</h2>

            <div className={styles.profileInfo}>
              <p>
                <strong>Name:</strong>
                <span>{user.name}</span>
              </p>

              <p>
                <strong>Email:</strong>
                <span>{user.email}</span>
              </p>
            </div>

            <button
              className={styles.profileLogout}
              type="button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
