
import { useState } from "react";
import styles from "./Modal.module.css";

function Modal({ onClose, onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    onRegister({
      name: name.trim(),
      email: email.trim(),
    });
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className={styles.closeButton}
          type="button"
          onClick={onClose}
          aria-label="Close registration"
        >
          &times;
        </button>

        <h2 className={styles.title} id="modal-title">
          Sign Up
        </h2>

        <p className={styles.description}>
          Create your account
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="register-name">
            Name
          </label>
          <input
            className={styles.input}
            id="register-name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            autoComplete="name"
          />

          <label className={styles.label} htmlFor="register-email">
            Email
          </label>
          <input
            className={styles.input}
            id="register-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />

          <label className={styles.label} htmlFor="register-password">
            Password
          </label>
          <input
            className={styles.input}
            id="register-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />

          <button className={styles.submitButton} type="submit">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Modal;