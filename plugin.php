<?php
/**
 * Plugin Name: Video Player Block Free
 * Description: A Simple, accessible, Easy to Use & fully Customizable video player. 
 * Version: 1.0.6
 * Author: bPlugins
 * Author URI: https://bplugins.com
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: video-player
 *
 * @fs_premium_only vendor/freemius, /includes/fs.php, /build/blocks/index.js, /build/blocks/index.css, /build/blocks/index.asset.php, /build/blocks/index.js.LICENSE.txt, /build/blocks/lightbox-video-gallery, /build/blocks/masonry-video-grid, /build/blocks/parallax-row-video-gallery, /build/blocks/slider-autoplay-video, /build/blocks/video-carousel-gallery, /build/blocks/video-playlist-gallery, /build/blocks/video-slider, /build/blocks/video-testimonial-section, /includes/video-stats-api.php, /includes/woocommerce-integration.php, /public/images/video-gallery-block-banner.gif, /includes/LicenseActivation.php
 * @fs_free_only /vendor/freemius-lite, /includes/fs-lite.php, /public/images/blocks.png
 */

if (!defined('ABSPATH')) {
    exit;
}

if (function_exists('vpb_fs')) {
    vpb_fs()->set_basename(true, __FILE__);
} else {
    // Constants
    define('VPBP_PLUGIN_VERSION', (isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST'] === 'localhost') ? time() : '1.0.6');
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
                add_filter( 'default_title', [$this, 'defaultTitle'], 10, 2 );
                add_filter( 'default_content', [$this, 'defaultContent'], 10, 2 );
            }

            function defaultTitle( $title, $post ) {
                if ( 'page' === $post->post_type && isset( $_GET['title'] ) ) {
                    return sanitize_text_field( wp_unslash( $_GET['title'] ) );
                }
                return $title;
            }

            function defaultContent( $content, $post ) {
                if ( 'page' === $post->post_type && isset( $_GET['content'] ) ) {
                    return wp_kses_post( wp_unslash( $_GET['content'] ) );
                }
                return $content;
            }

            public function enqueueBlockAssets() {
                wp_register_script(
                    'isotope',
                    VPBP_PUBLIC_DIR . 'js/isotope.pkgd.min.js',
                    ['jquery'],
                    '3.0.6',
                    true
                );
                wp_enqueue_script('isotope');

                wp_register_script('plyr', VPBP_PUBLIC_DIR . 'js/plyr.js', [], '3.8.4', true);
                wp_register_style('plyr', VPBP_PUBLIC_DIR . 'css/plyr.css', [], '3.8.4');
            }

            public function wpEnqueueScripts() {
                wp_enqueue_script('plyr');
                wp_enqueue_style('plyr');
            }

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

                $disabledBlocks = get_option( 'vpbpDisabledBlocks', [] );
                $disabledBlocks = is_array( $disabledBlocks ) ? $disabledBlocks : [];
                $editor_scripts = ['vpbp-video-player-block-editor-script'];
                foreach ( $editor_scripts as $handle ) {
                    if ( wp_script_is( $handle, 'registered' ) ) {
                        wp_localize_script(
                            $handle,
                            'vpbpDisabledBlocks',
                            $disabledBlocks
                        );
                        wp_set_script_translations( $handle, 'video-player', VPBP_DIR_PATH . 'languages' );
                    }
                }
            }
        }
        new VPBPPlugin();
    }
}

// Add custom block category
add_filter('block_categories_all', function ($categories, $post) {
    array_unshift($categories, [
        'slug'  => 'vpbpblocks',
        'title' => __('Video Player Block', 'video-player'),
        'icon' => 'categories-icon dashicons dashicons-media-video',
    ]);
    return $categories;
}, 10, 2);
