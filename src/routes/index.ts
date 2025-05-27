const path = (root: string, sublink: string) => `${root}${sublink}`;

const ROOTS_ADMIN = "/admin";
const ROOTS_USERS = "/users";
const ROOTS_PROFILE = "/profile";
const ROOTS_LOG = "/log";
const ROOT_PLAYER = "/players";

export const PATH_ADMIN = {
  root: ROOTS_ADMIN,
  players: path(ROOTS_ADMIN, ROOT_PLAYER),
  profile: path(ROOTS_ADMIN, ROOTS_PROFILE),
  log: path(ROOTS_ADMIN, ROOTS_LOG),
  users: {
    root: () => `${ROOTS_ADMIN}${ROOTS_USERS}/`,
    detail: (id: string | number) => `${ROOTS_ADMIN}${ROOTS_USERS}/${id}`,
  },
};
