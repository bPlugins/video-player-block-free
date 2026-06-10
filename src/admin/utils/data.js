import {
  videoPlayerIcon,
  reactVideoPlayerIcon,
  videojsPlayerIcon,
  vidstackPlayerIcon,
  videoGalleryIcon,
  videoHeroIcon,
  videoLightboxIcon,
  videoComparisonIcon,
  videoTestimonialIcon,
  videoPlaylistIcon,
  videoReelsIcon,
  interactiveVideoIcon,
  videoTranscriptIcon,
  stickyVideoIcon,
} from "../../Components/Common/utils/icons";
import blocks from "./blocks";
import icon from "../../../public/images/icon-128x128.png";

const slug = "video-player-block";

export const dashboardInfo = (info) => {
  const {
    version,
    adminUrl,
    uninstallNonce,
    deleteDataOnUninstall,
  } = info;

  return {
    name: "Video Player Block",
    displayName: "Video Player Block - Embed and Play Videos in Custom Player",
    description:
      "Enhance your WordPress site with professional video player blocks. Embed YouTube, Vimeo, or self-hosted videos with extensive customization. The Pro version unlocks 3 advanced engines (React, Video.js, and Vidstack), 7 Pro blocks (Gallery, Playlist, Lightbox, Reels, Comparison, Testimonial Card, and Transcript), plus HLS/DASH streaming and Mux integration.",
    slug,
    version,
    uninstallNonce,
    deleteDataOnUninstall,
    adminUrl,
    allBlocks: blocks,
    displayOurPlugins: true,
    media: {
      logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
      banner: `https://ps.w.org/${slug}/assets/banner-772x250.png`,
      thumbnail: icon,
      //   thumbnail: `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/${slug}.png`,
      // proThumbnail: `https://bplugins.com/wp-content/uploads/2026/01/3d-image-gallery.png`,
      //   video: "https://www.youtube.com/watch?v=milYZrqLJsE",
      //   isYoutube: true,
    },
    pages: {
      org: `https://wordpress.org/plugins/${slug}/`,
      landing: `https://bplugins.com/products/${slug}/`,
      docs: `https://bplugins.com/docs/${slug}/`,
      pricing: `https://bplugins.com/products/${slug}/pricing`,
    },
    freemius: {
      product_id: 20181,
      plan_id: 33471,
      public_key: "pk_24433ae07b8acef1ebd1c99de9fa5",
    },
    startButton: {
      label: "Start Now",
      url: `wp-admin/post-new.php?post_type=video-player-block`,
      // url: `wp-admin/post-new.php?post_type=page&title=Video Gallery Block&content=<!-- wp:vgb/video-gallery /-->&nonce=${nonce}`,
    },
  };
};

