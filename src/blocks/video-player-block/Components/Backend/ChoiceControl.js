import {
  SelectControl,
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";

// Segments share the sidebar width equally, so the longest label sets the
// size: options × (longest label + 2 for padding) must fit this many characters.
const ROW_BUDGET = 36;

// Segments can't hold an empty value (e.g. "Auto" = ""), so it travels as this.
const EMPTY = "__empty__";
const toGroup = (v) => (v === "" ? EMPTY : v);
const fromGroup = (v) => (v === EMPTY ? "" : v);

/**
 * One click when it fits: 2–6 short choices render as segmented buttons
 * (a dropdown is open-then-pick, two clicks); long or many choices keep the
 * dropdown. Takes SelectControl's props, so swapping the tag is enough.
 */
export const ChoiceControl = ({ options = [], ...props }) => {
  const fits =
    options.length >= 2 &&
    options.length <= 6 &&
    !props.disabled &&
    !props.multiple &&
    options.every((o) => typeof o.value !== "boolean" && !o.disabled) &&
    options.length * (Math.max(...options.map((o) => String(o.label).length)) + 2) <= ROW_BUDGET;

  if (!fits) return <SelectControl options={options} {...props} />;

  const { label, value, onChange, help, className, hideLabelFromVision } = props;
  return (
    <ToggleGroupControl
      label={label}
      value={toGroup(value ?? "")}
      onChange={(v) => onChange(fromGroup(v))}
      help={help}
      className={className}
      hideLabelFromVision={hideLabelFromVision}
      isBlock
      __nextHasNoMarginBottom>
      {options.map((o) => (
        <ToggleGroupControlOption key={o.value} value={toGroup(o.value)} label={o.label} />
      ))}
    </ToggleGroupControl>
  );
};
