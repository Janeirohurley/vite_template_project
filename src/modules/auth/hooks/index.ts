// Authentication
export { useLogin } from './useLogin'
export { useRegister } from './useRegister'

// Password Management
export { useForgotPassword } from './useForgotPassword'
export { useChangePassword } from './useChangePassword'
export { useResetPasswordWithOTP } from './usePasswordReset'

// Email Verification
export { useSendEmailOTP, useVerifyEmailOTP } from './useEmailVerification'

// Token Management
export { useVerifyToken } from './useVerifyToken'
export { useTokenRefresh, refreshToken } from './useTokenRefresh'

// Two-Factor Authentication - Setup
export {
    useSetEmail2FA,
    useSetTOTP2FA,
    useSetStatic2FA,
} from './useTwoFactorAuth'

// Two-Factor Authentication - Verification
export {
    useVerifyEmail2FA,
    useVerifyTOTP2FA,
    useVerifyStatic2FA,
} from './useTwoFactorAuth'

// Two-Factor Authentication - Disable
export {
    useDisableEmail2FA,
    useDisableTOTP2FA,
    useDisableStatic2FA,
} from './useTwoFactorAuth'

// Two-Factor Authentication - Login
export {
    useEmail2FALogin,
    useTOTP2FALogin,
    useStatic2FALogin,
} from './useTwoFactorAuth'

// Error Handling
export { useErrorHandler } from './useErrorHandler'

// get connected user

export {useUser}  from "./useUser"

// auth reconnect
export { useAuthReconnectState, useAuthReconnectController } from './useAuthReconnect'
