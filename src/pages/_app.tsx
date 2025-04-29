import "@/styles/globals.css";
import "@/styles/style_patient.css";
import "@/styles/style_medicine.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import Head from "next/head";
import { Inter, Roboto, Varela_Round } from "next/font/google";
import { appWithTranslation } from 'next-i18next';

// Define fonts with display=optional
const inter = Inter({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-inter",
});

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "optional",
  variable: "--font-roboto",
});

const varelaRound = Varela_Round({
  weight: "400",
  subsets: ["latin"],
  display: "optional",
  variable: "--font-varela-round",
});

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Bootstrap CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
          crossOrigin="anonymous"
        />

        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />

        {/* Material Icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

      {/* Add font variables to body */}
      <style jsx global>{`
        body {
          font-family: ${roboto.style.fontFamily}, sans-serif;
          --font-inter: ${inter.style.fontFamily};
          --font-roboto: ${roboto.style.fontFamily};
          --font-varela-round: ${varelaRound.style.fontFamily};
        }
      `}</style>

      {/* Bootstrap JS Bundle */}
      <Script
        id="bootstrap-cdn"
        strategy="afterInteractive"
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
        crossOrigin="anonymous"
      />

      <Component {...pageProps} />
    </>
  );
}

// ✅ Wrap your app with next-i18next
export default appWithTranslation(App);
