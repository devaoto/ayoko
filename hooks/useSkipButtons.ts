import { useAtom } from "jotai";
import { useEffect } from "react";
import { useLocalStorage } from "react-use";
import { atomWithStore } from "jotai-zustand";
import { createStore } from "zustand/vanilla";

interface ButtonState {
  showSkipButtons: boolean;
}

const buttonStore = createStore<ButtonState>(() => ({
  showSkipButtons: false,
}));

const buttonAtom = atomWithStore(buttonStore);

const useSkipButtons = () => {
  const [buttonState, setButtonState] = useAtom(buttonAtom);
  const [storedValue, setStoredValue] = useLocalStorage<boolean>(
    "show_skip_buttons",
    false,
  );

  useEffect(() => {
    if (storedValue !== undefined) {
      setButtonState({ showSkipButtons: storedValue });
    }
  }, [storedValue, setButtonState]);

  const toggleButtons = () => {
    const newValue = !buttonState.showSkipButtons;

    setButtonState({ showSkipButtons: newValue });
    setStoredValue(newValue);
  };

  return [buttonState.showSkipButtons, toggleButtons] as const;
};

export default useSkipButtons;
