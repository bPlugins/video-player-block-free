import { useInstanceId } from "@wordpress/compose";
import { BaseControl, Button } from "@wordpress/components";
import { ChoiceControl } from "./ChoiceControl";

/**
 * A choice shown as a picture: each option is a small icon with its name
 * under it (icons: a value -> icon map from utils/choiceIcons). Same props as
 * ChoiceControl, which it falls back to when an option has no icon.
 */
const VisualChoiceControl = ({ options = [], icons = {}, label, value, onChange, help, className, disabled }) => {
  const id = useInstanceId(VisualChoiceControl, "vpb-visual");

  if (!options.length || !options.every((o) => icons[o.value])) {
    return <ChoiceControl options={options} label={label} value={value} onChange={onChange} help={help} className={className} disabled={disabled} />;
  }

  const columns = options.length === 2 || options.length === 4 ? 2 : 3;

  return (
    <BaseControl id={id} label={label} help={help} className={className} __nextHasNoMarginBottom>
      <div id={id} className="vpb-visual-choice" role="radiogroup" aria-label={label} style={{ "--vpb-visual-columns": columns }}>
        {options.map((o) => (
          <Button
            key={o.value}
            role="radio"
            aria-checked={o.value === value}
            isPressed={o.value === value}
            disabled={disabled}
            onClick={() => onChange(o.value)}>
            {icons[o.value]}
            <span>{o.label}</span>
          </Button>
        ))}
      </div>
    </BaseControl>
  );
};

export default VisualChoiceControl;
