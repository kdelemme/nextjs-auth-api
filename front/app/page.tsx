import { AmILoggedIn } from "@/components/home/am-i-logged-in";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <AmILoggedIn />
    </main>
  );
}
