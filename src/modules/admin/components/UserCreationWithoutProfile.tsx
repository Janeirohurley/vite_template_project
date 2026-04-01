import { UserCreationForm } from "@/modules/student-service/components/inscription-steps/UserCreationForm";
import { Modal } from "./academic";

interface UserCreationWithoutProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export function UserCreationWithoutProfile({ isOpen, onClose, onComplete }: UserCreationWithoutProps) {
    return (
        <Modal
            isOpen={isOpen}
            title="Création d' un utilisateur"
            onClose={onClose}
            subHeaderChildren={
                <div className="p-3 mt-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        💡 <strong>Note:</strong> Un compte sera créé avec ces informations. L'utilisateur pourra se connecter avec son email et mot de passe, puis vérifier son email et configurer son profil.
                    </p>
                </div>
            }
        >
            <UserCreationForm
                onUserCreated={onComplete}
                onCancel={onClose}
            />


        </Modal>

    )
}

