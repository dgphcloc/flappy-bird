import "@mantine/core/styles.css"; // Import global styles
import { MantineProvider } from "@mantine/core";

export function Providers({ children }: { children: React.ReactNode }) {
  return <MantineProvider withGlobalClasses>{children}</MantineProvider>;
}
