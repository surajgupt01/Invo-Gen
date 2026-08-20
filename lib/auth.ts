import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/prisma/prisma";

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
      lastLogin: {
        type: "date",
        required: false,
      },
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          // Runs whenever a user logs in and a session record is created
          try {
            if (session?.userId) {
              await prisma.user.update({
                where: { id: session.userId },
                data: {
                  lastLogin: new Date(),
                },
              });
            }
          } catch (err) {
            console.error("[BETTER_AUTH_LAST_LOGIN_HOOK_ERROR]:", err);
          }
          return { data: session };
        },
      },
    },
  },
});