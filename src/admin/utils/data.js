import {
  videoPlayerIcon,
  reactVideoPlayerIcon,
  videojsPlayerIcon,
  vidstackPlayerIcon,
} from "../../Components/Common/utils/icons";
import blocks from "./blocks";

const slug = "video-player-block";

export const dashboardInfo = (info) => {
  const {
    version,
    vpbpDisabledBlocks,
    disabledBlocksNonce,
    adminUrl,
    uninstallNonce,
    deleteDataOnUninstall,
  } = info;

  return {
    name: "Video Player Block",
    displayName: "Video Player Block - Embed and Play Videos in Custom Player",
    description:
      "Enhance your WordPress site with professional video player blocks. Embed YouTube, Vimeo, self-hosted, or HLS videos with extensive customization. The Pro version unlocks 3 additional advanced engines: React, Video.js, and Vidstack.",
    slug,
    version,
    uninstallNonce,
    deleteDataOnUninstall,
    disabledBlocks: vpbpDisabledBlocks,
    disabledBlocksNonce,
    adminUrl,
    allBlocks: blocks,
    displayOurPlugins: true,
    media: {
      logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
      banner: `https://ps.w.org/${slug}/assets/banner-772x250.png`,
      thumbnail: `https://bplugins.com/wp-content/uploads/2026/01/video-gallery-block.png`,
      //   thumbnail: `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/${slug}.png`,
      // proThumbnail: `https://bplugins.com/wp-content/uploads/2026/01/3d-image-gallery.png`,
      //   video: "https://www.youtube.com/watch?v=milYZrqLJsE",
      //   isYoutube: true,
    },
    pages: {
      org: `https://wordpress.org/plugins/${slug}/`,
      landing: `https://bplugins.com/products/${slug}/`,
      //   docs: `https://bplugins.com/docs/${slug}/`,
      pricing: `https://bplugins.com/products/${slug}/pricing`,
    },
    freemius: {
      product_id: 20181,
      plan_id: 33471,
      public_key: "pk_24433ae07b8acef1ebd1c99de9fa5",
    },
    changelogs: [
      {
        version: "1.0.7 - 14 May 2026",
        list: ["Add 3 new video player blocks"],
        type: "new",
      },
      {
        version: "1.0.6 - 20 Nov 24",
        list: ["Fix multiple render issue"],
        type: "update",
      },
      { version: "1.0.5 - 8 Jan 24", list: ["Fix autoplay"], type: "update" },
      {
        version: "1.0.4",
        list: ["Not loading the assets where the block is not added"],
        type: "update",
      },
      { version: "1.0.3", list: ["Add translate feature"], type: "update" },
      {
        version: "1.0.2",
        list: ["Reduce PHP Code.", "Performance Improvement"],
        type: "update",
      },
      { version: "1.0.1", list: ["Reduce PHP Code."], type: "update" },
      { version: "1.0.0", list: ["Initial Release."], type: "update" },
    ],
    proFeatures: [
      "Advanced React Video Player Engine",
      "Industry Standard Video.js Player Support",
      "State-of-the-Art Vidstack Player Engine",
      "HLS (.m3u8) Streaming Support",
      "Advanced Color & Typography Customization",
      "Quality Switcher & Multiple Subtitles Support",
      "Custom Playback Speeds (0.5x to 2x)",
      "External Media Sources (Amazon S3, DigitalOcean, etc.)",
      "Advanced Playback Buttons (Restart, Rewind, Fast-Forward)",
      "Optimized Preload & Media Load Strategies",
      "Custom Border Radius & Player UI Styling",
      "Show/Hide Specific Player Controls",
    ],
    startButton: {
      label: "Start Now",
      url: `wp-admin/post-new.php?post_type=video-player-block`,
      // url: `wp-admin/post-new.php?post_type=page&title=Video Gallery Block&content=<!-- wp:vgb/video-gallery /-->&nonce=${nonce}`,
    },
  };
};

export const demoInfo = {
  allInOneLabel: "See All Demos",
  allInOneLink: "https://bblockswp.com/demo/video-player-block-all-demos/",
  demos: [
    {
      icon: videoPlayerIcon,
      title: "Video Player Default",
      type: "iframe",
      url: "https://bblockswp.com/demo/video-player-block-default/",
    },
    {
      icon: reactVideoPlayerIcon,
      title: "React Video Player",
      type: "iframe",
      url: "https://bblockswp.com/demo/video-player-block-react-video-player/",
    },
    {
      icon: videojsPlayerIcon,
      title: "Videojs Player",
      type: "iframe",
      url: "https://bblockswp.com/demo/video-player-block-videojs-player/",
    },
    {
      icon: vidstackPlayerIcon,
      title: "Vidstack Player",
      type: "iframe",
      url: "https://bblockswp.com/demo/video-player-block-vidstack-player/",
    },
  ],
};

export const pricingInfo = {
  logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
  pluginId: 20181,
  planId: 33471,
  licenses: [1, 3, null],
  button: {
    label: "Buy Now ➜",
  },
  featured: {
    selected: 3, // choose from licenses item
  },
};
