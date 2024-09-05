// @ts-nocheck

import { SettingsIcon } from "@vidstack/react/icons";
import { Menu } from "@vidstack/react";

import { SubmenuButton } from "./subMenuButton";
import { SkipButtonsSubMenu } from "./showSkipButtons";
import { AutoSkipSubMenu } from "./autoSkip";

export function SkipConfigurationSubMenu() {
  return (
    <Menu.Root>
      <SubmenuButton hint={""} icon={SettingsIcon} label="Skip Configuration" />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup className="vds-radio-group">
          <Menu.Radio key={"skip_buttons"} className="vds-radio">
            <SkipButtonsSubMenu />
          </Menu.Radio>
          <Menu.Radio key={"skip_buttons"} className="vds-radio">
            <AutoSkipSubMenu />
          </Menu.Radio>
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}
