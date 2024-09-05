// @ts-nocheck

import { type ReactElement } from "react";
import { Menu, useVideoQualityOptions } from "@vidstack/react";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SettingsMenuIcon,
} from "@vidstack/react/icons";

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

interface SubmenuButtonProps {
  label: string;
  hint: string;
  disabled?: boolean;
  icon: ReactElement;
}

function SubmenuButton({
  label,
  hint,
  icon: Icon,
  disabled,
}: Readonly<SubmenuButtonProps>) {
  return (
    <Menu.Button className="vds-menu-item" disabled={disabled}>
      <ChevronLeftIcon className="vds-menu-close-icon" />
      <Icon className="vds-icon" />
      <span className="vds-menu-item-label">{label}</span>
      <span className="vds-menu-item-hint">{hint}</span>
      <ChevronRightIcon className="vds-menu-open-icon" />
    </Menu.Button>
  );
}
