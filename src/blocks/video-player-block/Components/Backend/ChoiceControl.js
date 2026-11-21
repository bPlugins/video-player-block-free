import { useInstanceId } from "@wordpress/compose";
import {
  Button,
  SelectControl,
  BaseControl,
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

// When one row is too narrow: a grid of buttons, up to this many rows.
const MAX_GRID_ROWS = 3;

// Grid columns by the longest label (characters).
const gridColumns = (longest) => (longest <= 4 ? 4 : longest <= 8 ? 3 : longest <= 16 ? 2 : 1);

/**
 * Every choice in one click (a dropdown is open-then-pick, two clicks):
 * - 2–6 short options: one row of segmented buttons;
 * - more or longer options: a grid of buttons, up to 3 rows;
 * - only a really long list keeps the dropdown.
 * Takes SelectControl's props, so swapping the tag is enough.
 */
export const ChoiceControl = ({ options = [], ...props }) => {
  const id = useInstanceId(ChoiceControl, "vpb-choice");
  const usable =
    options.length >= 2 &&
    !props.disabled &&
    !props.multiple &&
    options.every((o) => typeof o.value !== "boolean" && !o.disabled);
  const longest = Math.max(0, ...options.map((o) => String(o.label).length));
  const inRow = usable && options.length <= 6 && options.length * (longest + 2) <= ROW_BUDGET;
  const columns = gridColumns(longest);
  const inGrid = usable && !inRow && Math.ceil(options.length / columns) <= MAX_GRID_ROWS;

  const { label, value, onChange, help, className, hideLabelFromVision } = props;

  if (inGrid) {
    return (
      // The id ties the label to the grid (an unlinked label renders in caps).
      <BaseControl id={id} label={label} help={help} hideLabelFromVision={hideLabelFromVision} className={className} __nextHasNoMarginBottom>
        <div id={id} className="vpb-choice-grid" role="radiogroup" aria-label={label} style={{ "--vpb-choice-columns": columns }}>
          {options.map((o) => (
            <Button
              key={o.value}
              role="radio"
              aria-checked={o.value === value}
              isPressed={o.value === value}
              onClick={() => onChange(o.value)}>
              {o.label}
            </Button>
          ))}
        </div>
      </BaseControl>
    );
  }

  if (!inRow) return <SelectControl options={options} {...props} />;

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
