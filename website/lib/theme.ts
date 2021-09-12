import { ThemeConfig, extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export default extendTheme({
  config,
  styles: {
    global: {
      body: {
        backgroundColor: "#000",
      },
    },
  },
});
