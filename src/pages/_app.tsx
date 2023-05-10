import '@/styles/globals.css'
import '@/styles/style_patient.css'
import '@/styles/style_medicine.css'
import type { AppProps } from 'next/app'
import Script from "next/script";
import Head from "next/head";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossOrigin="anonymous"/>
    {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Varela+Round"/> */}
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>
      {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"crossOrigin="anonymous"/> */}
    </Head>
    <Script
    id="bootstrap-cdn"
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" />
  
  <Component {...pageProps} />
    </>
  );
}
