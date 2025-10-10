/**
 * Response type for identifier API endpoint.
 */
export interface IdentifierResponse {
  identifier: string | null;
  type: 'user' | 'terminal' | 'none';
}
