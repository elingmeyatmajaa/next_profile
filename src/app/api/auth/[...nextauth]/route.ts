// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // kirim pakai FormData, sesuai API login kamu
        const formData = new FormData();
        formData.append("email", credentials?.email || "");
        formData.append("password", credentials?.password || "");

        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          method: "POST",
          body: formData, // ⬅️ pakai FormData
        });

        const data = await res.json();

        if (res.ok && data?.data?.user) {
          return data.data.user; // ✅ user ke session
        }
        return null; // ❌ gagal
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

// bikin handler dari authOptions
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
