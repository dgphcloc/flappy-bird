"use client";
import {NavLink, Box,Title  } from "@mantine/core";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { MdDashboard, MdPeople } from "react-icons/md";
import { CiUser,CiViewList  } from "react-icons/ci";
import classes from './navigation.module.css'
export default function Navigation() {
  const pathName = usePathname();
  return (
    <Fragment>
        <Box>
            <Title 
            style={{color:"white"}}
        tt="uppercase"
          size="xs"
          pl="md"
          fw={500}
          mb="sm"
           pt="2rem"
>Dashboard</Title>
        <NavLink
        className={classes.link}
        leftSection={<MdDashboard className={classes.iconBold}/>}
            href="/dashboard"
            label="dashboard"
          mod={{ selected: pathName === "/dashboard" }}
        />

        <NavLink
        className={classes.link}
        leftSection={<MdPeople className={classes.iconBold} />}
            href="/admin/users"
            label="users"
            mod={{ selected: pathName === "/dashboard/users" }}
        />
        </Box>
                <Box>
            <Title
            style={{color:"white"}}
        tt="uppercase"
          size="xs"
          pl="md"
          fw={500}
          mb="sm"
           pt="2rem"
>App</Title>
        <NavLink
        className={classes.link}
        leftSection={<CiUser className={classes.iconBold}/>}
            href="/dashboard/profile"
            label="profile"
            mod={{ selected: pathName === "/dashboard/profile" }}
        />
         <NavLink
        leftSection={<CiViewList className={classes.iconBold}/>}
        className={classes.link}
            href="/dashboard/logs"
            label="logs"
            mod={{ selected: pathName === "/dashboard/logs" }}
        /> 
        </Box>
      </Fragment>
  );
}
