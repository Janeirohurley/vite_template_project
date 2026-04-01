"use client";

import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

export interface DashboardHeaderProps {
    /** Nom complet de l’utilisateur */
    name: string;

    /** Rôle ou description (ex: "Tableau de bord - Étudiant") */
    subtitle?: string;

    /** Texte de bienvenue personnalisable */
    greeting?: string;

    /** Alignement du texte (left, center ou right) */
    align?: "left" | "center" | "right";

    /** Délai d’animation (facultatif) */
    delay?: number;

    /** Classe CSS additionnelle */
    className?: string;
}

/**
 * 💎 Composant DashboardHeader
 * Affiche un titre de bienvenue animé et adaptatif au mode sombre 🌙
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    name,
    subtitle = "Tableau de bord",
    greeting = "Bienvenue",
    align = "left",
    delay = 0,
    className,
}) => {
    const alignClasses = {
        left: "text-left lg:text-left",
        center: "text-center",
        right: "text-right lg:text-right",
    } as const;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay }}
            className={clsx("transition-all", alignClasses[align], className)}
        >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {greeting},{" "}
                <span className="text-primary-600 dark:text-primary-400">{name}</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {subtitle}
            </p>
        </motion.div>
    );
};

export default DashboardHeader;
