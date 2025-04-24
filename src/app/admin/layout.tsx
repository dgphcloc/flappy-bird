import AdminLayout from "./adminLayout";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Notifications position="top-right" zIndex={1000} />
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}
