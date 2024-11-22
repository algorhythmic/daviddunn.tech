import { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { RateLimit } from './rate-limit';

export type AuthError = 
  | 'CredentialsSignin'
  | 'RateLimit'
  | 'InvalidInput';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        try {
          // Check rate limit
          const identifier = await RateLimit.getIdentifier();
          const rateLimit = await RateLimit.check(identifier);
          
          if (!rateLimit.success) {
            throw new Error('RateLimit');
          }

          // Validate input
          const result = loginSchema.safeParse(credentials);
          if (!result.success) {
            throw new Error('InvalidInput');
          }

          const { username, password } = result.data;

          if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            // Reset rate limit on successful login
            RateLimit.reset(identifier);
            
            return {
              id: '1',
              name: 'Admin',
              email: process.env.ADMIN_EMAIL,
            };
          }

          throw new Error('CredentialsSignin');
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('CredentialsSignin');
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};
