"use client";

import {
  Button,
  Checkbox,
  Group,
  TextInput,
  PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { signInWithEmailAndPassword } from "../shared/_action";

export default function SignInAdminPage() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email không hợp lệ"),
      password: (value) =>
        value.length >= 6 ? null : "Mật khẩu phải có ít nhất 6 ký tự",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    console.log("Thông tin đăng nhập:", values);
    const result = await signInWithEmailAndPassword(values);
    console.log(result);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        withAsterisk
        label="Email"
        placeholder="your@email.com"
        {...form.getInputProps("email")}
        error={form.errors.email}
      />

      <PasswordInput
        withAsterisk
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        mt="md"
        {...form.getInputProps("password")}
        error={form.errors.password}
      />
      <Group mt="md">
        <Button type="submit">Đăng nhập</Button>
      </Group>
    </form>
  );
}
