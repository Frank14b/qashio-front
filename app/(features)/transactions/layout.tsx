import { ReactNode } from 'react';
import PageLayout from '@/components/PageLayout';

export default function TransactionsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <PageLayout>{children}</PageLayout>;
}