import { VIETNAMESE_AND_SPACE_REGEX } from "./regexPatterns";

export const createInputHandlers = (
  input: HTMLInputElement,
  onFocus: () => void,
  onBlur: () => void,
  onInput: (value: string) => void,
  maxLength: number
) => {
  input.addEventListener("focus", () => {
    if (input.value === "") {
      input.placeholder = "";
    }
    onFocus();
  });

  input.addEventListener("blur", () => {
    if (input.value === "") {
      input.placeholder = input.getAttribute("data-placeholder") || "";
    }
    onBlur();
  });

  input.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    // Lọc bỏ ký tự tiếng Việt
    const filteredValue = target.value.replace(VIETNAMESE_AND_SPACE_REGEX, "");
    if (filteredValue !== target.value) {
      target.value = filteredValue;
    }
    if (target.value.length <= maxLength) {
      onInput(target.value);
    }
  });
};
