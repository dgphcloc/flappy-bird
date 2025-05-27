"use client";
import { notifications } from "@mantine/notifications";
import { FileInput } from "@mantine/core";
import { FiUpload } from "react-icons/fi";
import { Button, Group, Loader, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
export default function CreateUserForm({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const hanldeCreateUser = async (value: typeof form.values) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", value.username);
      formData.append("password", value.password);
      formData.append("score", String(0));
      if (value.avatar) {
        formData.append("avatar", value.avatar);
      }

      const res = await fetch("/api/users", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      notifications.show({
        title: "Success",
        message: `User with ID: ${data.userId} has been successfully created.`,
        color: "green",
      });

      onClose();
    } catch (e: unknown) {
      const message = (e as Error).message ?? "Unknown error";
      notifications.show({
        title: "Error",
        message: `Failed to create user. ${message}`,
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      score: 0,
      avatar: null as File | null,
    },
    validate: {
      password: (value) =>
        value.trim().length >= 6
          ? null
          : "Password must be at least 6 characters",
      avatar: (file) =>
        file instanceof File || file === null ? null : "Invalid file type",
    },
  });
  return (
    <>
      <form onSubmit={form.onSubmit(hanldeCreateUser)}>
        <TextInput
          withAsterisk
          label="username"
          placeholder="@username"
          key={form.key("username")}
          {...form.getInputProps("username")}
        />
        <PasswordInput
          placeholder="******"
          label="password"
          withAsterisk
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <FileInput
          leftSection={<FiUpload />}
          clearable
          accept="image/png,image/jpeg"
          label="Upload avatar"
          placeholder="Upload avatar"
          onChange={(file) => form.setFieldValue("avatar", file)}
          error={form.errors.avatar}
        />

        <Group justify="space-between" py={8}>
          <Button variant="filled" color="red" onClick={onClose}>
            cancel
          </Button>
          <Button disabled={isLoading} variant="filled" type="submit">
            {isLoading ? <Loader size="xs" /> : "Submit"}
          </Button>
        </Group>
      </form>
    </>
  );
}
