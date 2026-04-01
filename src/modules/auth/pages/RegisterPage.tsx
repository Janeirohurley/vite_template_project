import { useState } from 'react'
import { AuthLayout, AuthTabs, TextField, FormSection } from '../components'
import { DatePickerModal } from '@/components/ui/DatePickerModal'
import { motion, AnimatePresence } from 'framer-motion'
import { notify } from '@/lib'
import { useForm } from '@/hooks/useForm'
import { useRegister } from '../hooks'
import { useModal } from '@/hooks/useModal'
import {
    GENDER_OPTIONS,
    MARITAL_STATUS_OPTIONS,
    SPOKEN_LANGUAGES_OPTIONS,
    validateBirthDate,
    validatePhoneNumber,
    validateEmail
} from '../constants'
import type { RegisterData } from '../types'
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown'
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown'
import { CustomDatePicker } from '@/components/ui/CustomDatePicker'

export function RegisterPage() {
    const { values, handleChange: handleInputChange } = useForm<RegisterData>({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: null,
        phone_number: '',
        birth_date: '',
        nationality: '',
        marital_status: null,
    });

    const [spokenLanguages, setSpokenLanguages] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currentStep, setCurrentStep] = useState(1);
    const registerMutation = useRegister();
    const datePickerModal = useModal();

    const totalSteps = 3;

    // Generic change handler for all form elements
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        handleInputChange(e as React.ChangeEvent<HTMLInputElement>);
    };

    // Validation de l'étape 1
    const validateStep1 = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!values.first_name.trim()) {
            newErrors.first_name = 'Le prénom est requis';
        }
        if (!values.last_name.trim()) {
            newErrors.last_name = 'Le nom est requis';
        }


        const emailValidation = validateEmail(values.email);
        if (!emailValidation.valid) {
            newErrors.email = emailValidation.error!;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validation de l'étape 2
    const validateStep2 = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (values.password.length < 8) {
            newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        }

        if (values.password !== values.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validation de l'étape 3
    const validateStep3 = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (values.phone_number) {
            const phoneValidation = validatePhoneNumber(values.phone_number);
            if (!phoneValidation.valid) {
                newErrors.phone_number = phoneValidation.error!;
            }
        }

        if (values.birth_date) {
            const birthDateValidation = validateBirthDate(values.birth_date);
            if (!birthDateValidation.valid) {
                newErrors.birth_date = birthDateValidation.error!;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        let isValid = false;

        if (currentStep === 1) {
            isValid = validateStep1();
        } else if (currentStep === 2) {
            isValid = validateStep2();
        }

        if (isValid && currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            setErrors({});
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setErrors({});
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Valider l'étape courante avant soumission
        if (currentStep < totalSteps) {
            handleNext();
            return;
        }

        // Validation finale de l'étape 3
        if (!validateStep3()) {
            notify.error('Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        // Soumettre les données
        registerMutation.mutate(values);
    };

    return (
        <AuthLayout>
            <AuthTabs active="register" />

            {/* Indicateur de progression */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    {[{
                        id: 1,
                        nom: "Identité"
                    }, {
                        id: 2,
                        nom: "Sécurité"
                    }, {
                        id: 3,
                        nom: "Informations"
                    }].map((step) => (
                        <div className='flex flex-col flex-1'>
                            <div key={step.id} className="flex items-center flex-1">
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-colors ${step.id < currentStep
                                        ? 'bg-green-600 text-white'
                                        : step.id === currentStep
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    {step.id < currentStep ? '✓' : step.id}
                                </div>
                                {step.id <= totalSteps && (
                                    <div
                                        className={`flex-1 h-1 mx-2 rounded transition-colors ${step.id < currentStep
                                            ? 'bg-green-600'
                                            : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                    />
                                )}
                            </div>
                            <span className='mt-2 text-xs text-gray-300 text-center'>Identité</span>
                        </div>
                    ))}
                </div>

            </div>

            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <AnimatePresence mode="wait">
                    {/* Étape 1: Informations de base */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            <FormSection
                                title="Informations de base"
                                description="Commençons par vos informations personnelles"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <TextField
                                        label="Prénom"
                                        name="first_name"
                                        type="text"
                                        value={values.first_name}
                                        onChange={handleChange}
                                        placeholder="Votre prénom"
                                        error={errors.first_name}
                                        required
                                    />
                                    <TextField
                                        label="Nom"
                                        name="last_name"
                                        type="text"
                                        value={values.last_name}
                                        onChange={handleChange}
                                        placeholder="Votre nom"
                                        error={errors.lastName}
                                        required
                                    />
                                </div>


                                <TextField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    placeholder="votre.email@upg.bi"
                                    error={errors.email}
                                    maxLength={254}
                                    required
                                />
                            </FormSection>
                        </motion.div>
                    )}

                    {/* Étape 2: Sécurité */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            <FormSection
                                title="Sécurité du compte"
                                description="Choisissez un mot de passe sécurisé"
                            >
                                <TextField
                                    label="Mot de passe"
                                    name="password"
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    error={errors.password}
                                    required
                                />

                                <TextField
                                    label="Confirmer le mot de passe"
                                    name="confirmPassword"
                                    type="password"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    error={errors.confirmPassword}
                                    required
                                />

                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        💡 <strong>Conseil:</strong> Utilisez au moins 8 caractères avec des lettres, chiffres et symboles.
                                    </p>
                                </div>
                            </FormSection>
                        </motion.div>
                    )}

                    {/* Étape 3: Informations supplémentaires */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            <FormSection
                                title="Informations complémentaires"
                                description="Ces informations sont optionnelles mais recommandées"
                            >
                                <div className="grid grid-cols-1 gap-4">
                                    <SingleSelectDropdown
                                        label='Genre'
                                        required={true}
                                        placeholder='genre'
                                        onChange={(value) => handleChange({ target: { name: 'gender', value } } as React.ChangeEvent<HTMLInputElement>)}
                                        options={GENDER_OPTIONS}
                                        value={values.gender || ''}
                                    />

                                    <CustomDatePicker
                                        value={values.birth_date || ''}
                                        onChange={(value) => handleChange({ target: { name: 'birth_date', value } } as React.ChangeEvent<HTMLInputElement>)}
                                        label="Date de naissance"
                                        placeholder="Sélectionner une date"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <TextField
                                        label="Numéro de téléphone"
                                        name="phone_number"
                                        type="tel"
                                        value={values.phone_number || ''}
                                        onChange={handleChange}
                                        placeholder="+25761234567"
                                        error={errors.phone_number}
                                        maxLength={20}
                                    />


                                    <SingleSelectDropdown
                                        label='État civil'
                                        required={false}
                                        placeholder='État civil'
                                        onChange={(value) => handleChange({ target: { name: 'marital_status', value } } as React.ChangeEvent<HTMLInputElement>)}
                                        options={MARITAL_STATUS_OPTIONS}
                                        value={values.marital_status || ''}
                                    />
                                </div>

                                <MultiSelectDropdown
                                    label="Langues parlées"
                                    placeholder='choisir des langues parlees'
                                    values={spokenLanguages}
                                    onChange={setSpokenLanguages}
                                    options={SPOKEN_LANGUAGES_OPTIONS}
                                />
                            </FormSection>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Boutons de navigation */}
                <div className="flex gap-3 pt-4">
                    {currentStep > 1 && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handlePrevious}
                            className="flex-1 inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400 px-4 py-2 text-base"
                        >
                            ← Précédent
                        </motion.button>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="flex-1 inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm hover:shadow-md px-4 py-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {registerMutation.isPending
                            ? 'Inscription en cours...'
                            : currentStep < totalSteps
                                ? 'Suivant →'
                                : "S'inscrire"}
                    </motion.button>
                </div>
            </motion.form>

            {/* Date Picker Modal */}
            <DatePickerModal
                isOpen={datePickerModal.isOpen}
                onClose={datePickerModal.close}
                onSelect={(date) => {
                    handleChange({ target: { name: 'birth_date', value: date } } as React.ChangeEvent<HTMLInputElement>);
                }}
                initialDate={values.birth_date || undefined}
            />

            {/* Footer aide */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center"
            >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Besoin d'aide ?{' '}
                    <a href="mailto:support@upg.bi" className="text-blue-700 dark:text-blue-400 hover:underline">
                        Contactez le support
                    </a>
                </p>
            </motion.div>
        </AuthLayout>
    );
}
