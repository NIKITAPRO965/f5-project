
import { useState } from "react";
import styles from "./Header.module.css";
import Modal from "../Modal/Modal";

const logoUrl =
  "https://www.figma.com/api/mcp/asset/c81f831c-3829-4601-9a67-91c005b2fc43.png";

const userUrl =
  "https://www.figma.com/api/mcp/asset/5d4d2b75-de1f-4f88-a01b-f0f73c076a26.png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleRegister = (user) => {
    console.log("Registered user:", user);
    setIsModalOpen(false);
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

            <button
              className={styles.profile}
              type="button"
              aria-label="User profile"
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
    </header>
  );
}

export default Header;

