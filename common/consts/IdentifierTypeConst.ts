/**
 * Identifier type constants.
 */
export const IDENTIFIER_TYPES = ['user', 'terminal', 'none'] as const;

/**
 * User identifier type (authenticated user).
 */
export const IDENTIFIER_TYPE_USER = IDENTIFIER_TYPES[0];

/**
 * Terminal identifier type (anonymous terminal).
 */
export const IDENTIFIER_TYPE_TERMINAL = IDENTIFIER_TYPES[1];

/**
 * None identifier type (no identifier available).
 */
export const IDENTIFIER_TYPE_NONE = IDENTIFIER_TYPES[2];

