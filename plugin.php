<?php
/**
 * Plugin Name: Video Player Block
 * Description: A Simple, accessible, Easy to Use & fully Customizable video player. 
 * Version: 2.0.0
 * Requires at least: 6.5
 * Tested up to: 7.0
 * Requires PHP: 7.4
 * Author: bPlugins
 * Author URI: https://bplugins.com
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: video-player-block
 *
 * @fs_premium_only vendor/freemius, /includes/fs.php, /build/blocks/index.js, /build/blocks/index.css, /build/blocks/index.asset.php, /build/blocks/index.js.LICENSE.txt, /build/blocks/video-player-block, /build/blocks/videojs-player, /build/blocks/react-video-player, /build/blocks/vidstack-video-player, /includes/LicenseActivation.php
 * @fs_free_only /vendor/freemius-lite, /includes/fs-lite.php
 */

if (!defined('ABSPATH')) {
    exit;
}

if (function_exists('vpb_fs')) {
    vpb_fs()->set_basename(true, __FILE__);
} else {

// Constants
define('VPBP_PLUGIN_VERSION', (isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST'] === 'localhost') ? time() : '2.0.0');
define('VPBP_DIR_URL', plugin_dir_url(__FILE__));
define('VPBP_PUBLIC_DIR', VPBP_DIR_URL . 'public/');
define('VPBP_DIR_PATH', plugin_dir_path(__FILE__));

require_once VPBP_DIR_PATH . '/includes/fs-lite.php';
require_once VPBP_DIR_PATH . '/includes/rootPlugin/plugin.php';

// Main plugin class
if (!class_exists('VPBPPlugin')) {
    class VPBPPlugin {
        public function __construct() {
            add_action('enqueue_block_assets', [$this, 'enqueueBlockAssets']);
            add_action('wp_enqueue_scripts', [$this, 'wpEnqueueScripts']);
            add_action('enqueue_block_editor_assets', [$this, 'vpbpEnqueueBlockEditorAssets']);
        }


        /**
         * Fires in BOTH the iframe editor (API v3 canvas) AND the frontend.
         *
         * This is the key hook for API v3 iframe support. In WordPress 6.5+,
         * the editor canvas is an <iframe> with its own window/document.
         * Plyr MUST be enqueued here so iframeWindow.Plyr exists.
         *
         * IMPORTANT: Do NOT use is_admin() or has_block() conditionals here!
         * In the API v3 iframe, is_admin() returns false (it loads like
         * a frontend page), but global $post is not available, which causes
         * has_shortcode() to throw a fatal error.
         */
        public function enqueueBlockAssets() {
            wp_register_script('plyr', VPBP_PUBLIC_DIR . 'js/plyr.js', [], '3.8.4', true);
            wp_register_style('plyr', VPBP_PUBLIC_DIR . 'css/plyr.css', [], '3.8.4');

            wp_enqueue_script('plyr');
            wp_enqueue_style('plyr');
        }

        /**
         * Frontend-only enqueue hook.
         * Safety net — ensures Plyr loads even in edge cases.
         * WordPress deduplicates, so double-enqueuing is harmless.
         */
        public function wpEnqueueScripts() {
            wp_enqueue_script('plyr');
            wp_enqueue_style('plyr');
        }

        
          	

        /**
         * Parent frame only (admin chrome around the iframe).
         * Plyr here is NOT accessible to iframeWindow.Plyr, but is
         * needed for: parent-frame fallback, sprite copy source,
         * and editor sidebar previews.
         */
        public function vpbpEnqueueBlockEditorAssets() {
            wp_enqueue_script('plyr');
            wp_enqueue_style('plyr');

            wp_add_inline_style(
                'wp-block-editor',
                '
                .dashicons-categories-icon,
                .dashicons.dashicons-media-video.categories-icon {
                    color: #136EF5 !important;
                }
                '
            );

            $handle = 'vpbp-video-player-block-editor-script';
            wp_set_script_translations($handle, 'video-player-block', VPBP_DIR_PATH . 'languages'); 


            wp_add_inline_script( 'vpbp-video-player-block-editor-script', sprintf(
					'const vpbpPricingUrl = %s;',
					wp_json_encode( admin_url( 'edit.php?post_type=video-player-block&page=vpbp-help-demo#pricing' ) )
				), 'before' );

        }
    }
    new VPBPPlugin();
}



// Add custom block category
add_filter('block_categories_all', function ($categories, $post) {
    array_unshift($categories, [
        'slug'  => 'vpbpblocks',
        'title' => __('Video Player Block', 'video-player-block'),
        'icon' => 'categories-icon dashicons dashicons-media-video',
    ]);
    return $categories;
}, 10, 2);


}