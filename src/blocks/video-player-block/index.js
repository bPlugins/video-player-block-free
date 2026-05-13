import { registerBlockType } from "@wordpress/blocks";
import "./editor.scss";
import metadata from "./block.json";
import Edit from "./Components/Backend/Edit";
import { videoIcon } from "./utils/icons";

registerBlockType(metadata, {
  icon: videoIcon,
  edit: Edit,
  save: () => null,
});
