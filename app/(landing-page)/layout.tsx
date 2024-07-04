import NavbarLadingPage from '@/components/navbar-landing-page';
import React from 'react'

const LandingLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  
  return (
    <main>
      {children}
    </main>
  )
}

export default LandingLayout;
