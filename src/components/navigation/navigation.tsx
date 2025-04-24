"use client";
import { NavLink, Box, Title, Button } from "@mantine/core";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { MdDashboard, MdPeople, MdLogout } from "react-icons/md";
import { useRouter } from "next/navigation";
import classes from "./navigation.module.css";
import { PATH_ADMIN } from "@/routes";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const mockdata = [
  {
    title: "Dashboard",
    links: [
      { label: "dashboard", icon: MdDashboard, link: PATH_ADMIN.root },
      { label: "users", icon: MdPeople, link: PATH_ADMIN.users },
    ],
  },
];

export default function Navigation() {
  const pathName = usePathname();
  const router = useRouter();
  const handleLogout = () => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.signOut();
    router.push("/signInAdmin");
  };
  return (
    <Fragment>
      {mockdata.map((section) => (
        <Box key={section.title}>
          <Title
            style={{ color: "white" }}
            tt="uppercase"
            size="xs"
            pl="md"
            fw={500}
            mb="sm"
            pt="2rem"
          >
            {section.title}
          </Title>

          {section.links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.label}
                className={classes.link}
                leftSection={<Icon className={classes.iconBold} />}
                href={link.link}
                label={link.label}
                mod={{ selected: pathName === link.link }}
              />
            );
          })}
        </Box>
      ))}
      <Box mt="lg" pl="md">
        <Button
          leftSection={<MdLogout />}
          variant="light"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Fragment>
  );
}
