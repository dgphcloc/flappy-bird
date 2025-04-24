import { Providers } from "@/components/providers";
import { MantineProvider } from "@mantine/core";
import "@mantine/charts/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Admin</title>
        <link rel="stylesheet" href="/fonts/fonts.css" />
      </head>
      <body>
        <MantineProvider
          theme={{
            components: {
              Burger: {
                styles: {
                  root: {
                    "--burger-color": "white",
                  },
                },
              },
            },
          }}
        >
          <Providers>{children}</Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
