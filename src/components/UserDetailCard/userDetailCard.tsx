"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Text, Avatar, Group, Badge, Stack, Button } from "@mantine/core";
import { Modal } from "@mantine/core";
import { FaTrashAlt } from "react-icons/fa";
import { notifications } from "@mantine/notifications";
import AvatarUpload from "../avatarUpload/avatarUpload";
import { UserRecord } from "@/type/type";
import { useDisclosure } from "@mantine/hooks";

export default function UserDetailCard({
  user,
  reFetchUser,
}: {
  user: UserRecord;
  reFetchUser: (id: string) => Promise<void>;
}) {
  const router = useRouter();
  const [currentAvatar, setCurrentAvatar] = useState<string>(user.avatar_url);
  const [opened, { open, close }] = useDisclosure(false);

  const handleUpdateAvatar = async (newUrl: string) => {
    try {
      const res = await fetch(`/api/users/${user.id}/avatar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUrl }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Update failed");
      setCurrentAvatar(data.avatar_url);
      await reFetchUser(user.id);
      notifications.show({
        title: "Success",
        message: "Avatar đã được cập nhật.",
        color: "green",
      });
    } catch (err: unknown) {
      let message = "Something went wrong";

      if (err instanceof Error) {
        message = err.message;
      }

      console.error("Fail to update avatar:", err);
      notifications.show({
        title: "Error",
        message,
        color: "red",
      });
    }
  };

  // REFACTOR
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Delete failed");
      }
      notifications.show({
        title: "Success",
        message: `User ${user.username} (ID: ${user.id}) đã được xoá.`,
        color: "green",
      });
      close();
      await reFetchUser(user.id); // cập nhật lại state ở cha
      router.push("/admin/users"); // chuyển trang về danh sách
    } catch (err: unknown) {
      const message = (err as Error).message ?? "Unkown error";
      notifications.show({
        title: "Failed",
        message: `Không thể xoá user: ${message}`,
        color: "red",
      });
    }
  };
  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication">
        <Text>Are you sure you want to delete this item?</Text>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            OK
          </Button>
        </Group>
      </Modal>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group align="center" mb="md">
          <Avatar
            src={currentAvatar}
            size={150}
            style={{ border: "4px solid #4C4C4C" }}
          />
          <div>
            <Text size="lg" fw={500}>
              {user.username}
            </Text>
            <Text size="sm" color="dimmed">
              ID: {user.id}
            </Text>
          </div>
        </Group>

        <Stack gap="sm" mb="md">
          <Group>
            <AvatarUpload onUpload={handleUpdateAvatar} />
            <Button
              onClick={open}
              variant="filled"
              color="rgba(255, 23, 23, 1)"
              leftSection={<FaTrashAlt />}
            >
              Delete
            </Button>
          </Group>
        </Stack>

        <Group gap="xs" mt="md">
          <Badge color="green">Created: {user.created_at}</Badge>
          <Badge color="gray">Updated: {user.updated_at}</Badge>
          <Badge color="orange">
            Last Score Update: {user.last_updated_score}
          </Badge>
        </Group>
      </Card>
    </>
  );
}
