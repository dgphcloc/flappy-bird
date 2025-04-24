"use client";
import { generateFilePath, generateUserEmailTemp } from "@/helpers/helperStore";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";
import { notifications } from "@mantine/notifications";
import { FileInput } from "@mantine/core";
import { FiUpload } from "react-icons/fi";
import {
  Button,
  Group,
  Loader,
  NumberInput,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
export default function CreateUserForm({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const hanldeCreateUser = async (value: typeof form.values) => {
    console.log(value);
    setIsLoading(true);
    try {
      const supabase = await createSupabaseAdminAuthClient();
      const {
        data: { user },
      } = await supabase.auth.admin.createUser({
        email: generateUserEmailTemp(),
        password: value.password,
      });
      if (user) {
        let avatar_url = "";
        /**
         * 
            fullPath:"avatars/0.41494161240789085.png"
            id:"2f5d4b8e-fa50-4692-9280-a8ea955e9c7d"
            path: 0.41494161240789085.png"
         */
        if (value.avatar) {
          const file = value.avatar;
          const filePath = await generateFilePath(file);
          const { data } = await supabase.storage
            .from("avatars")
            .upload(filePath, file);
          if (data) {
            const {
              data: { publicUrl },
            } = supabase.storage.from("avatars").getPublicUrl(filePath);
            avatar_url = publicUrl;
          }
        }

        const { error } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            username: value.username,
            score: value.score,
            avatar_url: avatar_url,
          },
          { onConflict: "id" }
        );
        if (error && error.code == "23505") {
          notifications.show({
            title: "Error",
            message: `username ${value.username} already exists`,
            color: "red",
          });
        } else {
          notifications.show({
            title: "Success",
            message: `User with ID: ${user.id} has been successfully created.`,
            color: "green",
          });
        }
      }
      onClose();
    } catch (e) {
      notifications.show({
        title: "Error",
        message: `Failed to create user ${e}.`,
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
      score: (value) =>
        value >= 0 && value <= 2000000000
          ? null
          : "Score must be greater than 0 and less than 2 billion",
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
        <NumberInput
          withAsterisk
          label="score"
          min={0}
          max={2000_000_000}
          placeholder="score"
          key={form.key("score")}
          {...form.getInputProps("score")}
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
