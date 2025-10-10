import {
  IDENTIFIER_TYPE_USER,
  IDENTIFIER_TYPE_TERMINAL,
  IDENTIFIER_TYPE_NONE
} from '@client-common/consts/IdentifierTypeConst';

/**
 * Type of identifier.
 */
export type IdentifierType =
  | typeof IDENTIFIER_TYPE_USER
  | typeof IDENTIFIER_TYPE_TERMINAL
  | typeof IDENTIFIER_TYPE_NONE;

