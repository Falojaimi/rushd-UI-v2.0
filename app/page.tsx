'use client';
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { ChatBox } from "@/components/ChatBox";
import dynamic from "next/dynamic";

const UploadStudtPlanModel = dynamic(
  () => import("@/components/UploadStudtPlanModel"),
  { ssr: false }
);

type Message = {
  type: "user" | "ai";
  text: string;
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const logoSectionRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // intro fade animation
  useEffect(() => {
    gsap.from(".fade-in", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });
  }, []);

  const triggerAIResponse = (userText: string) => {
    const userMessage: Message = { type: "user", text: userText };
    setMessages((prev) => [...prev, userMessage]);

    gsap.fromTo(
      ".chat-message:last-child",
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.2 }
    );

    setTimeout(() => {
      const aiResponse: Message = {
        type: "ai",
        text: `Great question! There are 4 sections for SE371 (Web Engineering)
1. Section 1438 - at 8:00am
2. Section 1440 - at 9:00am
3. Section 1442 - at 10:00am
4. Section 1444 - at 1:00pm`,
      };
      setMessages((prev) => [...prev, aiResponse]);
      gsap.fromTo(
        ".chat-message:last-child",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleFirstMessage();
    triggerAIResponse(inputValue);
    setInputValue("");
  };

  const handleSuggestionClick = (text: string) => {
    handleFirstMessage();
    triggerAIResponse(text);
  };

  const handleFirstMessage = () => {
    if (firstMessageSent) return;
    setFirstMessageSent(true);
    gsap.to(suggestionsRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(suggestionsRef.current, { display: "none" });
      },
    });
    const logoSection = logoSectionRef.current;
    if (logoSection) {
      const heading = logoSection.querySelector("h1");
      const subText = logoSection.querySelector("p");
      gsap.to(logoSection, {
        y: -224,
        duration: 1.2,
        ease: "power3.inOut",
      });
      gsap.to([heading, subText], {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
      });
    }
  };

  return (
    <main className="bg-white flex-1 h-screen overflow-hidden">
      <div className="w-full max-w-[1000px] relative flex flex-col flex-1 mx-auto lg:px-6 px-4 h-full">
        {/* Logo Section */}
        <div
          ref={logoSectionRef}
          className="flex flex-col items-center max-w-[409px] mx-auto justify-center pt-[265px] relative z-10"
        >
          <Image src="/icons/rushd-logo.svg" width={56} height={66} alt="logo" />
          <h1 className="text-[32px] leading-tight text-center -mt-1">Rushd</h1>
          <p className="text-xl text-black/50 leading-tight text-center">
            You’re Academic Advisor
          </p>
        </div>

        {/* Chat & Suggestions */}
        <div className="w-full relative h-full flex flex-col justify-end pb-[55px]">
          <div className="flex absolute bottom-0 left-1/2 -translate-x-1/2">
            <div className="w-[414px] h-[414px] rounded-full bg-green1 blur-[240px]" />
            <div className="w-[280px] -ml-14 h-[280px] rounded-full bg-blue1 blur-[140px]" />
          </div>

          <div ref={suggestionsRef} className="w-full relative z-10">
            <p className="text-sm text-gray2 font-manrope font-bold">
              Suggestions on what to ask our AI
            </p>
            <div className="w-full mt-4 mb-8 overflow-auto scroll-hide">
              <div className="w-full gap-4 flex justify-between">
                <button
                  onClick={() => handleSuggestionClick("How many Sections Does SE371 Have?")}
                  className="text-sm transition hover:bg-white hover:border-green1 cursor-pointer text-black1 whitespace-nowrap py-2.5 px-2.5 bg-white/40 rounded-2xl border border-white"
                >
                  How many Sections Does SE371 Have?
                </button>
                <button
                  onClick={() => handleSuggestionClick("What are the upcoming deadlines?")}
                  className="text-sm transition hover:bg-white hover:border-green1 cursor-pointer min-w-[294px] text-black1 whitespace-nowrap py-2.5 px-2.5 bg-white/40 rounded-2xl border border-white"
                >
                  What are the upcoming deadlines?
                </button>
                <button
                  onClick={() => handleSuggestionClick("Which electives should I pick?")}
                  className="text-sm transition hover:bg-white hover:border-green1 cursor-pointer text-black1 whitespace-nowrap py-2.5 px-2.5 bg-white/40 rounded-2xl border border-white"
                >
                  Which electives should I pick?
                </button>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="w-full absolute h-screen pt-[180px]">
            {messages.length > 0 && (
              <div className="w-full h-[calc(100vh-225px)] overflow-y-auto scroll-hide z-10 flex flex-col gap-3 pb-6 px-2">
                <div className="w-full flex flex-col mt-auto">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`chat-message flex w-full ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-[70%] ${msg.type === "user" ? "text-right" : "text-left"
                          }`}
                      >
                        <ChatBox>
                          <p
                            className={`whitespace-pre-line text-[15px] font-manrope ${msg.type === "user" ? "text-black" : "text-black/80"
                              }`}
                          >
                            {msg.text}
                          </p>
                        </ChatBox>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="w-full flex gap-2.5 relative z-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 cursor-pointer hover:border-green1 transition bg-white flex items-center justify-center rounded-2xl border border-gray2/60"
            >
              <Image src="/icons/upload-icon.svg" width={18} height={18} alt="upload" />
            </button>

            <form className="flex-1" onSubmit={handleSubmit}>
              <div className="w-full flex items-center relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about your Academic Journey"
                  className="w-full placeholder:text-gray1 md:placeholder:text-sm placeholder:text-xs focus:outline-green1 bg-white border border-gray2/60 rounded-2xl h-10 py-2.5 pl-2.5 pr-14 text-gray1 font-manrope text-sm"
                />
                <button
                  type="submit"
                  className="w-11 cursor-pointer absolute h-[33px] right-1 bg-linear-to-l from-blue2 to-green2 rounded-full flex items-center justify-center"
                >
                  <Image
                    src="/icons/send-message-icon.svg"
                    width={18}
                    height={18}
                    className="-ml-1"
                    alt="send"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {isModalOpen && <UploadStudtPlanModel onClose={() => setIsModalOpen(false)} />}
    </main>
  );
}
