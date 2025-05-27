"use client";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import {
  Button,
  TextInput,
  PasswordInput,
  Container,
  Title,
  Text,
  Alert,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { MdErrorOutline } from "react-icons/md";

import { signInWithEmailAndPassword } from "../../shared/_action";
import { useState } from "react";

export default function SignInAdminPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "daylaadmin@gmail.com",
      password: "123ABC",
    },

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await signInWithEmailAndPassword(values);
      /**
       * Admin access is required.
       */
      if (user?.app_metadata.admin_role) {
        /**
         * redirect to admin page
         */
        router.replace("/admin");
        notifications.show({
          message: "login successfully",
        });
      } else {
        router.replace("/Game");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center h="100vh" bg="gray.1">
      <Container w="100%" maw={450} p="xl">
        <Title ta="center" mb="md">
          Welcome Back!
        </Title>

        <Text c="dimmed" ta="center" mb={30}>
          Admin Portal - Please sign in to continue
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            size="md"
            radius="md"
            withAsterisk
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            mt="md"
            size="md"
            radius="md"
            withAsterisk
            {...form.getInputProps("password")}
          />

          {errorMessage && (
            <Alert
              icon={<MdErrorOutline />}
              color="red"
              mt="lg"
              title="Error"
              variant="light"
            >
              {errorMessage}
            </Alert>
          )}

          <Button fullWidth mt="xl" size="md" type="submit" loading={isLoading}>
            Sign In
          </Button>
        </form>
      </Container>
    </Center>
  );
}
