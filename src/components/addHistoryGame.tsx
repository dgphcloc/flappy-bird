"use client";

import { useState } from "react";
import { NumberInput, Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

type AddHistoryGameProp = {
  id: string;
};

export default function AddHistoryGame({ id }: AddHistoryGameProp) {
  const [score, setScore] = useState<number>(0);

  const isValidScore = score > 0 && score < 2000000000;

  const handleSave = async () => {
    // Validation
    if (score === 0) {
      notifications.show({
        title: "Validation Error",
        message: "Score is required",
        color: "red",
        icon: <AiOutlineClose />,
      });
      return;
    }

    if (score <= 0) {
      notifications.show({
        title: "Validation Error",
        message: "Score must be greater than 0",
        color: "red",
        icon: <AiOutlineClose />,
      });
      return;
    }

    if (score >= 2000000000) {
      notifications.show({
        title: "Validation Error",
        message: "Score must be less than 2,000,000,000",
        color: "red",
        icon: <AiOutlineClose />,
      });
      return;
    }

    try {
      const res = await fetch(`/api/users/${id}/history/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save score");

      notifications.show({
        title: "Success",
        message: result.message,
        color: "teal",
        icon: <AiOutlineCheck />,
      });

      setScore(0);
    } catch (err: unknown) {
      notifications.show({
        title: "Error",
        message: (err as Error).message || "Unknown error",
        color: "red",
        icon: <AiOutlineClose />,
      });
    }
  };

  return (
    <Group>
      <NumberInput
        placeholder="Enter score"
        value={score}
        onChange={(value) => setScore(+value)}
        min={1}
        max={1999999999}
        step={1}
      />
      <Button onClick={handleSave} disabled={!isValidScore}>
        Add new
      </Button>
    </Group>
  );
}
