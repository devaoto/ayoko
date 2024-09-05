// @ts-nocheck

import {
  RadioButtonIcon,
  RadioButtonSelectedIcon,
} from "@vidstack/react/icons";

import useAutoSkip from "@/hooks/useAutoSkip";

export function AutoSkipSubMenu() {
  const [isEnabled, setIsEnabled] = useAutoSkip();

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <div className="auto-skip-toggle">
      <button
        aria-label="Toggle Auto Skip"
        className="toggle-button"
        onClick={handleToggle}
      >
        {isEnabled ? (
          <RadioButtonSelectedIcon className="vds-icon" />
        ) : (
          <RadioButtonIcon className="vds-icon" />
        )}
        <span className="vds-radio-label">
          {isEnabled ? "Turn off Auto Skip" : "Turn On Auto Skip"}
        </span>
      </button>
    </div>
  );
}
