import { GuestOnlyRoute, type GuestOnlyRouteProps } from "./GuestOnlyRoute"

/**
 * HOC pour créer une route réservée aux invités
 *
 * @example
 * const GuestLoginPage = withGuestOnlyRoute(LoginPage)
 */
export function withGuestOnlyRoute<P extends object>(
    Component: React.ComponentType<P>,
    options?: Omit<GuestOnlyRouteProps, 'children'>
) {
    return function GuestOnlyComponent(props: P) {
        return (
            <GuestOnlyRoute {...options}>
                <Component {...props} />
            </GuestOnlyRoute>
        )
    }
}
