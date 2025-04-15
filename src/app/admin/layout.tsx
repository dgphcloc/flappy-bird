import { Providers } from "@/components/providers";
import { MantineProvider } from "@mantine/core";
import AdminLayout from "./adminLayout";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
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
                    "--burger-color": "white",
                  },
                },
              },
            },
          }}
        >
          <Notifications position="top-right" zIndex={1000} />
          <Providers>
            <AdminLayout>{children}</AdminLayout>
          </Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
