<?php
namespace VPBP;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Enqueue {
    function __construct() {
        add_action( 'admin_enqueue_scripts', [$this, 'adminEnqueueScripts']);
    }
    function adminEnqueueScripts($screen) {
        global $typenow;
        // For post type screens
        if ('video-player-block' === $typenow) {
            wp_enqueue_script('vpbp-admin-post-js', VPBP_DIR_URL . 'build/admin/post.js', [], VPBP_PLUGIN_VERSION, true);
            wp_enqueue_style('vpbp-admin-post-css', VPBP_DIR_URL . 'build/admin/post.css', [], VPBP_PLUGIN_VERSION);
        }
        // For dashboard/menu page screen
        if ($screen === "video-player-block_page_vpbp-help-demo") {
            wp_enqueue_script('vpbp-admin-dashboard-js', VPBP_DIR_URL . 'build/admin/dashboard.js', ['react', 'react-dom', 'wp-util'], VPBP_PLUGIN_VERSION, true);
            wp_enqueue_style('vpbp-admin-dashboard-css', VPBP_DIR_URL . 'build/admin/dashboard.css', [], VPBP_PLUGIN_VERSION);
            wp_set_script_translations( 'vpbp-admin-dashboard-js', 'video-player-block', VPBP_DIR_PATH . 'languages' );
        }
    }
}