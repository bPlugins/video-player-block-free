import {
  videoPlayerIcon,
  reactVideoPlayerIcon,
  videojsPlayerIcon,
  vidstackPlayerIcon,
  videoGalleryIcon,
  videoLightboxIcon,
  videoComparisonIcon,
  videoTestimonialIcon,
  videoPlaylistIcon,
  videoReelsIcon,
  videoTranscriptIcon
} from "./blockIcons";
import blocks from "./blocks";
import { videoPlayerBanner } from "../assets/banner";
import { videoPlayerLogo } from "../assets/logo";

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
      logo: videoPlayerLogo,
      banner: `https://ps.w.org/${slug}/assets/banner-772x250.png`,
      thumbnail: videoPlayerBanner,
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
      {
        key: "shortcode",
        label: "Shortcode",
        steps: [
          {
            num: 1,
            title: "Create a Player",
            body: "Go to <strong>Video Player</strong> in your admin menu and click <strong>Add New</strong>.",
            link: { url: `${adminUrl}post-new.php?post_type=video-player-block`, label: "Add New Player" },
          },
          {
            num: 2,
            title: "Customize & Publish",
            body: "Add your video source, configure player settings, and <strong>Publish</strong> the post.",
          },
          {
            num: 3,
            title: "Copy the Shortcode",
            body: "Go to <strong>Video Player -> All Players</strong> to find and copy your player shortcode (e.g. <code>[video_player id=\"123\"]</code>).",
            link: { url: `${adminUrl}edit.php?post_type=video-player-block`, label: "All Players" },
          },
          {
            num: 4,
            title: "Paste & Display",
            body: "Paste the copied shortcode into any post, page, widget, or page builder layout where you want the player to render.",
          },
        ],
      },
      {
        key: "elementor",
        label: "Elementor",
        steps: [
          {
            num: 1,
            title: "Create a Player",
            body: "Go to <strong>Video Player -> Add New</strong> to configure and publish a video player, then copy its shortcode.",
            link: { url: `${adminUrl}post-new.php?post_type=video-player-block`, label: "Add New Player" },
          },
          {
            num: 2,
            title: "Edit with Elementor",
            body: "Open any post or page in the <strong>Elementor</strong> editor.",
          },
          {
            num: 3,
            title: "Add Shortcode Widget",
            body: "Search for the <strong>Shortcode</strong> widget in the Elementor elements panel and drag it into your layout.",
          },
          {
            num: 4,
            title: "Paste Shortcode",
            body: "Paste your player shortcode (e.g., <code>[video_player id=\"123\"]</code>) into the widget input field and save your changes.",
          },
        ],
      },
      {
        key: "php",
        label: "PHP",
        steps: [
          {
            num: 1,
            title: "Get Player ID",
            body: "Go to <strong>Video Player -> All Players</strong> and note the <strong>ID</strong> of the player you want to embed.",
            link: { url: `${adminUrl}edit.php?post_type=video-player-block`, label: "All Players" },
          },
          {
            num: 2,
            title: "Copy PHP Function",
            body: "Copy the WordPress <code>do_shortcode</code> function: <pre><code>&lt;?php echo do_shortcode('[video_player id=\"YOUR_ID\"]'); ?&gt;</code></pre>",
          },
          {
            num: 3,
            title: "Insert in Template",
            body: "Open your theme or template files (e.g., <code>single.php</code>, <code>page.php</code>) in an editor.",
          },
          {
            num: 4,
            title: "Replace ID & Save",
            body: "Paste the code into your PHP file and replace <code>YOUR_ID</code> with the actual ID of your video player.",
          },
        ],
      },
    ],
  },

  // Changelogs — each list item starts with <strong>Type:</strong> for badges
  changelogs: [
    {
      version: "2.3.0 - 24 Nov 26",
      type: "new",
      list: [
        "<strong>New:</strong> Video Fit (Fit / Fill), Poster Fit (Cover / Contain) and Poster Position (Top / Center / Bottom) as picture buttons.",
        "<strong>New:</strong> Caption tracks are a draggable list with copy and delete; adding the first caption file turns the CC button on.",
        "<strong>New:</strong> Live YouTube and Vimeo player in the editor: one click plays or pauses and selects the block; Vimeo quality menu; Lazy Load really defers the video.",
        "<strong>Improve:</strong> A cleaner sidebar organised by importance, one-click Aspect Ratio and size units, new dashboard icons and accent color.",
        "<strong>Improve:</strong> Phone players show the Picture-in-Picture, Download and Restart buttons when you turn them on.",
        "<strong>Fix:</strong> An empty player renders nothing; smaller editor bundle.",
        "<strong>Fix:</strong> The editor and the page now show the same YouTube thumbnail.",
        "<strong>Security:</strong> Block settings can no longer break out of the block's CSS; the [video_player id=…] shortcode only shows Video Player posts; the admin dashboard library is updated.",
        "<strong>Tweak:</strong> The first-time tour only appears where it fits.",
        "<strong>New:</strong> Dashboard, Docs, Support and Rate links on the Plugins screen.",
        "<strong>Fix:</strong> Activating Pro now always turns Free off, whichever folder Free is installed in.",
      ],
    },
    {
      version: "2.2.1 - 16 Nov 26",
      type: "update",
      list: [
        "<strong>Security:</strong> Hardened block CSS output and video embed ID handling.",
        "<strong>New:</strong> Added polite, dismissible WordPress.org review request notice.",
        "<strong>Fix:</strong> Fixed unwanted bullet dots appearing on list items in dashboard settings danger zone.",
        "<strong>Tweak:</strong> Improved data cleanup handling on plugin uninstall.",
      ],
    },
    {
      version: "2.2.0 - 13 Oct 26",
      type: "new",
      list: [
        "<strong>New:</strong> Five ready-made sections under Video Players in the inserter. Each one comes finished with heading, copy, aspect ratio, corner radius, accent colour and the right controls.",
        "<strong>Update:</strong> Freemius SDK updated to 2.13.5.",
        "<strong>Fix:</strong> After activating the plugin, the page no longer says you are not allowed to access it. The Freemius opt-in now opens first, then the first page of the plugin.",
        "<strong>Fix:</strong> Every bundled section showed a black player. The poster images now load correctly.",
        "<strong>Fix:</strong> The block now has a working preview in the inserter, and it shows the poster instead of a black player.",
        "<strong>Fix:</strong> Two column sections now use the width of the section around them instead of about half of it.",
      ]
    },
    {
      version: "2.1.1 - 08 Jul 26",
      type: "new",
      list: [
        "<strong>New:</strong> Added <strong>Caption</strong> feature.",
        "<strong>New:</strong> Added custom aspect ratios.",
        "<strong>New:</strong> Added Lazy load controls.",
        "<strong>New:</strong> Responsive design improved.",
        "<strong>New:</strong> UX Improved.",
        "<strong>Fix:</strong> Fixed some bugs.",
      ]
    },
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
  // Freemius puts this in the checkout iframe URL, so it has to stay a short
  // https link. A data URI makes the URL about 11 KB and Cloudflare answers 520.
  logo: `https://ps.w.org/${slug}/assets/icon-256x256.png`,
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
