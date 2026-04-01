import { motion } from 'framer-motion';
import { Clock, FileCheck, UserCheck } from 'lucide-react';

export function WaitingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Animation principale */}
      <div className="relative w-32 h-32 mb-6">
        {/* Cercle animé */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Points animés autour */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              marginTop: '-6px',
              marginLeft: '-6px',
            }}
            animate={{
              x: Math.cos((index * 2 * Math.PI) / 3) * 50,
              y: Math.sin((index * 2 * Math.PI) / 3) * 50,
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Icône centrale */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </motion.div>
      </div>

      {/* Icônes de statut */}
      <div className="flex items-center gap-8 mb-4">
        <motion.div
          className="flex flex-col items-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        >
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mb-1">
            <FileCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Documents</span>
        </motion.div>

        <motion.div
          className="h-0.5 w-8 bg-gray-200 dark:bg-gray-700"
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <motion.div
          className="flex flex-col items-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mb-1">
            <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Vérification</span>
        </motion.div>
      </div>

      {/* Texte */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
        Votre dossier est en cours de traitement. Nous vous notifierons dès qu'il sera validé.
      </p>
    </div>
  );
}
