"use client";
import { NavLink, Box, Title } from "@mantine/core";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { MdDashboard, MdPeople } from "react-icons/md";
import { CiUser, CiViewList } from "react-icons/ci";
import classes from './navigation.module.css';
import { PATH_ADMIN } from "@/routes";

const mockdata = [
  {
    title: 'Dashboard',
    links: [
      { label: 'dashboard', icon: MdDashboard, link: PATH_ADMIN.root },
      { label: 'users', icon: MdPeople, link: PATH_ADMIN.users },
    ],
  },
  {
    title: 'App',
    links: [
      { label: 'profile', icon: CiUser, link: PATH_ADMIN.profile },
      { label: 'logs', icon: CiViewList, link: PATH_ADMIN.log },
    ],
  },
];

export default function Navigation() {
  const pathName = usePathname();

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
    </Fragment>
  );
}
