import { Container, Title, Text, Button, Group } from "@mantine/core";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Custom404() {
  const router = useRouter();
  return (
    <Container style={{ paddingTop: "100px", textAlign: "center" }}>
      <Title order={1} size="3rem" mb="md" c="red">
        404
      </Title>
      <Text size="xl" fw={500} mb="xs">
        Trang không tồn tại
      </Text>
      <Text c="dimmed" size="md" mb="lg">
        Có thể đường dẫn bạn đang tìm đã bị thay đổi hoặc không tồn tại.
      </Text>

      <Group justify="center">
        <Button
          leftSection={<FaArrowLeft size={16} />}
          variant="light"
          size="md"
          onClick={() => router.push("/admin")}
        >
          Quay về trang chủ
        </Button>
      </Group>
    </Container>
  );
}
