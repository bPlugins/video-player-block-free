export const sanitizeStyleTag = (css) => String(css ?? '').replace(/</g, '');
export default sanitizeStyleTag;
