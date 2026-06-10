import RegisterPage from "./(auth)/register/page";
// import Footer from "./home/parts/footer";
// import Hero from "./home/parts/hero";
// import Navbar from "./home/parts/navbar";

// import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col  items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full  flex-col items-center justify-between  bg-white dark:bg-black sm:items-start">
        {/* <Navbar /> */}
        {/* <Hero /> */}
        <RegisterPage />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left"></div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row"></div>
        <div className="flex"></div>
        {/* <Footer /> */}
      </main>
    </div>
  );
}
