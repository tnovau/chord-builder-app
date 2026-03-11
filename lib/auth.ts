import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Resend } from "resend";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is not set or is empty. " +
      "Please configure DATABASE_URL in your environment before starting the application.",
  );
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

const resend = new Resend(process.env.RESEND_API_KEY);

const oneHourInSeconds = 60 * 60;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url, token }) {
      await resend.emails.send({
        from: "ChordBuilder <noreply@updates.ontheedge.cloud>",
        to: user.email,
        subject: "Verify your email — ChordBuilder",
        html: `
          <h2>Welcome to ChordBuilder!</h2>
          <p>Click the link below to verify your email address:</p>
          <p><a href="${url}">Verify Email</a></p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        `,
      });
    },
    expiresIn: oneHourInSeconds,
  },
  plugins: [nextCookies()],
});
