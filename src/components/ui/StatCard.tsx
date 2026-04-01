"use client";

import React, { type ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export interface StatCardProps {
  /** Valeur principale (ex: "14.2/20") */
  value: string | number;

  /** Libellé descriptif (ex: "Moyenne générale") */
  label: string;

  /** Petit badge en haut à droite (ex: "+0.3") */
  badge?: string;

  /** Couleur dominante */
  color?: "green" | "blue" | "red" | "amber" | "purple" | "gray";

  /** Taille du texte principal */
  size?: "sm" | "md" | "lg";

  /** Délai d’apparition de l’animation */
  delay?: number;

  /** Classe CSS additionnelle */
  className?: string;

  /** Élément enfant — icône personnalisée ou visuel libre */
  children?: ReactNode;
}

/**
 * 💎 Composant StatCard
 * Épuré, élégant, avec support complet du mode sombre 🌙
 */
export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  badge,
  color = "green",
  size = "md",
  delay = 0,
  className,
  children,
}) => {
  const sizeMap = {
    sm: "text-lg lg:text-xl",
    md: "text-xl lg:text-2xl",
    lg: "text-2xl lg:text-3xl",
  };

  const colorMap = {
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay,
      }}
      className={clsx(
        "rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-sm p-4 lg:p-6 hover:shadow-lg transition-all duration-300",
        "bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 lg:rounded-2xl",
        className
      )}
      style={{
        
        boxShadow:
          "rgba(0,71,171,0.08) 0px 4px 20px, rgba(0,0,0,0.1) 0px 1px 3px",
      }}
    >
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <div
          className={clsx(
            "w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center transition-colors",
            colorMap[color]
          )}
        >
          {children}
        </div>

        {badge && (
          <span
            className={clsx(
              "text-xs lg:text-sm font-medium px-2 py-1 rounded-full transition-colors",
              colorMap[color]
            )}
          >
            {badge}
          </span>
        )}
      </div>

      <h3
        className={clsx(
          sizeMap[size],
          "font-bold text-gray-800 dark:text-gray-100 mb-1"
        )}
      >
        {value}
      </h3>
      <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
        {label}
      </p>
    </motion.div>
  );
};

export default StatCard;
