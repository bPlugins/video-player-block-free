/**
 * First-run onboarding tours (Driver.js coach marks), shown once per user:
 *
 * - "adminmenu" context: the main WP Dashboard — spotlights the sidebar menu
 *   items (Posts, Pages, and the Video Player menu) so a new user knows where
 *   to go.
 * - "editor" context: the block editor — spotlights the inserter, canvas,
 *   settings sidebar and publish button.
 * - "cpt-editor" context: the Video Player CPT editor (a single locked video
 *   block) — how to fill it in and publish a reusable player.
 * - "cpt-list" context: the All Video Players list — the Add New button and
 *   the Shortcode column you copy and paste into a post or page.
 * - "dashboard" context: the plugin's Help & Demos admin page — spotlights
 *   the dashboard navigation sections.
 *
 * The PHP side (includes/Onboarding.php) only enqueues this bundle when the
 * current user hasn't dismissed the tour for that context yet, and sets
 * `window.vpbpOnboardingContext` on non-editor screens. Dismissal is stored
 * per user + per context via a tiny REST endpoint.
 */
import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import domReady from "@wordpress/dom-ready";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./onboarding.scss";

const context = window.vpbpOnboardingContext || "editor";

// Persist per-user so the tour never comes back; fire-and-forget. Fires on
// finish AND on close/skip — seeing it once is seeing it.
const dismiss = () => {
  apiFetch({
    path: "/vpbp/v1/onboarding/dismiss",
    method: "POST",
    data: { context },
  }).catch(() => {});
};

// Resolve the first matching selector at highlight time (markup differs
// across WP versions). Returning nothing makes Driver.js render the step as
// a centered popover instead of crashing — a safe fallback.
const firstMatch = (selectors) => () => {
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) return el;
  }
  return undefined;
};

const editorSteps = [
  {
    popover: {
      title: __("Welcome to Video Player Block 🎬", "video-player-block"),
      description: __(
        "You now have 1 video player block. Take the 30-second tour to see where everything lives.",
        "video-player-block",
      ),
    },
  },
  {
    element: firstMatch([
      ".editor-document-tools__inserter-toggle",
      ".edit-post-header-toolbar__inserter-toggle",
    ]),
    popover: {
      title: __("1. Insert a video block", "video-player-block"),
      description: __(
        "Click this + button and search for “video”, or browse the “Video Player Block” category. You can also type / in an empty paragraph.",
        "video-player-block",
      ),
      side: "bottom",
      align: "start",
    },
  },
  {
    element: firstMatch([
      ".interface-interface-skeleton__content",
      ".editor-styles-wrapper",
    ]),
    popover: {
      title: __("2. Add your video", "video-player-block"),
      description: __(
        "The block lands here on the canvas. Paste a YouTube, Vimeo or direct video URL — or upload a file from your Media Library.",
        "video-player-block",
      ),
      side: "left",
    },
  },
  {
    element: firstMatch([
      '.editor-header__settings button[aria-label="Settings"]',
      '.edit-post-header__settings button[aria-label="Settings"]',
      ".interface-pinned-items",
    ]),
    popover: {
      title: __("3. Customize it", "video-player-block"),
      description: __(
        "With the block selected, open Settings here. The General tab holds content and behavior; the Style tab holds colors, typography and effects.",
        "video-player-block",
      ),
      side: "bottom",
      align: "end",
    },
  },
  {
    element: firstMatch([
      ".editor-post-publish-button__button",
      ".editor-post-publish-panel__toggle",
      ".editor-post-publish-button",
    ]),
    popover: {
      title: __("4. Publish & see it live", "video-player-block"),
      description: __(
        "Preview first if you like, then Publish and click “View Page” — the player renders on your site's frontend with all your styling.",
        "video-player-block",
      ),
      side: "bottom",
      align: "end",
    },
  },
  {
    popover: {
      title: __("You're all set ✅", "video-player-block"),
      description:
        __(
          "That's the whole flow: insert, customize, publish.",
          "video-player-block",
        ) +
        ' <a href="https://bplugins.com/docs/video-player-block" target="_blank" rel="noreferrer">' +
        __("Read the documentation", "video-player-block") +
        "</a>",
    },
  },
];

