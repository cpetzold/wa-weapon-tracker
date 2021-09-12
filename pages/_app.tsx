import {
  CSSReset,
  ChakraProvider,
  ColorModeProvider,
  extendTheme,
} from "@chakra-ui/react";

import type { AppProps } from "next/app";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "#000",
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <CSSReset />
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}
