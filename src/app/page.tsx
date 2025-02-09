import styles from "./page.module.css";
import { SignIn } from "../components/SignIn";
import { Minter, Clicker, Burner, PointsDisplay, ClickCounter } from "../components/GameUI";

export default function Home() {
  return (
    <main className={styles.container}>
      <SignIn />
      <PointsDisplay />
      <ClickCounter />
      <Clicker />
      <Minter />
      <Burner />
    </main>
  );
}
