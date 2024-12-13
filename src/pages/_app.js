import "@/styles/globals.css";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  // Fix hydration synchronization
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
