import { CSSReset, ChakraProvider, ColorModeProvider } from "@chakra-ui/react";

import type { AppProps } from "next/app";
import theme from "../lib/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider
        options={{ useSystemColorMode: false, initialColorMode: "dark" }}
      >
        <CSSReset />
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}
