/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/video-player-block/Components/Common/Style.js":
/*!******************************************************************!*\
  !*** ./src/blocks/video-player-block/Components/Common/Style.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/data */ "./src/blocks/video-player-block/utils/data.js");


const Style = ({
  attributes,
  id
}) => {
  const {
    width,
    radius
  } = attributes;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("style", {
    dangerouslySetInnerHTML: {
      __html: `
		#${id} .${_utils_data__WEBPACK_IMPORTED_MODULE_1__.prefix}{
			width: ${["0px", "0%", "0em"].includes(width) ? "100%" : width};
			border-radius: ${radius};
			overflow: hidden;
		}
		`.replace(/\s+/g, " ")
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Style);

/***/ }),

/***/ "./src/blocks/video-player-block/utils/config.js":
/*!*******************************************************!*\
  !*** ./src/blocks/video-player-block/utils/config.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   plyrConfig: () => (/* binding */ plyrConfig)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functions */ "./src/blocks/video-player-block/utils/functions.js");

const plyrConfig = attributes => {
  const {
    controls,
    repeat,
    autoplay,
    muted,
    resetOnEnd,
    autoHideControl
  } = attributes;
  const mutedProps = muted ? {
    storage: {
      enabled: false,
      key: "plyr"
    },
    volume: 0
  } : {};
  let currentOrigin = typeof window !== "undefined" ? window.location.origin : "*";
  if (currentOrigin === "null" || currentOrigin === "about:blank") {
    try {
      currentOrigin = window.top?.location?.origin || "*";
    } catch (e) {
      currentOrigin = "*";
    }
  }
  return {
    controls: (0,_functions__WEBPACK_IMPORTED_MODULE_0__.controlsHandler)(controls),
    clickToPlay: false,
    loop: {
      active: repeat
    },
    muted,
    autoplay,
    ...mutedProps,
    resetOnEnd,
    hideControls: autoHideControl,
    playsinline: true,
    youtube: {
      noCookie: false,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      origin: currentOrigin
    }
  };
};

/***/ }),

/***/ "./src/blocks/video-player-block/utils/data.js":
/*!*****************************************************!*\
  !*** ./src/blocks/video-player-block/utils/data.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prefix: () => (/* binding */ prefix)
/* harmony export */ });
const prefix = "vpbpVideoPlayer";

/***/ }),

/***/ "./src/blocks/video-player-block/utils/functions.js":
/*!**********************************************************!*\
  !*** ./src/blocks/video-player-block/utils/functions.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   controlsHandler: () => (/* binding */ controlsHandler),
/* harmony export */   getExtension: () => (/* binding */ getExtension),
/* harmony export */   getVimeoId: () => (/* binding */ getVimeoId),
/* harmony export */   getYoutubeId: () => (/* binding */ getYoutubeId),
/* harmony export */   isVimeo: () => (/* binding */ isVimeo),
/* harmony export */   isYoutube: () => (/* binding */ isYoutube)
/* harmony export */ });
const controlsHandler = controls => {
  const newControls = [];
  Object.keys(controls).map(item => {
    if (controls[item]) {
      newControls.push(item);
    }
  });
  return newControls;
};
const getExtension = fileName => fileName.substring(fileName.lastIndexOf('.') + 1);
const isYoutube = url => {
  return url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);
};
const isVimeo = url => {
  return url.match(/^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+$/);
};
const getYoutubeId = url => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};
const getVimeoId = url => {
  const regExp = new RegExp('^.*(vimeo\\.com/)((channels/[^/]+/)|(groups/[^/]+/videos/)|(album/[^/]+/video/))?([0-9]+)');
  const match = url.match(regExp);
  return match ? match[6] : null;
};

/***/ }),

/***/ "./src/blocks/video-player-block/style.scss":
/*!**************************************************!*\
  !*** ./src/blocks/video-player-block/style.scss ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "../../../../test/wp-content/plugins/plugin-slug/node_modules/react-dom/client.js":
/*!****************************************************************************************!*\
  !*** ../../../../test/wp-content/plugins/plugin-slug/node_modules/react-dom/client.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) {} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************************************!*\
  !*** ./src/blocks/video-player-block/view.js ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "../../../../test/wp-content/plugins/plugin-slug/node_modules/react-dom/client.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/video-player-block/style.scss");
/* harmony import */ var _Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Components/Common/Style */ "./src/blocks/video-player-block/Components/Common/Style.js");
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/functions */ "./src/blocks/video-player-block/utils/functions.js");
/* harmony import */ var _utils_config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/config */ "./src/blocks/video-player-block/utils/config.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/data */ "./src/blocks/video-player-block/utils/data.js");








document.addEventListener('DOMContentLoaded', () => {
  const videoEls = document.querySelectorAll(".wp-block-vpb-video");
  videoEls.forEach(videoEl => {
    const attributes = JSON.parse(videoEl.dataset.attributes);
    (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(videoEl).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__["default"], {
      attributes: attributes,
      id: videoEl.id
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(RenderVideo, {
      attributes: attributes
    })));
    videoEl?.removeAttribute('data-attributes');
  });
});
const RenderVideo = ({
  attributes
}) => {
  const {
    source,
    poster,
    muted,
    autoplay
  } = attributes;
  const videoEl = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const player = new Plyr(videoEl.current, (0,_utils_config__WEBPACK_IMPORTED_MODULE_5__.plyrConfig)(attributes));
    player.on('ready', () => {
      if (muted && autoplay) {
        player.play();
      }
    });
  }, []);
  const autoplayProps = autoplay ? {
    autoplay
  } : {};
  const mutedProps = muted ? {
    muted
  } : {};
  const isYT = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_4__.isYoutube)(source);
  const isVM = (0,_utils_functions__WEBPACK_IMPORTED_MODULE_4__.isVimeo)(source);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: _utils_data__WEBPACK_IMPORTED_MODULE_6__.prefix
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "videoWrapper"
  }, isYT || isVM ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: videoEl,
    "data-plyr-provider": isYT ? 'youtube' : 'vimeo',
    "data-plyr-embed-id": isYT ? (0,_utils_functions__WEBPACK_IMPORTED_MODULE_4__.getYoutubeId)(source) : (0,_utils_functions__WEBPACK_IMPORTED_MODULE_4__.getVimeoId)(source)
  }) : /* eslint-disable-next-line react/no-unknown-property */
  (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("video", {
    controls: true,
    playsinline: true,
    "data-poster": poster,
    preload: "metadata",
    ...autoplayProps,
    ...mutedProps,
    ref: videoEl
  }, "Your browser does not support the video tag.", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("source", {
    src: source,
    type: `video/${(0,_utils_functions__WEBPACK_IMPORTED_MODULE_4__.getExtension)(source) || 'mp4'}`
  }))));
};
})();

/******/ })()
;
//# sourceMappingURL=view.js.map