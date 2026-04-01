import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";

// Status helpers
export default function getStatusInfo(status: string, publishedDate?: string | null) {
    if (publishedDate) {
        return {
            label: 'Emploi du Temps Officiel',
            icon: <CheckCircle2 className="w-5 h-5" />,
            badge: <Badge className="bg-green-600 hover:bg-green-700 text-white rounded-md">Publié</Badge>,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-800'
        };
    }

    switch (status) {
        case 'Planned':
            return {
                label: 'Emploi du Temps Provisoire',
                icon: <Clock className="w-5 h-5" />,
                badge: <Badge className='rounded-md' variant="secondary">Brouillon</Badge>,
                color: 'text-blue-600 dark:text-blue-400',
                bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                borderColor: 'border-blue-200 dark:border-blue-800'
            };
        case 'Completed':
            return {
                label: 'Emploi du Temps Terminé',
                icon: <CheckCircle2 className="w-5 h-5" />,
                badge: <Badge className="bg-gray-600 hover:bg-gray-700 rounded-md">Terminé</Badge>,
                color: 'text-gray-600 dark:text-gray-400',
                bgColor: 'bg-gray-50 dark:bg-gray-900/20',
                borderColor: 'border-gray-200 dark:border-gray-800'
            };
        case 'Cancelled':
            return {
                label: 'Emploi du Temps Annulé',
                icon: <XCircle className="w-5 h-5" />,
                badge: <Badge variant="destructive" className='rounded-md'>Annulé</Badge>,
                color: 'text-red-600 dark:text-red-400',
                bgColor: 'bg-red-50 dark:bg-red-900/20',
                borderColor: 'border-red-200 dark:border-red-800'
            };
        default:
            return {
                label: 'Emploi du Temps',
                icon: <FileText className="w-5 h-5" />,
                badge: <Badge variant="outline" className='rounded-md'>{status}</Badge>,
                color: 'text-gray-600 dark:text-gray-400',
                bgColor: 'bg-gray-50 dark:bg-gray-900/20',
                borderColor: 'border-gray-200 dark:border-gray-800'
            };
    }
}