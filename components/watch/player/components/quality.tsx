import { Menu, useVideoQualityOptions } from "@vidstack/react";
import { CheckIcon, SettingsMenuIcon } from "@vidstack/react/icons";

import { SubmenuButton } from "./subMenuButton";

export function QualitySubmenu() {
  const options = useVideoQualityOptions(),
    currentQuality = options.selectedQuality?.height;

  let hint = "";

  if (options.selectedValue !== "auto" && currentQuality) {
    hint = currentQuality + "p";
  } else {
    hint = "Auto";
    if (currentQuality) {
      hint += `(${currentQuality}p)`;
    }
  }

  return (
    <Menu.Root>
      <SubmenuButton
        disabled={options.disabled}
        hint={hint}
        // @ts-ignore
        icon={SettingsMenuIcon}
        label="Quality"
      />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, bitrateText, select }) => (
            <Menu.Radio
              key={value}
              className="vds-radio"
              value={value}
              onSelect={select}
            >
              <CheckIcon className="vds-icon" />
              <span className="vds-radio-label">{label}</span>
              {bitrateText ? (
                <span className="vds-radio-hint">{bitrateText}</span>
              ) : null}
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}
