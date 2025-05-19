// pages/dashboard.tsx
import { getSession, signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Bem-vindo, {session?.user?.email}</h1>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Sair
      </button>
    </main>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  return { props: { session } };
}