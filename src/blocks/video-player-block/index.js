import { registerBlockType } from "@wordpress/blocks";
// bpl-tools' shared control styles (components are imported one by one, not
// through the bpl-tools barrel, so unused bpl-tools code isn't bundled).
import "../../../../bpl-tools/Components/style.scss";
import "./editor.scss";
import "./inspector.scss";
import metadata from "./block.json";
import Edit from "./Components/Backend/Edit";
import { videoIcon } from "./utils/icons";

registerBlockType(metadata, {
  icon: videoIcon,
  edit: Edit,
  save: () => null,
});
