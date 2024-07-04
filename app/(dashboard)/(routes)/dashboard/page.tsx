import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prismadb'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const DashboardPage = async () => {
  const { userId } = auth();
  const listAdminId = ["user_2il1XkfhJFtxhMslrBq1JK6PapV"];
  
  if (!userId || !listAdminId.includes(userId)) {
    return (
      <div className=' space-y-4 p-8 pt-6'>
        <p className=' text-xl md:text-2xl lg:text-4xl text-center font-semibold'>Access Denied</p>
        <Separator/>
        <p className=' text-center'>You do not have permission to view this page.</p>
      </div>
    );
  }

  const totalVessels = await prisma.data.findMany();

  return (
    <div className=' space-y-4 p-8 pt-6'>
      <p className=' text-xl md:text-2xl lg:text-4xl text-center font-semibold'>Analyzing Port Performance</p>
      <Separator/>
      {/* <UserIdPage/> */}
      <p>{totalVessels.length}</p>
    </div>
  );
}

export default DashboardPage;