export const welcomeInfo = (adminUrl = "") => ({
  // Hero card keyword chips
  keywords: ["YouTube", "Vimeo", "Self-hosted"],
  keywordsLabel: "Supports",

  // Getting Started tabbed steps
  gettingStarted: {
    tabs: [
      {
        key: "gutenberg",
        label: "Gutenberg",
        steps: [
          {
            num: 1,
            title: "Add the Block",
            body: "Open the block editor. Click <strong>+</strong> or type <strong>/Video Player</strong>.",
            link: { url: `${adminUrl}post-new.php`, label: "Open Editor" },
          },
          {
            num: 2,
            title: "Set Your Source",
            body: "Paste a <strong>YouTube</strong>, <strong>Vimeo</strong>, or self-hosted URL.",
          },
          {
            num: 3,
            title: "Customize the Player",
            body: "Configure controls, autoplay, poster, and playback options.",
          },
          {
            num: 4,
            title: "Style & Publish",
            body: "Adjust colors, border radius, and UI styling, then publish.",
          },
        ],
      },
    ],
  },

  // Changelogs — each list item starts with <strong>Type:</strong> for badges
  changelogs: [
    {
      version: "2.0.0 - 10 Jun 26",
      type: "new",
      list: [
        "<strong>New:</strong> Added 7 new Pro video blocks — Video Gallery, Video Playlist, Video Lightbox, Video Reels, Video Comparison, Video Testimonial Card, and Video Transcript.",
        "<strong>New:</strong> Added HLS (.m3u8) and DASH (.mpd) streaming support.",
        "<strong>New:</strong> Added Mux video integration and external source support (Amazon S3, DigitalOcean Spaces, BunnyCDN).",
        "<strong>New:</strong> Added lazy loading, preloading, and Google Cast / Chromecast support.",
        "<strong>Improve:</strong> Improved player styling — custom aspect ratios, glassmorphism controls, advanced shadow and border options.",
        "<strong>Improve:</strong> General performance improvements and bug fixes.",
      ],
    },
    {
      version: "1.0.6 - 20 Nov 24",
      type: "new",
      list: [
        "<strong>New:</strong> Add 3 new advanced video player blocks (React, Video.js, Vidstack).",
        "<strong>Fix:</strong> Fixed build error.",
      ],
    },
    {
      version: "1.0.6 - 20 Nov 24",
      type: "update",
      list: ["<strong>Fix:</strong> Fixed multiple render issue."],
    },
    {
      version: "1.0.5 - 8 Jan 24",
      type: "update",
      list: ["<strong>Fix:</strong> Fixed autoplay."],
    },
    {
      version: "1.0.4",
      type: "update",
      list: ["<strong>Improve:</strong> Avoid loading assets where the block is not added."],
    },
    {
      version: "1.0.3",
      type: "update",
      list: ["<strong>New:</strong> Added translate feature."],
    },
    {
      version: "1.0.2",
      type: "update",
      list: [
        "<strong>Update:</strong> Reduced PHP code.",
        "<strong>Improve:</strong> Performance improvement.",
      ],
    },
    {
      version: "1.0.1",
      type: "update",
      list: ["<strong>Update:</strong> Reduced PHP code."],
    },
    {
      version: "1.0.0",
      type: "update",
      list: ["<strong>New:</strong> Initial release."],
    },
  ],
  changelogsLimit: 6,
  changelogsReadMoreLabel: "View More Changelogs",

  // Pro upsell bullets (free users only)
  proFeatures: [
    "Advanced React, Video.js & Vidstack Player Engines",
    "7 Pro Blocks: Gallery, Playlist, Lightbox, Reels, Comparison, Testimonial & Transcript",
    "HLS (.m3u8) & DASH (.mpd) Streaming Support",
    "Mux Video Integration for High-Performance Playback",
    "External Media Sources (Amazon S3, DigitalOcean Spaces, BunnyCDN)",
    "Custom Aspect Ratios (16:9, 4:3, 21:9 & custom)",
    "Glassmorphism Controls, Advanced Shadow & Border Options",
    "Multiple Subtitle Tracks (VTT) & Playback Speeds (0.5x to 2x)",
    "Lazy Loading, Preloading & Google Cast / Chromecast",
    "Custom Border Radius & Player UI Styling",
    "Show/Hide Specific Player Controls",
  ],
});

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
      title: "React Video Player (Pro)",
      type: "iframe",
      url: "https://bblockswp.com/demo/video-player-block-react-video-player/",
    },
    {
      icon: videojsPlayerIcon,
      title: "Video.js Player (Pro)",
      type: "iframe",
      url: "https://bblockswp.com/demo/video-player-block-videojs-player/",
    },
    {
      icon: vidstackPlayerIcon,
      title: "VidStack Player (Pro)",
      type: "iframe",
      url: "https://bblockswp.com/demo/video-player-block-vidstack-player/",
    },
    {
      icon: videoGalleryIcon,
      title: "Video Gallery (Pro)",
      type: "iframe",
      url: "https://bblockswp.com/demo/video-player-block-video-gallery/",
    },
    {
      icon: videoLightboxIcon,
      title: "Video Lightbox (Pro)",
      type: "iframe",
      url: "https://bblockswp.com/demo/video-player-block-video-lightbox/",
    },
    {
      icon: videoComparisonIcon,
      title: "Video Comparison (Pro)",
      type: "iframe",
      url: "https://bblockswp.com/demo/video-player-block-video-comparison/",
    },
    {
      icon: videoTestimonialIcon,
      title: "Video Testimonial Card (Pro)",
      type: "iframe",
      url: "https://bblockswp.com/demo/video-player-block-video-testimonial-card/",
    },
    {
      icon: videoPlaylistIcon,
      title: "Video Playlist (Pro)",
      type: "iframe",
      url: "https://bblockswp.com/demo/video-player-block-video-playlist/#video=0&t=10",
    },
    {
      icon: videoReelsIcon,
      title: "Video Reels (Pro)",
      type: "iframe",
      url: "https://bblockswp.com/demo/video-player-block-video-reels/#reel=0",
    },
    {
      icon: videoTranscriptIcon,
      title: "Video Transcript (Pro)",
      type: "iframe",
      url: "https://bblockswp.com/demo/video-player-block-video-transcript/",
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