const adminMenuSteps = [
  {
    popover: {
      title: __("Video Player Block is ready 🎬", "video-player-block"),
      description: __(
        "You've installed and activated the plugin. Here's where to go next — a quick look at your admin menu.",
        "video-player-block",
      ),
    },
  },
  {
    element: firstMatch(["#menu-posts"]),
    popover: {
      title: __("1. Add video to a post", "video-player-block"),
      description: __(
        "Open Posts to create or edit a blog post. Video Player blocks work in any post.",
        "video-player-block",
      ),
      side: "right",
      align: "start",
    },
  },
  {
    element: firstMatch(["#menu-pages"]),
    popover: {
      title: __("2. …or a page", "video-player-block"),
      description: __(
        "Pages work exactly the same way — both use the block editor where the video blocks live.",
        "video-player-block",
      ),
      side: "right",
      align: "start",
    },
  },
  {
    element: firstMatch([
      "#menu-posts-video-player-block",
      '#adminmenu a[href*="post_type=video-player-block"]',
    ]),
    popover: {
      title: __("3. The Video Player menu", "video-player-block"),
      description: __(
        "The plugin lives here. Hover it to reach “Help & Demos” — manage which blocks are enabled, browse demos, and open plugin settings.",
        "video-player-block",
      ),
      side: "right",
      align: "center",
    },
  },
  {
    popover: {
      title: __("That's the map ✅", "video-player-block"),
      description:
        __(
          "Open a post or page and insert your first video block — the editor has its own quick tour waiting.",
          "video-player-block",
        ) +
        ' <a href="https://bplugins.com/docs/video-player-block" target="_blank" rel="noreferrer">' +
        __("Read the documentation", "video-player-block") +
        "</a>",
    },
  },
];

const cptEditorSteps = [
  {
    popover: {
      title: __("A reusable video player 🎬", "video-player-block"),
      description: __(
        "This screen builds one saved player you can drop into any post or page with a shortcode. Here's how.",
        "video-player-block",
      ),
    },
  },
  {
    element: firstMatch([
      ".wp-block-vpb-video",
      ".block-editor-block-list__layout",
      ".editor-styles-wrapper",
    ]),
    popover: {
      title: __("1. Fill in the video", "video-player-block"),
      description: __(
        "The video block is already here — you don't insert anything. Click it and add your video URL (YouTube, Vimeo or a direct file).",
        "video-player-block",
      ),
      side: "top",
    },
  },
  {
    element: firstMatch([
      '.editor-header__settings button[aria-label="Settings"]',
      '.edit-post-header__settings button[aria-label="Settings"]',
      ".interface-pinned-items",
    ]),
    popover: {
      title: __("2. Customize it", "video-player-block"),
      description: __(
        "Open Settings to style the player — controls, colors, aspect ratio and more.",
        "video-player-block",
      ),
      side: "bottom",
      align: "end",
    },
  },
  {
    element: firstMatch([
      ".editor-post-publish-button__button",
      ".editor-post-publish-panel__toggle",
      ".editor-post-publish-button",
    ]),
    popover: {
      title: __("3. Publish it", "video-player-block"),
      description: __(
        "Give it a title and Publish. Then go to “All Video Players” — each published player has a shortcode you can copy.",
        "video-player-block",
      ),
      side: "bottom",
      align: "end",
    },
  },
  {
    popover: {
      title: __("Next: grab the shortcode ✅", "video-player-block"),
      description: __(
        "In All Video Players, copy this player's [video_player id=…] shortcode and paste it into any post or page.",
        "video-player-block",
      ),
    },
  },
];

const cptListSteps = [
  {
    popover: {
      title: __("Your Video Players library 🎬", "video-player-block"),
      description: __(
        "Every reusable player you save lives here — each one gets a shortcode you can reuse across your site.",
        "video-player-block",
      ),
    },
  },
  {
    element: firstMatch([".page-title-action"]),
    popover: {
      title: __("1. Add a new player", "video-player-block"),
      description: __(
        "Click Add New to build a player: fill in the video block, style it, and publish.",
        "video-player-block",
      ),
      side: "bottom",
      align: "start",
    },
  },
  {
    element: firstMatch([".bPlAdminShortcode", "#shortcode"]),
    popover: {
      title: __("2. Copy the shortcode", "video-player-block"),
      description: __(
        "Each player shows a shortcode in this column — click it to copy [video_player id=…] to your clipboard.",
        "video-player-block",
      ),
      side: "left",
    },
  },
  {
    popover: {
      title: __("3. Paste it anywhere ✅", "video-player-block"),
      description: __(
        "Edit any post or page, add a Shortcode block (or paste into a paragraph), and drop the shortcode in. The player renders on the frontend — reuse the same one in as many places as you like.",
        "video-player-block",
      ),
    },
  },
];

