import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen">
      <Link href="/visualize">Visualize</Link>
    </main>
  );
}
