import { useState, useRef, useEffect } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ text, children, className = "" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function checkTruncation() {
      if (textRef.current) {
        const element = textRef.current.querySelector('[data-truncate="true"]');
        if (element) {
          setIsTruncated(element.scrollWidth > element.clientWidth);
        }
      }
    }

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [text]);

  function handleMouseEnter() {
    if (isTruncated) {
      setIsVisible(true);
    }
  }

  function handleMouseLeave() {
    setIsVisible(false);
  }

  return (
    <div
      ref={textRef}
      className={`relative group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && isTruncated && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            {text}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
