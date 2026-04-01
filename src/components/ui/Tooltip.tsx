import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export function Tooltip({
    content,
    children,
    delay = 400,
    className = "",
}: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [arrowLeft, setArrowLeft] = useState(0);

    const triggerRef = useRef<HTMLSpanElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<number | null>(null);

    const updatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return;

        const trigger = triggerRef.current.getBoundingClientRect();
        const tooltip = tooltipRef.current.getBoundingClientRect();

        const spacing = 8;

        // Centre réel du trigger
        const triggerCenterX = trigger.left + trigger.width / 2;

        // Clamp horizontal du tooltip
        const minLeft = tooltip.width / 2 + 8;
        const maxLeft = window.innerWidth - tooltip.width / 2 - 8;
        const clampedLeft = Math.min(
            Math.max(triggerCenterX, minLeft),
            maxLeft
        );

        // Position verticale (au-dessus sinon en dessous)
        let top = trigger.top - tooltip.height - spacing;
        if (top < 8) {
            top = trigger.bottom + spacing;
        }

        // Position réelle de la flèche dans le tooltip
        const arrowX =
            triggerCenterX - (clampedLeft - tooltip.width / 2);

        setPosition({ top, left: clampedLeft });
        setArrowLeft(arrowX);
    };

    const handleEnter = () => {
        timeoutRef.current = window.setTimeout(() => {
            setVisible(true);
        }, delay);
    };

    const handleLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setVisible(false);
    };

    useEffect(() => {
        if (visible) {
            updatePosition();
            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);
        }

        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [visible]);

    return (
        <>
            <span
                ref={triggerRef}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                className={className}
            >
                {children}
            </span>

            <AnimatePresence>
                {visible && (
                    <motion.div
                        ref={tooltipRef}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="fixed z-50 pointer-events-none"
                        style={{
                            top: position.top,
                            left: position.left,
                            transform: "translateX(-50%)",
                        }}
                    >
                        <div className="relative bg-gray-900 dark:bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs">
                            {content}

                            {/* Flèche */}
                            <div
                                className="absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45"
                                style={{
                                    left: arrowLeft,
                                    bottom: -4,
                                    transform: "translateX(-50%) rotate(45deg)",
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
interface TruncatedTextProps {
    text: string;
    maxLength?: number;
    className?: string;
}

export function TruncatedText({
    text,
    maxLength = 50,
    className = "",
}: TruncatedTextProps) {
    if (text.length <= maxLength) {
        return <span className={className}>{text}</span>;
    }

    return (
        <Tooltip content={text}>
            <span className={`${className} cursor-help`}>
                {text.slice(0, maxLength)}…
            </span>
        </Tooltip>
    );
}
