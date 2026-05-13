import { produce } from "immer";

export const updateData = (attr, value, ...props) => {
  if (props.length === 0) {
    return value;
  }
  const [currentProp, ...remainingProps] = props;
  if (remainingProps.length === 0) {
    return produce(attr, (draft) => {
      draft[currentProp] = value;
    });
  }
  return produce(attr, (draft) => {
    if (!Object.prototype.hasOwnProperty.call(draft, currentProp)) {
      draft[currentProp] = {};
    }
    draft[currentProp] = updateData(
      draft[currentProp],
      value,
      ...remainingProps,
    );
  });
};

export const premiumBlocks = [
  "vpbp/react-video-player",
  "vpbp/videojs-player",
  "vpbp/vidstack-video-player",
];

export const isBlockEnabled = (name) => {
  const isPremium = vpbpPipecheck;
  const disabledBlocks = vpbpDisabledBlocks || [];
  const checkProBlock = premiumBlocks.includes(name);
  if (!isPremium && checkProBlock) {
    return false;
  }
  return !disabledBlocks.includes(name);
};
