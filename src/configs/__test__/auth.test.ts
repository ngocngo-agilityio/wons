import { authConfig } from '../auth.config';
import { ProviderType } from 'next-auth/providers';

// Constants
import { ROUTES } from '@/constants';

describe('authConfig', () => {
  describe('pages', () => {
    it('should have the correct signIn route', () => {
      expect(authConfig.pages.signIn).toBe(ROUTES.SIGN_IN);
    });
  });

  describe('callbacks', () => {
    describe('jwt', () => {
      it('should merge user into token', async () => {
        const token = { accessToken: 'token123' };
        const user = { id: '123', name: 'John' };
        const account = {
          provider: 'credentials',
          type: 'account' as ProviderType,
          providerAccountId: '123',
        }; // Mock account
        const result = await authConfig.callbacks.jwt({
          token,
          user,
          account,
        });
        expect(result).toMatchObject({ ...token, ...user });
      });

      it('should merge session into token', async () => {
        const token = { accessToken: 'token123' };
        const user = { id: '123', name: 'John' };
        const session = { user: { id: '456' } };
        const account = {
          provider: 'credentials',
          type: 'account' as ProviderType,
          providerAccountId: '123',
        }; // Mock account
        const result = await authConfig.callbacks.jwt({
          user,
          token,
          session,
          account,
        });
        expect(result).toMatchObject({ ...token, ...session });
      });
    });
  });

  describe('session', () => {
    it('should have a maxAge of 1 day', () => {
      expect(authConfig.session.maxAge).toBe(60 * 60 * 24);
    });
  });

  describe('providers', () => {
    it('should be empty by default', () => {
      expect(authConfig.providers).toEqual([]);
    });
  });
});
