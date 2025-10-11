import { IDENTIFIER_TYPES } from '@client-common/consts/IdentifierTypeConst';

/**
 * Type of identifier.
 */
export type IdentifierType = typeof IDENTIFIER_TYPES[keyof typeof IDENTIFIER_TYPES];


