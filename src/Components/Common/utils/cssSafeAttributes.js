/**
 * Block settings reach the page as CSS: a Style component writes them into a
 * <style> tag. Any Contributor can save a setting (or edit the block's code)
 * with a value like `10px;} body{display:none` and so add rules of their own.
 *
 * A setting only ever needs to be one value, so before a Style component builds
 * its stylesheet the settings lose the characters that could end a declaration,
 * open or close a rule, start a comment or escape a string. The value stays one
 * declaration, and normal values (`12px`, `#fff`, `"Open Sans", sans-serif`,
 * `calc(100% - 8px)`) pass through unchanged.
 */
const UNSAFE = /[;{}<>\\]|\/\*|\*\//g;

export const cssSafeAttributes = (value) => {
  if (typeof value === "string") return value.replace(UNSAFE, "");
  if (Array.isArray(value)) return value.map(cssSafeAttributes);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cssSafeAttributes(item)]));
  }
  return value;
};

export default cssSafeAttributes;
