import React, { useState, useRef, useEffect } from "react";
import "../../dist/output.css";

interface ListItemProps {
  multiSelect?: boolean;
  isSelected: boolean;
  option: string;
  handleSelectOption: (option: string) => void;
  italic?: boolean;
}

/**
 * A utility component for displaying each
 * option in the dropdown.
 */
function ListItem({
  multiSelect,
  isSelected,
  option,
  handleSelectOption,
  italic,
}: ListItemProps) {
  return (
    <div
      className={`${
        isSelected ? "bg-blue-100" : ""
      } px-2 py-1 hover:bg-gray-200 active:bg-gray-400 cursor-pointer transition flex align-middle`}
      onClick={() => handleSelectOption(option)}
    >
      {multiSelect && (
        <input type="checkbox" className="mr-1" checked={isSelected} readOnly />
      )}
      <span className={`${italic ? "italic" : ""}`}>{option}</span>
    </div>
  );
}

interface SelectProps {
  /**
   * Shows a placeholder for when no option is selected
   */
  placeholder?: string;
  /**
   * Shows a checkbox next to each item in the dropdown if true.
   * If given, `value` should be a string array.
   */
  multiSelect?: boolean;
  /**
   * As a controlled component, `value` represents the currently
   * selected value. It should be a string for single select and
   * a string array for multi select.
   */
  value: string | string[];
  /**
   * A list of the options that should be available to select.
   */
  options: string[];
  /**
   * As a controlled component, handles the event when the user
   * selects an item. If it is a multi select, then `option` will
   * be a string of all selected options separated by a comma.
   *
   * For example, "option 1,option 2,option3"
   */
  onChange: (option: string) => void;
  /**
   * The width of the dropdown component
   */
  width?: number;
  /**
   * Sets to 100% width when true
   */
  fullWidth?: boolean;
}

/**
 * A simple dropdown  menu that supports both single
 * and multi select options.
 */
function Select({
  multiSelect,
  placeholder,
  value,
  options,
  onChange,
  fullWidth,
  width,
}: SelectProps) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMousedown({ target }: MouseEvent) {
      if (
        optionsRef.current &&
        buttonRef.current &&
        !buttonRef.current.contains(target as Node) &&
        !optionsRef.current.contains(target as Node)
      ) {
        setOptionsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMousedown);
    return () => document.removeEventListener("mousedown", handleMousedown);
  }, [buttonRef]);

  const toggleOptionsOpen = () => setOptionsOpen(!optionsOpen);

  const handleSelectOption = (option: string) => {
    if (typeof value === "string") {
      onChange(option);
      setOptionsOpen(false);
    } else {
      const selectedValueSet = new Set(value);
      const selectedValues = isOptionSelected(option)
        ? options.filter((o) => o !== option && selectedValueSet.has(o))
        : options.filter((o) => selectedValueSet.has(o) || o === option);
      onChange(selectedValues.join(","));
    }
  };

  const isOptionSelected = (option: string): boolean => {
    if (typeof value === "string") {
      return value === option;
    }
    return value.includes(option);
  };

  const displaySelectedOptions = (): string => {
    const defaultValue = placeholder || "";

    if (typeof value === "string") {
      return value ? value : defaultValue;
    }
    return value.length > 0 ? value.join(", ") : defaultValue;
  };

  return (
    <div className="inline">
      <button
        ref={buttonRef}
        className={`border ${
          optionsOpen ? "border-blue-500" : "border-gray-200"
        } rounded-md p-2 block ${fullWidth ? "w-full" : ""}`}
        style={{
          width,
        }}
        onClick={toggleOptionsOpen}
      >
        <div className="flex justify-between">
          <span
            className={`${
              value === "" || value.length === 0 ? "text-gray-500" : ""
            } overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-left mr-2`}
          >
            {displaySelectedOptions()}
          </span>
          <span className="text-gray-400">{optionsOpen ? "▼" : "▲"}</span>
        </div>
      </button>

      {optionsOpen && (
        <div
          className="border border-gray-200 rounded-md py-1 inline-flex flex-col max-h-48 overflow-y-auto"
          style={{
            minWidth: buttonRef.current
              ? buttonRef.current.clientWidth
              : undefined,
          }}
          ref={optionsRef}
        >
          {typeof value === "string" ? (
            <ListItem
              handleSelectOption={() => handleSelectOption("")}
              isSelected={value === ""}
              option={"None"}
              italic
            />
          ) : (
            <ListItem
              handleSelectOption={() =>
                value.length === options.length
                  ? onChange("")
                  : onChange(options.join(","))
              }
              isSelected={value.length === options.length}
              option={"All"}
              multiSelect
              italic
            />
          )}
          {options.map((option) => (
            <ListItem
              key={option}
              handleSelectOption={handleSelectOption}
              isSelected={isOptionSelected(option)}
              option={option}
              multiSelect={multiSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Select;
