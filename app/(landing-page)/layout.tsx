import prisma from '@/lib/prismadb';
import React from 'react'

const LandingLayout = async ({
  children
}: {
  children: React.ReactNode
}) => {

  return (
    <main className=' bg-gradient-to-r from-slate-100 to-white'>
      {children}
    </main>
  )
}

export default LandingLayout;
