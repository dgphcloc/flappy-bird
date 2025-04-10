import { Providers } from "@/components/providers";
import { MantineProvider } from "@mantine/core";
import AdminLayout from "./adminLayout";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MantineProvider 
        theme={{
    components: {
      Burger: {
        styles: {
          root: {
            '--burger-color': 'white',
          },
        },
      },
    },
  }}>
          <Providers>
            <AdminLayout>
            {children}
            </AdminLayout>
            </Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
