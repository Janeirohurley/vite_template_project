import * as React from 'react';
import { cn } from '@/lib/utils'; // garde ton utilitaire cn si tu l’as, sinon je te le mets plus bas

// Avatar principal
export const Avatar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'relative flex shrink-0 overflow-hidden rounded-full',
            className
        )}
        {...props}
    />
));
Avatar.displayName = 'Avatar';

// Image de l'avatar
export const AvatarImage = React.forwardRef<
    HTMLImageElement,
    React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, alt = '', ...props }, ref) => (
    <img
        ref={ref}
        alt={alt}
        className={cn('aspect-square h-full w-full object-cover', className)}
        {...props}
    />
));
AvatarImage.displayName = 'AvatarImage';

// Fallback (initiales, icône, etc.)
export const AvatarFallback = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground',
            className
        )}
        {...props}
    />
));
AvatarFallback.displayName = 'AvatarFallback';