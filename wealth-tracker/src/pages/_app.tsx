import { AppProps } from "next/app";
import "../styles/index.css";
import "../styles/global.scss";
import ApiProvider from "../contexts/ApiContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApiProvider>
      <Component {...pageProps} />
    </ApiProvider>
  );
}

export default MyApp;
