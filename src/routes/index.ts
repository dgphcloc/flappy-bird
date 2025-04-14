const path = (root: string, sublink: string) => `${root}${sublink}`;

const ROOTS_ADMIN = "/admin";
const ROOTS_USERS = "/users";
const ROOTS_PROFILE = "/profile";
const ROOTS_LOG = "/log";

export const PATH_ADMIN = {
  root: ROOTS_ADMIN,
  users: path(ROOTS_ADMIN, ROOTS_USERS),
  profile: path(ROOTS_ADMIN, ROOTS_PROFILE),
  log: path(ROOTS_ADMIN, ROOTS_LOG),
};
