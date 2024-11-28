import { NextPage } from 'next';

export interface PageProps<T = Record<string, string>> {
  params: T;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};
