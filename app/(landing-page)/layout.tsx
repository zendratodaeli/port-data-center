import NavbarLadingPage from '@/components/navbar-landing-page';
import React from 'react'

const LandingLayout = ({
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
