"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function Home() {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const scrollCarousel = (direction: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 420, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
       {/* HEADER */}
      <header className="w-full px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 flex items-center justify-center">
            <Image src="/img/icons/spendwise.svg" alt="SpendWise icon" width={22} height={22} />
          </div>
          <span className="font-bold text-[24px] sm:text-[32px] tracking-tight text-[#0F172A]">
            SpendWise
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/login"
            className="text-[#64748B] text-[14px] sm:text-[20px] font-semibold hover:text-[#3B12E8] transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-[#3B12E8] px-4 sm:px-5 py-1.5 sm:py-2 text-[14px] sm:text-[20px] font-semibold text-white shadow-[0_14px_30px_-18px_rgba(59,18,232,0.9)]"
          >
            Sign up
          </Link>
        </div>
      </header>

      <main className="w-full px-3 sm:px-0">
        {/* 1) Where Did Your Money Go */}
        <section className="pt-6 pb-8 sm:pb-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="font-black text-[44px] sm:text-[60px] md:text-[72px] leading-[1.05] tracking-tight text-[#0F172A]">
              <span className="block">Where Did Your</span>
              <span className="block">
                <span className="text-[#3B12E8]">Money</span>{" "}
                <span className="text-[#0F172A]">Go?</span>
              </span>
            </h1>

            <div className="mt-6 w-full">
              <img
                src="/img/landingPage/confused.png"
                alt="Where did your money go illustration"
                className="h-[180px] sm:h-[560px] md:h-[760px] w-full object-cover bg-white max-h-[120vh] rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* 2) Own Your Finances */}
        <section className="bg-[#F2E8FF] py-12 sm:py-16 ">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-black text-[44px] sm:text-[60px] leading-[1.15]">
              Own Your{" "}
              <span className="text-[#3B12E8] font-black text-[44px] sm:text-[60px] leading-[1.15] italic">
                Finances
              </span>
            </h2>

            <div className=" w-full">
              <img
                src="/img/landingPage/Mockups.png"
                alt="Own your finances illustration"
                className="w-full h-[220px] sm:h-[520px] md:h-[500px] object-contain rounded-2xl"
              />
            </div>

            <div className="mt-2 w-full">
              <div className="w-full max-w-[760px] mx-auto text-center">
                <h3 className="text-[28px] sm:text-[32px] md:text-[36px] leading-[1] font-bold tracking-tight">
                  <span className="text-[#0F172A]">Spend</span>
                  <span className="relative inline-block text-[#3B12E8]">
                    Wise
                  </span>
                </h3>

                <p className="mt-4 text-[#64748B] text-[16px] sm:text-[20px] leading-[1.35] font-normal max-w-[680px] mx-auto">
                  A simple way for students to track spending, remember debts, and understand their habits without
                  the headache.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-full bg-[#3B12E8] px-5 sm:px-7 py-2 sm:py-1 text-[16px] sm:text-[20px] font-semibold text-white shadow-[0_18px_40px_-22px_rgba(59,18,232,0.95)]"
                  >
                    Start Tracking Free
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-full border-2 border-[#3B12E8] px-5 sm:px-7 py-2 sm:py-1 text-[16px] sm:text-[20px] font-semibold text-[#3B12E8] bg-white"
                  >
                    See How It Works
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3) Track Everything */}
        <section className="bg-[#FFFFFF] py-12 sm:py-16">
          <div className="text-left">
            <h2 className="text-black font-black text-[44px] sm:text-[60px] leading-[1.15] text-center">
              Track <span className="text-[#3B12E8] italic">Everything</span>
            </h2>
            <p className="mt-3 text-[#64748B] text-[16px] sm:text-[18px] font-regular text-center max-w-[680px] mx-auto">
              From your morning latte to the shared Uber ride home, SpendWise keeps your
              financial life organized and stress-free.
            </p>
          </div>

          <div className="mt-8 sm:mt-10 relative">
            {/* Carousel */}
            <button
              type="button"
              aria-label="Scroll carousel left"
              onClick={() => scrollCarousel(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/70 backdrop-blur hover:bg-white/90 transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M14.5 5.5L8 12L14.5 18.5"
                  stroke="#3B12E8"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Scroll carousel right"
              onClick={() => scrollCarousel(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/70 backdrop-blur hover:bg-white/90 transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M9.5 5.5L16 12L9.5 18.5"
                  stroke="#3B12E8"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              ref={carouselRef}
              className="overflow-x-auto snap-x snap-mandatory [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden scroll-smooth"
            >
              <div className="flex gap-10 sm:gap-14 w-max pb-2">
                {[
                  {
                    src: "/img/landingPage/expenses.png",
                    alt: "Expenses preview",
                    title: "Quick Expense Logging",
                    description:
                      "Log spending in seconds. No complex categories or tedious bank syncing required.",
                  },
                  {
                    src: "/img/landingPage/debts.png",
                    alt: "Debts preview",
                    title: "Track Money Between Friends",
                    description:
                      "Never forget who owes who. Keep a casual tab on shared meals, trips, and coffee runs.",
                  },
                  {
                    src: "/img/landingPage/insights.png",
                    alt: "Insights preview",
                    title: "Smart Spending Insights",
                    description:
                      "Understand your habits with simple visual analytics that actually make sense.",
                  },
                  {
                    src: "/img/landingPage/confused.png",
                    alt: "Confusion help preview",
                    title: "Stay in Control",
                    description:
                      "No more guessing where your money went. Everything is clear and easy to track.",
                  },
                  {
                    src: "/img/landingPage/Mockups.png",
                    alt: "SpendWise app mockups preview",
                    title: "All-in-One Dashboard",
                    description:
                      "Everything you need in one clean, simple interface built for students.",
                  },
                ].map((item, idx) => (
                  <div
                    key={item.src}
                    className="snap-start w-[280px] sm:w-[360px] bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_10px_22px_-18px_rgba(2,6,23,0.16)] px-6 py-6 sm:px-8 sm:py-8"
                  >
                    <div className="h-[190px] sm:h-[250px] rounded-xl overflow-hidden bg-[#FFFFFF]">
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-5 sm:mt-7">
                      <div className="text-[#0F172A] font-black text-[20px] sm:text-[24px] leading-[1.2]">
                        {item.title}
                      </div>
                      <p className="mt-2 text-[#64748B] text-[14px] sm:text-[17px] font-medium leading-[1.35]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4) Set Reminders */}
        <section className="bg-[#F2E8FF] py-12 sm:py-16">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-black text-[38px] sm:text-[60px] leading-[1.15]">
              Set <span className="text-[#3B12E8] italic">Reminders</span>
            </h2>
            <p className="mt-3 text-[#64748B] text-[14px] sm:text-base font-regular text-center ">
              A clean, integrated view of your social finances. Settle up with a single tap.
            </p>

            <div className="mt-8 sm:mt-10 w-full flex justify-center items-center">
              <img
                src="/img/landingPage/reminders.png"
                alt="Set reminders illustration"
                className="w-full p-2 max-w-[1000px] h-[320px] sm:h-[420px] md:h-[600px] object-contain bg-[#F2E8FF] rounded-3xl "
              />
            </div>
          </div>
        </section>

        {/* 5) Get Valuable Insights */}
        <section className="pt-12 pb-8 sm:pt-16 sm:pb-4">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-black text-[38px] sm:text-[60px] leading-[1.15]">
              Get Valuable <span className="text-[#3B12E8] italic">Insights</span>
            </h2>
            <p className="mt-3 text-[#64748B] text-[14px] sm:text-base font-medium max-w-[420px]">
              From your morning latte to the shared Uber ride home, SpendWise keeps your
              financial life organized and stress-free.            </p>
          </div>

          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 items-start">
            {/* bulb above AI */}
            <div className="flex flex-col gap-6">
              <img
                src="/img/landingPage/bulb.png"
                alt="Quick insight help bulb"
                className="w-full bg-white rounded-2xl h-[230px] sm:h-[360px] md:h-[480px] object-contain"
              />
              <img
                src="/img/landingPage/ai.png"
                alt="Get valuable insights under bulb illustration"
                className="w-full bg-white rounded-2xl h-[150px] sm:h-[210px] md:h-[200px] object-contain"
              />
            </div>

            {/* addexpense */}
            <img
              src="/img/landingPage/addexpense.png"
              alt="Get valuable insights right illustration"
              className="w-full  bg-white rounded-2xl h-[620px] sm:h-[740px] md:h-[1100px] object-contain"
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[#F2E8FF] py-12 sm:py-24" >
          <div className="flex flex-col items-center text-center h-full justify-center">
            <h3 className="font-black text-[25px] sm:text-[60px] leading-[1.2]">
              Time is money. Save both.
            </h3>
            <Link
              href="/signup"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#3B12E8] px-5 sm:px-9 py-3 sm:py-4 text-[16px] sm:text-[20px] font-semibold text-white shadow-[0_18px_40px_-22px_rgba(59,18,232,0.95)]"
            >
              Create your free account
            </Link>
            <p className="text-[#64748B] text-[12px] sm:text-[18px] font-regular text-center max-w-[680px] mx-auto mt-4">
              No credit card required. Free forever for students.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white">
        <div className="w-full max-w-[1200px] px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-accent p-4 rounded-full flex items-center justify-center">
              <Image src="/img/icons/spendwise.svg" alt="SpendWise icon" width={22} height={22} />
            </div>
            <p className="text-xl font-bold">SpendWise</p>
          </div>

          <div className="text-[#94A3B8] text-[12px] font-semibold tracking-wide shrink-0">
            © 2026 SpendWise Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}