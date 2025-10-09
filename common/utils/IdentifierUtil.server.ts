import { Session } from 'next-auth';

import SessionUtil from '@client-common/utils/SessionUtil.server';

export default class IdentifierUtil {
  /**
   * Get unique identifier for the current user/terminal.
   * Returns User ID if logged in, otherwise returns null (terminal ID should be used on client side).
   * This is a server-side utility.
   * 
   * @returns {Promise<string | null>} User ID if logged in, null otherwise
   */
  public static async getIdentifier(): Promise<string | null> {
    const session = await SessionUtil.getSession();
    
    if (session) {
      return await this.getUserId(session);
    }
    
    return null;
  }

  /**
   * Get user ID from session.
   * 
   * @param {Session} session - The session object
   * @returns {Promise<string | null>} User ID or null
   */
  private static async getUserId(session: Session): Promise<string | null> {
    return await SessionUtil.getGoogleUserIdFromSession(session);
  }
}
