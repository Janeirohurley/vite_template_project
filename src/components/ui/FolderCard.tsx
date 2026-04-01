import { cn } from '@/lib/utils';
import { UserAvatar } from '../common/UserAvatar';
import { motion } from "framer-motion"

type FolderCardSize = 'sm' | 'md' | 'lg';

interface FolderCardProps {
    fullName: string;
    status: Status;
    date?: string;
    size?: FolderCardSize;
    className?: string;
    avatarUrl?: string;
    onClick?: () => void;
    requested_role: string;
    empty?: boolean;
    key: number | string
    isLoading?: boolean;
}

type Status = "pending" | "under_review" | "rejected" | "approved";

const statusStyles: Record<Status, string> = {
    pending:
        "bg-yellow-400/15 text-yellow-700 inset-ring-yellow-500/30",

    under_review:
        "bg-blue-400/15 text-blue-700 inset-ring-blue-500/30",

    rejected:
        "bg-red-400/15 text-red-700 inset-ring-red-500/30",

    approved:
        "bg-green-400/15 text-green-700 inset-ring-green-500/30",
};


interface StatusBadgeProps {
    status: Status;
    label?: string;
    className?: string;
}


const sizeClasses: Record<FolderCardSize, string> = {
    sm: 'w-40 h-28',
    md: 'w-60 h-40',
    lg: 'w-72 h-48',
};

const FolderCard = ({
    fullName,
    date,
    size = 'md',
    className = '',
    onClick,
    avatarUrl,
    status,
    requested_role,
    key,
    isLoading = false,
    empty = false
}: FolderCardProps) => {
    const dimensionClass = sizeClasses[size];

    return (
        <motion.div className={cn(className, "relative")} onClick={onClick} key={key}>
            <section className="relative group flex flex-col items-center justify-center w-max h-max">
                <div
                    className={`file relative ${dimensionClass} cursor-pointer origin-bottom perspective-[1500px] z-50`}
                >
                    <div className="work-5 bg-amber-600 w-full h-full origin-top rounded-2xl rounded-tl-none group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-20 after:h-4 after:bg-amber-600 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[15px] before:left-[75.5px] before:w-4 before:h-4 before:bg-amber-600 before:[clip-path:polygon(0_35%,0%_100%,50%_100%);]" />
                    {
                        !empty && <>
                            <div className="work-4 absolute inset-1 bg-zinc-400 rounded-2xl transition-all ease duration-300 origin-bottom select-none group-hover:transform-[rotateX(-20deg)]" />
                            <div className="work-3 absolute inset-1 bg-zinc-300 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:transform-[rotateX(-30deg)]" />
                            <div className="work-2 absolute inset-1 bg-zinc-200 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:transform-[rotateX(-38deg)]" />
                        </>
                    }

                    <div className="work-1 absolute bottom-0 bg-linear-to-t from-amber-500 to-amber-400 w-full h-[156px] rounded-2xl rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[146px] after:h-4 after:bg-amber-400 after:rounded-t-2xl before:absolute before:content-[''] before:-top-2.5 before:right-[142px] before:size-3 before:bg-amber-400 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);] transition-all ease duration-300 origin-bottom flex items-end group-hover:shadow-[inset_0_20px_40px_#fbbf24,inset_0_-20px_40px_#d97706] group-hover:transform-[rotateX(-46deg)_translateY(1px)]" />

                    {date && !empty && (
                        <span className="absolute right-0 bottom-1 p-2 transition-all ease duration-300 group-hover:transform-[rotateX(-46deg)_translateY(1px)] text-sm">
                            {date}
                        </span>
                    )}


                    {!empty && <StatusBadge status={status} />}
                </div>
                {empty && <div className='w-4/5 py-4 text-center'>Aucune demande de Comptes trouvee</div>}
            </section>
            {
                !empty && <div className="py-1 flex space-x-1 items-center">
                    <UserAvatar size="md" fullName={fullName} imageUrl={avatarUrl} />

                    <div>
                        <p className="font-semibold dark:text-white leading-tight">
                            {fullName}
                        </p>

                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                            {requested_role}
                        </span>
                    </div>
                </div>
            }

            {
                isLoading && <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex justify-center space-x-2 absolute inset-0 items-center z-50 pointer-events-none"
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                            className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full"
                        />
                    ))}
                </motion.div>



            }
        </motion.div>
    );
};

export default FolderCard;




export const StatusBadge = ({
    status,
    label,
    className = "",
}: StatusBadgeProps) => {
    return (
        <span
            className={`
        inline-flex items-center rounded-md px-2 py-1 text-xs font-medium
        inset-ring absolute top-0 right-1
        group-hover:translate-y-12 transition-all ease duration-300
        group-hover:transform-[rotateX(-46deg)_translateY(1px)]
        ${statusStyles[status]}
        ${className}
      `}
        >
            {label ?? status}
        </span>
    );
};
