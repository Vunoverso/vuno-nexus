import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
// ou outro provider como GoogleProvider, EmailProvider...

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub
      return session
    }
  }
}

export default NextAuth(authOptions)
