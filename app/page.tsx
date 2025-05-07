import Image from "next/image";
import { Appbar } from "./components/Appbar";

export default function Home() {
  console.log(process.env.GOOGLE_CLIENT_SECRET)
  return (
    <main>
      <Appbar/>
    </main>
  );
}
