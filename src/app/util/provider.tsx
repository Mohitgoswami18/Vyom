'use client'; 
import { SessionProvider } from "next-auth/react";

const provider = ({children} : {children: React.ReactNode}) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default provider
