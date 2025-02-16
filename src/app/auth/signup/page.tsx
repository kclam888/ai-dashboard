'use client';

import { useSession } from 'next-auth/react';

export default function SignUpPage() {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {session ? (
        <p>You are already signed in.</p>
      ) : (
        <p>Sign up form will go here</p>
      )}
    </div>
  );
}