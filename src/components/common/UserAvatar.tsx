import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
    fullName: string;
    imageUrl?: string | null;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    onClick?: () => void

}

const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
};

export function UserAvatar({
    fullName,
    imageUrl,
    size = 'md',
    className,
    onClick
}: UserAvatarProps) {
    const initials = fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const dicebearUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        fullName
    )}&backgroundColor=6366f1,8b5cf6,ec4899,ef4444,14b8a6,f59e0b`;

    return (
        <Avatar onClick={onClick} className={cn(sizes[size], className)}>
            {/* 1. Photo réelle si elle existe */}
            {imageUrl ? (
                <AvatarImage src={imageUrl} alt={fullName} />
            ) : (
                /* 2. Sinon → avatar généré par Dicebear */
                <AvatarImage src={dicebearUrl} alt={fullName} />
            )}

            {/* 3. Fallback : initiales */}
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    );
}