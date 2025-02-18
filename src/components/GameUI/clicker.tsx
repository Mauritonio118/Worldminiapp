/*
"use client";
import styles from "./clicker.module.css";
import { useSession, signIn } from "next-auth/react";
import { useState, useContext } from "react";
import GameContext from "../../context/GameContext";

export function Clicker() {
  const { data: session, status } = useSession();
  const { setClicksForMint } = useContext(GameContext);
  const isUserLoggedIn = status === "authenticated";
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!session?.user) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/handle-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worldId: session.user.name }),
      });

      const data = await response.json();

      if (data.success) {
        setClicksForMint((prevClicks) => prevClicks + 1); // Aumentar clicksForMint en 1
      } else {
        console.error('Error en la respuesta del backend:', data.message);
      }
    } catch (error) {
      console.error('Error al enviar el click:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isUserLoggedIn ? (
        <button
          className={styles.activeButton}
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : '¡Click para ganar!'}
        </button>
      ) : (
        <button onClick={() => signIn()} className={styles.disabledButton}>
          Inicia sesión con World ID para jugar
        </button>
      )}
    </div>
  );
} */

  
"use client";
import styles from "./clicker.module.css";
import { useSession, signIn } from "next-auth/react";
import { useState, useContext } from "react";
import { motion } from "framer-motion";
import GameContext from "../../context/GameContext";

export function Clicker() {
  const { data: session, status } = useSession();
  const { setClicksForMint } = useContext(GameContext);
  const isUserLoggedIn = status === "authenticated";
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!session?.user) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/handle-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worldId: session.user.name }),
      });

      const data = await response.json();
      if (data.success) {
        setClicksForMint((prevClicks) => prevClicks + 1);
      } else {
        console.error("Error en la respuesta del backend:", data.message);
      }
    } catch (error) {
      console.error("Error al enviar el click:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-6">
      {isUserLoggedIn ? (
        <motion.button
          className={styles.activeButton}
          onClick={handleClick}
          disabled={isLoading}
          whileTap={{ scale: 0.9 }}
          animate={{ scale: [1, 1.05, 1], boxShadow: ["0px 0px 10px rgba(255, 255, 255, 0.5)", "0px 0px 20px rgba(255, 255, 255, 0.8)", "0px 0px 10px rgba(255, 255, 255, 0.5)"] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          {isLoading ? "🔥 ¡POWER! 🔥" : "🔥 ¡CLICK! 🔥"}
        </motion.button>
      ) : (
        <button onClick={() => signIn()} className={styles.disabledButton}>
          Inicia sesión con World ID para jugar
        </button>
      )}
    </div>
  );
}

