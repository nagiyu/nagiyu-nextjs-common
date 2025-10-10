/**
 * Identifier type constants.
 */

/**
 * User identifier type (authenticated user).
 */
export const IDENTIFIER_TYPE_USER = 'user' as const;

/**
 * Terminal identifier type (anonymous terminal).
 */
export const IDENTIFIER_TYPE_TERMINAL = 'terminal' as const;

/**
 * None identifier type (no identifier available).
 */
export const IDENTIFIER_TYPE_NONE = 'none' as const;
