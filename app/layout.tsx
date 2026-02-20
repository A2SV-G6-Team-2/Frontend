import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpendWise",
  description: "Personal Expense & Social Debt Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

