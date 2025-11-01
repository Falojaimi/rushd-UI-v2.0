import React from "react";

interface ChatBoxProps {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
  glass?: boolean;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  children,
  className = "",
  shadow = false,
  glass = false,
}) => {
  return (
    <div
      className={`inline-flex mb-[34px] py-2.5 px-3.5 rounded-2xl border border-white 
        ${shadow ? "bg-white shadow-[0_20px_24px_-4px_rgba(10,13,18,0.08),_0_8px_8px_-4px_rgba(10,13,18,0.03)]" : ""}
        ${glass ? "backdrop-blur-md bg-white/30 border-white/50 shadow-[0_8px_16px_rgba(0,0,0,0.05)]" : "bg-white/50"}
        ${className}`}
    >
      {children}
    </div>
  );
};
