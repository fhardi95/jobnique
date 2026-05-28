import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        mode: { label: "Mode", type: "text" },
      },
      async authorize(credentials) {
        // TODO: Replace with real DB lookup (Prisma, Supabase, etc.)
        // Example with Prisma:
        // const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        // const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        // if (!valid) return null;
        // return user;

        // Demo: accept any valid email/password for now
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            email: credentials.email as string,
            name: (credentials.name as string) || "User",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) session.user.id = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});
