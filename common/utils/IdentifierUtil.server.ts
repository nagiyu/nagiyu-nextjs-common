import { Session } from 'next-auth';

import SimpleAuthService from '@common/services/auth/SimpleAuthService';

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
   * Gets the GoogleUserId from session, then looks up the AuthData to get the actual UserID.
   * 
   * @param {Session} session - The session object
   * @returns {Promise<string | null>} User ID or null
   */
  private static async getUserId(session: Session): Promise<string | null> {
    const googleUserId = await SessionUtil.getGoogleUserIdFromSession(session);
    
    if (!googleUserId) {
      return null;
    }

    const authService = new SimpleAuthService();
    const authData = await authService.getByGoogleUserId(googleUserId);
    
    return authData?.id || null;
  }
}
