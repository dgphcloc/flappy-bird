import { Providers } from "@/components/providers";
import { MantineProvider } from "@mantine/core";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>
          <Providers>{children}</Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
