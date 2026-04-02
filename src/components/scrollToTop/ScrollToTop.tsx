"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const ticking = useRef(false); // prevents multiple rAF calls

    const RADIUS = 20;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    useEffect(() => {
        if (typeof window === "undefined" || typeof document === "undefined") return;

        const updateScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;

            setScrollProgress(progress);
            setIsVisible(scrollTop > 300);
            ticking.current = false;
        };

        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(updateScroll);
                ticking.current = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={
                isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
            }
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg"
        >
            {/* Progress Circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
                <motion.circle
                    cx="24"
                    cy="24"
                    r={RADIUS}
                    stroke="#ff9533"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={CIRCUMFERENCE}
                    animate={{
                        strokeDashoffset: CIRCUMFERENCE * (1 - scrollProgress / 100),
                    }}
                    transition={{ ease: "easeOut", duration: 0.3 }}
                />
            </svg>

            {/* Up Icon */}
            <ChevronUp size={20} className="text-[#ff9533] relative z-10" />
        </motion.button>
    );
};

export default ScrollToTop;
