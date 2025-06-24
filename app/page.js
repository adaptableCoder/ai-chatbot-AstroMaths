import Link from "next/link";
import { BoxReveal } from "@/components/magicui/box-reveal"
import { RainbowButton } from "@/components/magicui/rainbow-button"

export default function Home() {
  return (
    <main className="h-full w-full text-center flex flex-col justify-center items-center gap-5">
      <BoxReveal boxColor="black" duration={0.3}>
        <h1 className="text-5xl md:text-7xl lg:text-8xl">Academic AI ChatBot</h1>
      </BoxReveal>

      <BoxReveal boxColor="black" duration={0.5}>
        <h2 className="text-md md:text-xl lg:text-2xl">Only responds to queries related to Astronomy and Mathematics.</h2>
      </BoxReveal>

      <Link href="/chat"><RainbowButton className="text-xl" size="lg">Try Out!</RainbowButton></Link>
      <p className="fixed bottom-5 font-semibold animate-pulse cursor-pointer"><Link href="https://github.com/adaptableCoder">adaptableCoder</Link></p>
    </main>
  );
}
