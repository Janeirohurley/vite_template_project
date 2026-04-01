import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, X, User, Loader2 } from 'lucide-react';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onUpload: (file: File) => Promise<void>;
  onRemove?: () => void;
  isUploading?: boolean;
  disabled?: boolean;
}

export function ProfileImageUpload({
  currentImageUrl,
  onUpload,
  onRemove,
  isUploading = false,
  disabled = false,
}: ProfileImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return 'Format non supporté. Utilisez JPG, PNG ou WebP.';
    }
    if (file.size > maxSize) {
      return 'L\'image ne doit pas dépasser 2 Mo.';
    }
    return null;
  };

  const handleFile = async (file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Créer un aperçu local
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload le fichier
    try {
      await onUpload(file);
    } catch {
      setError('Erreur lors du téléchargement. Veuillez réessayer.');
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled || isUploading) return;

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onRemove?.();
  };

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <div className="flex flex-col items-center">
      {/* Zone d'upload */}
      <div
        className={`relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-600'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && inputRef.current?.click()}
      >
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : displayUrl ? (
          <>
            <img
              src={displayUrl}
              alt="Photo de profil"
              className="w-full h-full object-cover"
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <Camera className="w-8 h-8 text-white" />
            </motion.div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
            <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            <Upload className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-1" />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          disabled={disabled || isUploading}
          className="hidden"
        />
      </div>

      {/* Bouton supprimer */}
      {displayUrl && !isUploading && !disabled && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
          className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
        >
          <X className="w-4 h-4" />
          Supprimer
        </button>
      )}

      {/* Instructions */}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        Cliquez ou glissez une image
        <br />
        JPG, PNG ou WebP (max. 2 Mo)
      </p>

      {/* Erreur */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
