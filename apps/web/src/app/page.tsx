import { Button } from "@worldscape/ui";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Welcome to Worldscape</h1>
      <p>Create and explore immersive worlds</p>
      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <Button variant="primary">Get Started</Button>
        <Link href="/demo">
          <Button variant="secondary">Window Manager Demo</Button>
        </Link>
      </div>
    </main>
  );
}