const dashboardSteps = [
  {
    popover: {
      title: __("Your Video Player Block dashboard 🎬", "video-player-block"),
      description: __(
        "Everything about the plugin lives on this page — a quick tour of the sections.",
        "video-player-block",
      ),
    },
  },
  {
    element: firstMatch([".bPlDashboardNav"]),
    popover: {
      title: __("1. Navigate the dashboard", "video-player-block"),
      description: __(
        "Switch between sections here — each opens below without leaving the page.",
        "video-player-block",
      ),
      side: "bottom",
      align: "start",
    },
  },
  {
    element: firstMatch(['.bPlDashboardNav a[href="#/blocks"]']),
    popover: {
      title: __("2. Manage your blocks", "video-player-block"),
      description: __(
        "Turn individual blocks on or off. Disabled blocks disappear from the editor's inserter, keeping it tidy if you only use a few.",
        "video-player-block",
      ),
      side: "bottom",
    },
  },
  {
    element: firstMatch(['.bPlDashboardNav a[href="#/demos"]']),
    popover: {
      title: __("3. Explore the demos", "video-player-block"),
      description: __(
        "See every block in action before you use it — galleries, playlists, reels and more.",
        "video-player-block",
      ),
      side: "bottom",
    },
  },
  {
    element: firstMatch(['.bPlDashboardNav a[href="#/settings"]']),
    popover: {
      title: __("4. Plugin settings", "video-player-block"),
      description: __(
        "Site-wide plugin options live here, like whether to remove all plugin data when uninstalling.",
        "video-player-block",
      ),
      side: "bottom",
      align: "end",
    },
  },
  {
    popover: {
      title: __("Ready to build ✅", "video-player-block"),
      description:
        __(
          "Now open any page or post and insert your first video block — the editor has its own quick tour waiting.",
          "video-player-block",
        ) +
        ' <a href="https://bplugins.com/docs/video-player-block" target="_blank" rel="noreferrer">' +
        __("Read the documentation", "video-player-block") +
        "</a>",
    },
  },
];

const stepsByContext = {
  adminmenu: adminMenuSteps,
  dashboard: dashboardSteps,
  editor: editorSteps,
  "cpt-editor": cptEditorSteps,
  "cpt-list": cptListSteps,
};

// Selector that must exist before the tour starts (the editor and the
// dashboard app mount asynchronously; admin list/menu markup is present
// immediately).
const readySelectorByContext = {
  adminmenu: "#adminmenu",
  dashboard: ".bPlDashboardNav a",
  editor:
    ".editor-document-tools__inserter-toggle, .edit-post-header-toolbar__inserter-toggle",
  "cpt-editor": ".editor-styles-wrapper, .block-editor-block-list__layout",
  "cpt-list": ".wp-list-table, .page-title-action",
};
const readySelector = readySelectorByContext[context] || readySelectorByContext.editor;

domReady(() => {
  // Give up waiting after ~10s and run anyway — unmatched steps degrade to
  // centered popovers.
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (!document.querySelector(readySelector) && tries < 40) return;
    clearInterval(timer);

    driver({
      showProgress: true,
      overlayOpacity: 0.65,
      stagePadding: 6,
      stageRadius: 6,
      popoverClass: "vpbp-tour",
      nextBtnText: __("Next", "video-player-block"),
      prevBtnText: __("Back", "video-player-block"),
      doneBtnText: __("Get started", "video-player-block"),
      progressText: "{{current}} / {{total}}",
      onDestroyed: dismiss,
      steps: stepsByContext[context] || editorSteps,
    }).drive();
  }, 250);
});
