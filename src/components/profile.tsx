"use client";

import useCurrentUser from "@/hooks/useCurrentUser";

export default function Profile() {
  const user = useCurrentUser(["id", "email"]);
  return (
    <div>
      <h1>Thông tin người dùng</h1>
      {user ? <pre>{user.email}</pre> : <p>Chưa đăng nhập</p>}
    </div>
  );
}
