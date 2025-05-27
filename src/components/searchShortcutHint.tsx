import { Flex, Kbd, Text } from "@mantine/core";

export enum ModifierKeyEnum {
  Ctrl = "Ctrl",
  Meta = "Meta",
  Alt = "Alt",
  Shift = "Shift",
}

export enum MainKeyEnum {
  K = "K",
  P = "P",
  F = "F",
  S = "S",
  Enter = "Enter",
  Escape = "Escape",
}
interface SearchShortcutHintProps {
  ctrlKey?: keyof typeof ModifierKeyEnum;
  mainKey?: keyof typeof MainKeyEnum;
}

export function SearchShortcutHint({
  ctrlKey = "Ctrl",
  mainKey = "K",
}: SearchShortcutHintProps) {
  return (
    <Flex align="center" gap={4} justify="flex-end" w="100%">
      <Kbd px={6} py={2}>
        {ctrlKey}
      </Kbd>
      <Text size="xs">+</Text>
      <Kbd px={6} mr={6} py={2}>
        {mainKey}
      </Kbd>
    </Flex>
  );
}
