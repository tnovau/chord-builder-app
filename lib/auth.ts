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

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const oneHourInSeconds = 60 * 60;

const getLanguageFromUrl = (url: string) => {
  const verificationUrl = new URL(url);

  const callbackURL = verificationUrl.searchParams.get("callbackURL");

  if (callbackURL) {
    const language = callbackURL.split("/")[1];
    return language;
  }
  return "en";
}

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
      if (!resend) {
        console.log(user, url, token);
        return;
      }

      const language = getLanguageFromUrl(url);
      console.log(language);

      /**
       * @todo Use a proper email template and styling for the verification email
       * @todo Handle errors when sending the email and implement retry logic if necessary
       * @todo Put in parameter the sender of the email.
       * @todo Change template by language using callbackUrl searchparam in url (with format like &callbackURL=%2Fen)
       * and using it in the template to display the correct language in the email, and also put the email subject in the correct language by using the same callbackUrl searchparam in url (with format like &callbackURL=%2Fen)
       */

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
