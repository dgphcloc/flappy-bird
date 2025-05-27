import AdminLayout from "./adminLayout";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";
import { SubscriptionProvider } from "@/context/SubscriptionProvider";
import { ProfileSubscriptionProvider } from "@/context/ProfileRealtimeContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SubscriptionProvider>
        <ProfileSubscriptionProvider>
          <Notifications position="top-right" zIndex={1000} />
          <AdminLayout>{children}</AdminLayout>
        </ProfileSubscriptionProvider>
      </SubscriptionProvider>
    </>
  );
}
