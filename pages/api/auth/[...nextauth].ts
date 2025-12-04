import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 Login attempt:', credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          throw new Error('Email and password required');
        }

        // Use raw query to avoid schema mismatch
        const users = await prisma.$queryRaw<any[]>`
          SELECT id, email, name, password, role, avatar,
                 "hasChangedDefaultPassword", "lastLoginAt"
          FROM users
          WHERE email = ${credentials.email}
        `;

        console.log('📊 Query returned', users.length, 'users');

        const user = users[0];

        if (!user) {
          console.log('❌ User not found:', credentials.email);
          throw new Error('Invalid credentials');
        }

        console.log('✅ User found:', user.email, 'Role:', user.role);

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        console.log('🔑 Password valid:', isPasswordValid);

        if (!isPasswordValid) {
          console.log('❌ Invalid password for:', credentials.email);
          throw new Error('Invalid credentials');
        }

        console.log('✅ User authenticated:', { email: user.email, role: user.role });

        // Update last login timestamp with raw query
        await prisma.$executeRaw`
          UPDATE users
          SET "lastLoginAt" = ${new Date()}, "updatedAt" = ${new Date()}
          WHERE id = ${user.id}
        `;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          hasChangedDefaultPassword: user.hasChangedDefaultPassword || false,
          membershipTier: 'FREE', // Default for now
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
        token.hasChangedDefaultPassword = user.hasChangedDefaultPassword;
        token.membershipTier = user.membershipTier || 'FREE';
        console.log('JWT callback - setting role:', user.role);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.user.hasChangedDefaultPassword = token.hasChangedDefaultPassword;
        session.user.membershipTier = token.membershipTier || 'FREE';
        console.log('Session callback - user role:', token.role);
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 8 * 60 * 60, // 🔒 SECURITY: 8 hours - session expires
  },
  jwt: {
    maxAge: 8 * 60 * 60, // 🔒 SECURITY: 8 hours - token expires
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
