import styles from "./Header.module.css";


function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>Weather</a>

        <nav className={styles.navigation}>
          <a href="#news">News</a>
          <a href="#gallery">Gallery</a>
          <a href="#contacts">Contacts</a>
        </nav>

        <button className={styles.signUp}>Sign up</button>
      </div>
    </header>
  );
}

export default Header;