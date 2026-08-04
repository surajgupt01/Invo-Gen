import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/prisma/prisma"; // Adjust path to your prisma client instance

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  // Automatically includes your custom User fields in the session object
  user: {
    additionalFields: {
      subscription: {
        type: "boolean",
        defaultValue: false,
      },
      Downloads: {
        type: "number",
        defaultValue: 0,
      },
      Storage: {
        type: "number",
        defaultValue: 0,
      },
    },
  },
});