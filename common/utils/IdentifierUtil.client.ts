import ErrorUtil from '@common/utils/ErrorUtil';

import TerminalUtil from '@client-common/utils/TerminalUtil.client';
import ResponseValidator from '@client-common/utils/ResponseValidator';

export default class IdentifierUtil {
  /**
   * Get unique identifier for the current user/terminal.
   * Returns User ID if logged in (via API call), otherwise returns Terminal ID from localStorage.
   * This is a client-side utility.
   * 
   * @returns {Promise<string>} User ID if logged in, Terminal ID otherwise
   */
  public static async getIdentifier(): Promise<string> {
    try {
      // Try to get user ID from session
      const response = await fetch('/api/identifier', {
        method: 'GET'
      });
      
      ResponseValidator.ValidateResponse(response);
      
      const { identifier } = await response.json();
      if (identifier) {
        return identifier;
      }
    } catch (error) {
      // If identifier check fails, fall back to terminal ID
      ErrorUtil.throwError('Failed to get identifier from API', error);
    }
    
    // Fall back to terminal ID
    return await TerminalUtil.getTerminalId();
  }

  /**
   * Get terminal ID only (regardless of login status).
   * 
   * @returns {Promise<string>} Terminal ID
   */
  public static async getTerminalId(): Promise<string> {
    return await TerminalUtil.getTerminalId();
  }
}
