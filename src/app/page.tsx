"use client";
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {

  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Name: {session.user?.name}</p>
        <img src={session.user?.image ?? ""} className="w-24" />
        <p>
          <button onClick={() => signOut()}>Sign Out</button>
        </p>
      </div>
    );
  }

  return (
    <p>
      You are not logged in, <button onClick={() => signIn('github')}>sign in here</button>.
    </p>
  )
}
