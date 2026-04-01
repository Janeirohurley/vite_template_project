import { useEffect, useState } from "react";
import ums from "@/assets/ums.png"
import { ProtectedRoute } from "@/components/ProtectedRoute";

type Countdown = {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
};

export default function DevelopmentPage() {
    const [timeLeft, setTimeLeft] = useState<Countdown>({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
    });

    useEffect(() => {
        let destination = new Date("March 31, 2026 23:59:59").getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = destination - now;

            if (diff <= 0) {
                const nextMonth = new Date();
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                destination = nextMonth.getTime();
                return;
            }
 
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (diff % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({
                days: String(days).padStart(2, "0"),
                hours: String(hours).padStart(2, "0"),
                minutes: String(minutes).padStart(2, "0"),
                seconds: String(seconds).padStart(2, "0"),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <ProtectedRoute allowedRoles={["*"]}>
            <section className="relative w-full h-screen flex items-center justify-center
                        bg-gray-100 dark:bg-gray-950">
                <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                    <div
                        className="w-full md:px-16 px-10 md:pt-16 pt-10 pb-10
                           bg-white dark:bg-gray-900
                           rounded-2xl
                           flex flex-col items-center gap-10
                           shadow-lg dark:shadow-none"
                    >
                        <img
                            src={ums}
                            alt="ums"
                            className="object-cover h-30"
                        />

                        <div className="text-center">
                            <h2 className="text-blue-500 dark:text-blue-400
                                   md:text-6xl text-5xl font-bold">
                                Coming Soon
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Just 20 days remaining until the big reveal of our new product!
                            </p>
                        </div>

                        <div className="flex items-center gap-3
                                text-gray-900 dark:text-white">
                            <TimeBox value={timeLeft.days} label="DAYS" />
                            <Colon />
                            <TimeBox value={timeLeft.hours} label="HRS" />
                            <Colon />
                            <TimeBox value={timeLeft.minutes} label="MINS" />
                            <Colon />
                            <TimeBox value={timeLeft.seconds} label="SECS" />
                        </div>

                        <div className="text-center">
                            <h6 className="text-blue-500 dark:text-blue-400 font-semibold">
                                Launched Date: July 23, 2024
                            </h6>

                            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                <input
                                    type="email"
                                    placeholder="Type your mail..."
                                    className="w-80 px-3 py-2 rounded-lg border
                                       bg-white dark:bg-gray-800
                                       text-gray-900 dark:text-white
                                       border-gray-300 dark:border-gray-700
                                       focus:outline-none focus:ring-2
                                       focus:ring-blue-400"
                                />
                                <button
                                    className="px-4 py-2 rounded-lg transition
                                       bg-blue-500 hover:bg-emerald-600
                                       text-white"
                                >
                                    Notify Me
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Get in touch with us:{" "}
                            <a
                                href="mailto:ums@education.bi"
                                className="hover:text-gray-900 dark:hover:text-gray-100 transition"
                            >
                                ums@education.bi
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </ProtectedRoute>

    );
}

/* ---------- Small Components ---------- */

function TimeBox({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">
                {value}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
                {label}
            </span>
        </div>
    );
}

function Colon() {
    return (
        <span className="text-2xl text-gray-400 dark:text-gray-500">
            :
        </span>
    );
}

