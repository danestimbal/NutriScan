/**
 * The owner admin account. It always has admin rights and is the only account
 * that can grant or remove admin rights for others.
 *
 * Keep this in sync with OWNER_EMAIL in firestore.rules, which is what actually
 * enforces access on the server.
 */
export const OWNER_ADMIN_EMAIL = 'danesensei@gmail.com';

/** Placeholder email the app gives local guest profiles. */
export const GUEST_PLACEHOLDER_EMAIL = 'guest@ingreguide.ph';

export type AdminRole = 'loading' | 'none' | 'admin' | 'owner';
