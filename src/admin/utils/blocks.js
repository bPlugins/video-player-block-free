import {
  reactVideoPlayerIcon,
  videoPlayerIcon,
  videojsPlayerIcon,
  vidstackPlayerIcon,
} from "../../Components/Common/utils/icons";

const siteURL = "https://bblockswp.com";
const demoLink = `${siteURL}/demo`;

export default [
  {
    name: "vpbp/video-player-block",
    title: "Video Player",
    icon: videoPlayerIcon,
    demo: `${demoLink}/video-gallery-block-default/`,
    status: "published",
    required: true,
  },
  {
    name: "vpbp/react-video-player",
    title: "React Video Player",
    icon: reactVideoPlayerIcon,
    demo: `${demoLink}/video-gallery-block-lightbox-video-gallery/`,
    status: "published",
    isPremium: true,
  },
  {
    name: "vpbp/videojs-player",
    title: "VideoJs Player",
    icon: videojsPlayerIcon,
    demo: `${demoLink}/video-gallery-block-masonry-video-grid/`,
    status: "published",
    isPremium: true,
  },
  {
    name: "vpbp/vidstack-video-player",
    title: "Vidstack Player",
    icon: vidstackPlayerIcon,
    demo: `${demoLink}/video-gallery-block-parallax-row-video-gallery/`,
    status: "published",
    isPremium: true,
  }
];
