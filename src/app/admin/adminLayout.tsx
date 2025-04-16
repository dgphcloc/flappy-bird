"use client";
import { ReactNode } from "react";
import { AppShell, Burger, Group, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Navigation from "@/components/navigation/navigation";

type Props = {
  children: ReactNode;
};
export default function AdminLayout({ children }: Props) {
  console.log("main layout");
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
    >
      <AppShell.Header style={{ backgroundColor: "#4c6ef5" }}>
        <Group h="100%" px="md">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar style={{ backgroundColor: "#4c6ef5" }}>
        <Navigation />
      </AppShell.Navbar>
      <AppShell.Main>
        <Box bg="#F1F3F5">{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}
