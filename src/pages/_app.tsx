import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Project Management System</title>
      </Head>
      
      {isLoginPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  );
}

export default MyApp; 