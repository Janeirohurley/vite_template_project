import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimetableHeaderProps {
    title: string;
    onNavigateWeek: (direction: 'prev' | 'next') => void;
    onCreateSlot: () => void;
}

const TimetableHeader: React.FC<TimetableHeaderProps> = ({
    title,
    onNavigateWeek,
    onCreateSlot
}) => (
    <motion.div
        className="mb-6 lg:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
                <motion.button
                    onClick={() => onNavigateWeek('prev')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChevronLeft className="text-gray-600 dark:text-gray-400" size={24} />
                </motion.button>

                <h1 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white text-center">
                    {title}
                </h1>

                <motion.button
                    onClick={() => onNavigateWeek('next')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChevronRight className="text-gray-600 dark:text-gray-400" size={24} />
                </motion.button>
            </div>

            <Button
                onClick={onCreateSlot}
                className="flex items-center gap-2"
            >
                <Plus size={18} />
                Créer un créneau
            </Button>
        </div>
    </motion.div>
);

export default TimetableHeader;