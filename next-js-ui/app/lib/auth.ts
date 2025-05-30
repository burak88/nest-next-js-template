import axios, { HttpStatusCode } from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: (1 * 24 * 60 * 60) / 2,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        email: {
          label: "Kullanıcı Adı",
          type: "email",
        },
        password: {
          label: "Kullanıcı Şifresi",
          type: "password",
        },
      },
      async authorize(credentials): Promise<any> {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            email: credentials!.email,
            password: credentials!.password,
          }
        );
        if (response.status === HttpStatusCode.Created) {
          const loginResponse = response.data;
          return {
            id: loginResponse.user.id,
            email: loginResponse.user.email,
            role: loginResponse.user.role,
            accessToken: loginResponse.accessToken,
          };
        } else {
          return response.data;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.email = token.email!; // Add email to the session
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
