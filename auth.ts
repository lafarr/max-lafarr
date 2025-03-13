import NextAuth from 'next-auth';
import { fetchQuery } from 'convex/nextjs';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { api } from '@/convex/_generated/api';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Constant-time dummy hash — used when no user is found to prevent
// timing attacks that could reveal valid email addresses.
const DUMMY_HASH = '$2b$10$invalidhashusedtomaintaintimingXXXXXXXXXXXXXXXXXXXXXX';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {return null;}

        const { email, password } = parsed.data;

        let user: { id: string; email: string; password_hash: string } | null = null;
        try {
          user = await fetchQuery(api.music.getUserByEmail, { email });
        } catch {
          return null;
        }

        // Always run bcrypt to prevent timing-based user enumeration.
        const hashToCompare = user != null ? user.password_hash : DUMMY_HASH;
        const isValid = await bcrypt.compare(password, hashToCompare);
        if (!isValid || user == null) {return null;}

        return { id: user.id, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user }) {
      // `user` is only present on initial sign-in; on subsequent
      // token refreshes NextAuth passes it as undefined at runtime
      // despite the types claiming otherwise.
      const userId = (user as Record<string, unknown> | undefined)?.id;
      if (userId != null) {
        token.id = userId;
      }
      return token;
    },
    session({ session, token }) {
      if (typeof token.id === 'string') {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
