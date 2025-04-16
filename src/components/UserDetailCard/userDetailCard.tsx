"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Text,
  Avatar,
  Group,
  Badge,
  Stack,
  NumberInput,
  Button,
  Loader,
} from "@mantine/core";
import { Modal } from "@mantine/core";
import { FaSave, FaTrashAlt } from "react-icons/fa";
import { notifications } from "@mantine/notifications";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";
import { getFilenameFromUrl, isValidScore } from "@/helpers/helperStore";
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
  const [score, setScore] = useState<number>(user.score);
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentAvatar, setCurrentAvatar] = useState<string>(user.avatar_url);
  const [opened, { open, close }] = useDisclosure(false);
  const handleScoreChange = (value: number | string) => {
    if (isValidScore(value)) {
      /**
       * if score is valid => set state
       * else set error
       */
      setScore(value as number);
      setScoreError(null);
    } else {
      setScoreError("invalid value");
    }
  };
  const handleUpdateAvatar = async (newUrl: string) => {
    const supabase = await createSupabaseAdminAuthClient();
    try {
      if (currentAvatar) {
        const oldPath = currentAvatar.split("/").pop();
        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove([oldPath!]);
        if (deleteError) {
          console.warn("cant not delete old avatar:", deleteError);
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: newUrl })
        .eq("id", user.id);

      if (error) throw error;

      setCurrentAvatar(newUrl);
      await reFetchUser(user.id);
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Failed to update avatar");
    }
  };
  const handleDelete = async () => {
    await reFetchUser(user.id);
    console.log("delete");
    close();
    const supabase = await createSupabaseAdminAuthClient();
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id)
      .select();
    /**
     * neu ta change avatar thi user van chua cap nhat avatar url => loi
     * phai re-render de nhan state moi
     */
    console.log("user.avatar_url", user.avatar_url);
    if (!error && user.avatar_url) {
      const filePath = getFilenameFromUrl(user.avatar_url);
      if (filePath) {
        const { data, error } = await supabase.storage
          .from("avatars")
          .remove([filePath]);

        console.log(`xoa anh ${filePath}`, data, error);
      }
    }
    /**
     * if delete successly
     */
    if (!error) {
      notifications.show({
        title: "Success",
        message: `User with ID: ${user.id} has been successfully deleted.`,
        color: "green",
      });
      router.push("/admin/users/");
    } else {
      notifications.show({
        title: "Failed",
        message: `Failed to delete user with ID: ${user.id}. Please try again.`,
        color: "red",
      });
    }
  };
  const handleSave = async () => {
    if (!isValidScore(score) || scoreError) {
      /**
       * It will take the nearest valid score, even though the input is currently invalid  => fail
       * check both score and no err
       */
      notifications.show({
        title: "Invalid Score",
        message: "Please enter a valid score between 0 and 2,000,000,000.",
        color: "red",
      });
      return;
    }

    setIsLoading(true);
    const supabase = await createSupabaseAdminAuthClient();

    const { data, error } = await supabase
      .from("profiles")
      .update({ score })
      .eq("id", user.id)
      .select();

    if (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update score. Please try again.",
        color: "red",
      });
    } else {
      setScore(data.at(0).score);
      notifications.show({
        title: "Success",
        message: `Successfully updated the score of player with ID: ${user.id} to ${score}.`,
        color: "green",
      });
    }
    setIsLoading(false);
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
            <NumberInput
              value={score}
              onChange={handleScoreChange}
              error={scoreError}
            />
            <Button
              disabled={isLoading}
              onClick={handleSave}
              leftSection={isLoading ? <Loader size="xs" /> : <FaSave />}
            >
              {isLoading ? "Saving..." : "Save change"}
            </Button>
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
