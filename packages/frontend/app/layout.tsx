import React from 'react'
import Link from 'next/link'

const layout = ({children,}: {children: React.ReactNode}) => {
  return (
    <html>
        <body>
            <nav>
                <Link href="/">HOME</Link>
                <Link href="/countries">COUNTRIES</Link>
                <Link href="/payments">PAYMENTS</Link>
                
            </nav>
            {children}
        </body>
    </html>
  );
};

export default layout