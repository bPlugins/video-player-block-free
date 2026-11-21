import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { useInstanceId } from "@wordpress/compose";
import {
  BaseControl,
  __experimentalNumberControl as NumberControl,
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";

// "100%" -> ["100", "%"]; anything else (e.g. "auto") -> ["", ""].
const split = (value) => {
  const m = String(value ?? "").match(/^\s*(-?\d*\.?\d+)\s*([a-z%]*)\s*$/i);
  return m ? [m[1], m[2]] : ["", ""];
};

/**
 * A size field whose units are one-click buttons beside the number
 * (UnitControl hides them in a dropdown: two clicks). Takes UnitControl's
 * props (label, value, onChange, units, help, placeholder) and stores the
 * same "100%" style string. Styles: inspector.scss ("Size fields").
 */
export const SizeControl = ({ label, value, onChange, units = [], help, placeholder, disabled, className = "" }) => {
  const id = useInstanceId(SizeControl, "vpb-size");
  const [num, savedUnit] = split(value);
  // Kept locally so a unit click shows even while the number is empty.
  const [pickedUnit, setPickedUnit] = useState(savedUnit || units[0]?.value || "");
  const unit = savedUnit || pickedUnit;

  const save = (n, u) => onChange(n === "" || n === undefined ? "" : `${n}${u}`);

  const pickUnit = (u) => {
    setPickedUnit(u);
    if (num !== "") save(num, u);
  };

  return (
    <BaseControl id={id} label={label} help={help} className={`vpb-size-control ${className}`} __nextHasNoMarginBottom>
      <div className="vpb-size-row">
        <NumberControl
          id={id}
          value={num}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(n) => save(n, unit)}
          __next40pxDefaultSize
        />
        {units.length > 1 ? (
          <ToggleGroupControl
            label={__("Unit", "video-player-block")}
            hideLabelFromVision
            value={unit}
            onChange={pickUnit}
            __next40pxDefaultSize
            __nextHasNoMarginBottom>
            {units.map((u) => (
              <ToggleGroupControlOption key={u.value} value={u.value} label={u.label || u.value} />
            ))}
          </ToggleGroupControl>
        ) : (
          <span className="vpb-size-unit">{unit}</span>
        )}
      </div>
    </BaseControl>
  );
};
