import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Select from "./Select";

export default {
  title: "Select",
  component: Select,
  args: {
    options: ["taco", "burrito", "churro"],
  },
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (props) => {
  const [value, setValue] = useState("");

  return <Select {...props} value={value} onChange={setValue} />;
};

export const Primary = Template.bind({});
Primary.args = {
  placeholder: "Favorite Food",
};

const TemplateMulti: ComponentStory<typeof Select> = (props) => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <Select
      {...props}
      value={value}
      onChange={(option) => {
        return setValue(option ? option.split(",") : []);
      }}
    />
  );
};

export const MultiSelect = TemplateMulti.bind({});
MultiSelect.args = {
  multiSelect: true,
  placeholder: "Pick a few",
};

export const BigList = TemplateMulti.bind({});
BigList.args = {
  fullWidth: true,
  placeholder: "Lots of options",
  multiSelect: true,
  options: Array.from(Array(100).keys()).map((i) => `option ${i}`),
};
