import { FraudDetectionForm } from "@/app/components/FraudDetectionForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white text-black min-h-[100vh]">
      <header className="uppercase text-2xl text-center mt-[20px]">Wildberries Hackathon</header>
      <main>
        <FraudDetectionForm />
      </main>
      <footer className="mb-[30px] w-[90%] max-w-[700px] mx-auto">
        <p className="">сделали:</p>
        <ul className="mt-[10px] flex justify-center gap-[20px] max-md:flex-col text-center">
          <li>Арсений Титов</li>
          <li>Александр Чудов</li>
          <li>Тимур Гафаров</li>
          <li><Link className="underline" target="_blank" href="https://github.com/timu-ryan/wb-hackathon">GitHub</Link></li>
        </ul>
      </footer>
    </div>
  );
}
