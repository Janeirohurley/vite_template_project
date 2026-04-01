/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/errorMessages.ts

export const ERROR_CODES_REQUIRING_LOGIN = [
    'Unauthorized',
    'InvalidToken',
    'TokenExpired',
];

export const ERROR_CODES_REQUIRING_EMAIL_VERIFICATION = [
    'EmailNotVerified',
];

export const ERROR_CODES_REQUIRING_2FA_SETUP = [
    'Email2FANotSet',
    'TOTP2FANotSet',
    'Static2FANotSet',
];

export const ERROR_CODES_REQUIRING_2FA_LOGIN = [
    'requires_2fa',
];

export function formatDjangoErrors(
    errors: Record<string, string[]> | string[] | string | null | undefined
): Record<string, string> {
    if (!errors) return {};

    if (typeof errors === 'string') {
        return { general: errors };
    }

    if (Array.isArray(errors)) {
        return { general: errors.join(', ') };
    }

    const formatted: Record<string, string> = {};
    for (const [k, v] of Object.entries(errors)) {
        const first = Array.isArray(v) ? v[0] : (v as unknown as string);
        formatted[k] = first;
    }
    return formatted;
}

export function extractErrorCode(errorResponse: {
    message?: string;
    errors?: Record<string, string[]> | string[] | string | null;
    typeError?: string;
}): string {
    if (!errorResponse) return 'UnknownError';

    if (errorResponse.typeError) return errorResponse.typeError;

    if (typeof errorResponse.errors === 'string' && errorResponse.errors) {
        return errorResponse.errors;
    }

    if (errorResponse.message) {
        return errorResponse.message;
    }

    if (Array.isArray(errorResponse.errors) && errorResponse.errors.length > 0) {
        return errorResponse.errors[0];
    }

    if (errorResponse.errors && typeof errorResponse.errors === 'object') {
        const first = Object.values(errorResponse.errors)[0];
        if (Array.isArray(first) && first.length > 0) return first[0];
        if (typeof first === 'string') return first;
    }

    return 'UnknownError';
}


export type ErrorRedirectAction =
    | { type: 'login' }
    | { type: 'verify-email'; email?: string; from?: string }
    | { type: '2fa-setup'; method?: string; extra?: any }
    | { type: '2fa-login'; method?: string; extra?: any }
    | { type: 'none' };

export function getErrorRedirectAction(errorCode: string, extra?: any): ErrorRedirectAction {
    if (ERROR_CODES_REQUIRING_LOGIN.includes(errorCode)) {
        return { type: 'login' };
    }

    if (ERROR_CODES_REQUIRING_EMAIL_VERIFICATION.includes(errorCode)) {
        return { type: 'verify-email', email: extra?.email };
    }

    if (ERROR_CODES_REQUIRING_2FA_SETUP.includes(errorCode)) {
        const method =
            Array.isArray(extra?.methods) && extra.methods.length > 0
                ? extra.methods[0]
                : errorCode === 'Email2FANotSet'
                    ? 'email'
                    : errorCode === 'TOTP2FANotSet'
                        ? 'totp'
                        : errorCode === 'Static2FANotSet'
                            ? 'static'
                            : extra?.method;

        return { type: '2fa-setup', method, extra };
    }
    if (ERROR_CODES_REQUIRING_2FA_LOGIN.includes(errorCode)) {
        const method =
            Array.isArray(extra?.methods) && extra.methods.length > 0
                ? extra.methods.join(',')
                : extra?.method;
        return { type: '2fa-login', method, extra };
    }

    return { type: 'none' };
}
