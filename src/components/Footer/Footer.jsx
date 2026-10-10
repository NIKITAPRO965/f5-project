
import {
  FaInstagram,
  FaFacebookF,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";

import styles from "./Footer.module.css";

function Footer() {
  const socialLinks = [
    {
      name: "Instagram",
      Icon: FaInstagram,
      url: "https://www.instagram.com/",
    },
    {
      name: "Facebook",
      Icon: FaFacebookF,
      url: "https://www.facebook.com/",
    },
    {
      name: "Telegram",
      Icon: FaTelegramPlane,
      url: "https://telegram.org/",
    },
    {
      name: "WhatsApp",
      Icon: FaWhatsapp,
      url: "https://www.whatsapp.com/",
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <a href="#" className={styles.logo} aria-label="Home">
        <img src="https://www.figma.com/api/mcp/asset/c81f831c-3829-4601-9a67-91c005b2fc43.png" alt="Logo"/>
        </a>

        <div className={styles.address}>
          <h3>Address</h3>
          <p>Ваш адрес будет здесь</p>
        </div>

        <div className={styles.contacts}>
          <h3>Contact us</h3>

          <div className={styles.socials}>
            {socialLinks.map(({ name, Icon, url }) => (
              <a
                key={name}
                href={url}
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                title={name}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} WeatherApp. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
