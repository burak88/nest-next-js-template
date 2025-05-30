import React from "react";
import "../../globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning >
      <body className="overflow-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
