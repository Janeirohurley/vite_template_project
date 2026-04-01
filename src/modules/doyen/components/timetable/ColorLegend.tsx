import React from 'react';
import { motion } from 'framer-motion';

const ColorLegend: React.FC = () => (
    <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
    >
        <div className="flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex gap-4 lg:gap-6 text-xs lg:text-sm flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 lg:w-4 lg:h-4 bg-blue-100 border border-blue-200 rounded"></div>
                        <span className="text-gray-700 dark:text-gray-300">Cours</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 lg:w-4 lg:h-4 bg-green-100 border border-green-200 rounded"></div>
                        <span className="text-gray-700 dark:text-gray-300">Planifié</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 lg:w-4 lg:h-4 bg-purple-100 border border-purple-200 rounded"></div>
                        <span className="text-gray-700 dark:text-gray-300">Terminé</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 lg:w-4 lg:h-4 bg-red-100 border border-red-200 rounded"></div>
                        <span className="text-gray-700 dark:text-gray-300">Annulé</span>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

export default ColorLegend;