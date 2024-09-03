import { useAtom } from "jotai";
import { useEffect } from "react";
import { useLocalStorage } from "react-use";
import { atomWithStore } from "jotai-zustand";
import { createStore } from "zustand/vanilla";

interface AutoSkipState {
  autoSkip: boolean;
}

const autoSkipStore = createStore<AutoSkipState>(() => ({
  autoSkip: false,
}));

const autoSkipAtom = atomWithStore(autoSkipStore);

const useAutoSkip = () => {
  const [autoSkipState, setAutoSkipState] = useAtom(autoSkipAtom);
  const [storedValue, setStoredValue] = useLocalStorage<boolean>(
    "auto_skip",
    false,
  );

  useEffect(() => {
    if (storedValue !== undefined) {
      setAutoSkipState({ autoSkip: storedValue });
    }
  }, [storedValue, setAutoSkipState]);

  const toggleAutoSkip = () => {
    const newValue = !autoSkipState.autoSkip;

    setAutoSkipState({ autoSkip: newValue });
    setStoredValue(newValue);
  };

  return [autoSkipState.autoSkip, toggleAutoSkip] as const;
};

export default useAutoSkip;
