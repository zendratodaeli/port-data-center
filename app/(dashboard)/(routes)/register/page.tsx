import { format } from 'date-fns';
import PasswordClient from './components/client';
import prisma from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { PasswordColumn } from './components/columns';
import { redirect } from 'next/navigation';

const PasswordPage = async () => {
  const { userId } = auth();

  const listAdminId = [
    { adminId1: "user_2il1XkfhJFtxhMslrBq1JK6PapV" },
    { adminId2: "user_2il3sWCyhA35P1GvOuVsaPEsyrr" },
  ];

  const isAdmin = listAdminId.some((admin) =>
    Object.values(admin).includes(userId)
  );

  if (!userId || !isAdmin) {
    redirect("/data")
  }

  const passwords = await prisma.password.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedpasswords: PasswordColumn[] = passwords.map((password) => ({
    id: password.id,
    userName: password.userName,
    password: password.password,
    createdAt: format(password.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <PasswordClient data={formattedpasswords} />
      </div>
    </div>
  );
};

export default PasswordPage;