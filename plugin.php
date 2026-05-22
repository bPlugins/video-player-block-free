<?php
/**
 * Plugin Name: Video Player Block Free
 * Description: A Simple, accessible, Easy to Use & fully Customizable video player.
 * Version: 1.0.6
 * Requires at least: 6.5
 * Tested up to: 7.0
 * Requires PHP: 7.4
 * Author: bPlugins
 * Author URI: https://bplugins.com
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: video-player-block
 *
 * @package VPBP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( function_exists( 'vpbp_fs' ) ) {
	vpbp_fs()->set_basename( true, __FILE__ );
} else {
	// Constants
	define( 'VPBP_PLUGIN_VERSION', defined( 'WP_DEBUG' ) && WP_DEBUG ? time() : '1.0.6' );
	define( 'VPBP_DIR_URL', plugin_dir_url( __FILE__ ) );
	define( 'VPBP_PUBLIC_DIR', VPBP_DIR_URL . 'public/' );
	define( 'VPBP_DIR_PATH', plugin_dir_path( __FILE__ ) );

	require_once VPBP_DIR_PATH . '/includes/fs-lite.php';

	require_once VPBP_DIR_PATH . '/includes/rootPlugin/plugin.php';

	// Main plugin class
	if ( ! class_exists( 'VPBPPlugin' ) ) {
		class VPBPPlugin {
			public function __construct() {
				add_action( 'enqueue_block_assets', [ $this, 'registerBlockAssets' ] );
				add_action( 'enqueue_block_editor_assets', [ $this, 'vpbpEnqueueBlockEditorAssets' ] );
				add_filter( 'block_categories_all', [ $this, 'register_block_category' ], 10, 2 );
			}

			/**
			 * Register Plyr assets for use as block.json dependencies.
			 * Do NOT enqueue here — block.json viewScript/editorScript declare the dependency,
			 * so WordPress will only load Plyr on pages where the block is present.
			 */
			public function registerBlockAssets() {
				wp_register_script( 'plyr', VPBP_PUBLIC_DIR . 'js/plyr.js', [], '3.8.4', true );
				wp_register_style( 'plyr', VPBP_PUBLIC_DIR . 'css/plyr.css', [], '3.8.4' );
			}

			public function vpbpEnqueueBlockEditorAssets() {
				wp_add_inline_style(
					'wp-block-editor',
					'
					.dashicons-categories-icon,
					.dashicons.dashicons-media-video.categories-icon {
						color: #136EF5 !important;
					}
					'
				);

				if ( wp_script_is( 'vpbp-video-player-block-editor-script', 'registered' ) ) {
					wp_set_script_translations( 'vpbp-video-player-block-editor-script', 'video-player-block', VPBP_DIR_PATH . 'languages' );
				}
			}

			/**
			 * Register a custom block category for all Video Player blocks.
			 *
			 * @param array   $categories Existing block categories.
			 * @param WP_Post $post       Current post object.
			 * @return array
			 */
			public function register_block_category( $categories, $post ) {
				array_unshift( $categories, [
					'slug'  => 'vpbpblocks',
					'title' => __( 'Video Player Block', 'video-player-block' ),
					'icon'  => 'dashicons-media-video',
				] );
				return $categories;
			}
		}
		new VPBPPlugin();
	}
}
