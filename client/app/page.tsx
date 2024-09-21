'use client';

import useCurrentUser from '@/hooks/use-user';

export default function Home() {
  const currentUser = useCurrentUser();

  return (
    <>
      {currentUser && currentUser.id && (
        <>
          <h1>Hello world!</h1>
          <p>Paragraph</p>
        </>
      )}
    </>
  );
}
