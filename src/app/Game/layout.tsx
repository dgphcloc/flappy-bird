import { Providers } from "@/components/providers";
import "../styles/global.css";
import { MantineProvider } from "@mantine/core";
import Head from "next/head";
import { Kavoon } from "next/font/google";

const kavoon = Kavoon({ weight: "400", subsets: ["latin"] });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>Trang của tôi</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        ></meta>
      </Head>
      <body className={kavoon.className}>
        <MantineProvider>
          <Providers>{children}</Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
