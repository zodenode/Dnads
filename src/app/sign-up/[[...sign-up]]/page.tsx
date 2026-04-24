import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-[var(--card)] border border-[var(--border)] shadow-xl",
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/results"
        fallbackRedirectUrl="/results"
      />
    </main>
  );
}
