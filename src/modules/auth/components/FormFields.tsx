import { type ChangeEvent } from 'react';
import type { SelectOption } from '../types';

/**
 * Props communes pour tous les champs
 */
interface BaseFieldProps {
    label: string;
    name: string;
    error?: string;
    required?: boolean;
    className?: string;
}

/**
 * Champ de texte standard
 */
interface TextFieldProps extends BaseFieldProps {
    type?: 'text' | 'email' | 'password' | 'tel' | 'date';
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    maxLength?: number;
}

export function TextField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    required = false,
    maxLength,
    className = ''
}: TextFieldProps) {
    return (
        <div className={className}>
            <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                htmlFor={name}
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                    ${error
                        ? 'border-red-500 focus:ring-red-500 dark:border-red-400'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-600 dark:focus:ring-blue-500'
                    }
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                placeholder={placeholder}
                required={required}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
}

/**
 * Champ de sélection (select)
 */
interface SelectFieldProps extends BaseFieldProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    placeholder?: string;
}

export function SelectField({
    label,
    name,
    value,
    onChange,
    options,
    placeholder = 'Sélectionnez une option',
    error,
    required = false,
    className = ''
}: SelectFieldProps) {
    return (
        <div className={className}>
            <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                htmlFor={name}
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                    ${error
                        ? 'border-red-500 focus:ring-red-500 dark:border-red-400'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-600 dark:focus:ring-blue-500'
                    }
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                required={required}
            >
                <option value="">{placeholder}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
}

/**
 * Champ de sélection multiple (checkboxes)
 */
interface MultiSelectFieldProps extends BaseFieldProps {
    values: string[];
    onChange: (values: string[]) => void;
    options: SelectOption[];
}

export function MultiSelectField({
    label,
    name,
    values,
    onChange,
    options,
    error,
    required = false,
    className = ''
}: MultiSelectFieldProps) {
    const handleCheckboxChange = (optionValue: string) => {
        if (values.includes(optionValue)) {
            onChange(values.filter(v => v !== optionValue));
        } else {
            onChange([...values, optionValue]);
        }
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto p-3 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                {options.map(option => (
                    <label
                        key={option.value}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 p-1 rounded"
                    >
                        <input
                            type="checkbox"
                            name={`${name}[]`}
                            value={option.value}
                            checked={values.includes(option.value)}
                            onChange={() => handleCheckboxChange(option.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            {values.length > 0 && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {values.length} {values.length === 1 ? 'langue sélectionnée' : 'langues sélectionnées'}
                </p>
            )}
        </div>
    );
}

/**
 * Champ de téléchargement de fichier (pour photo de profil)
 */
interface FileFieldProps extends BaseFieldProps {
    accept?: string;
    onChange: (file: File | null) => void;
    preview?: string | null;
}

export function FileField({
    label,
    name,
    accept = 'image/*',
    onChange,
    preview,
    error,
    required = false,
    className = ''
}: FileFieldProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange(file);
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="flex items-center space-x-4">
                {preview && (
                    <img
                        src={preview}
                        alt="Aperçu"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                    />
                )}

                <label className="flex-1 cursor-pointer">
                    <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors
                        ${error
                            ? 'border-red-500 hover:border-red-600 dark:border-red-400'
                            : 'border-gray-300 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400'
                        }`}
                    >
                        <svg
                            className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Cliquez pour sélectionner une photo
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            PNG, JPG jusqu'à 5MB
                        </p>
                    </div>
                    <input
                        id={name}
                        name={name}
                        type="file"
                        accept={accept}
                        onChange={handleChange}
                        className="hidden"
                        required={required}
                    />
                </label>
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
}

/**
 * Section de formulaire avec titre
 */
interface FormSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
    return (
        <div className="space-y-4">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                </h3>
                {description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {description}
                    </p>
                )}
            </div>
            {children}
        </div>
    );
}
