<?php
/**
 * Uninstall handler for Video Player Block.
 *
 * Cleans up plugin data when the plugin is deleted from the admin.
 * Only runs if the user has opted in via the "Delete data on uninstall" setting.
 *
 * @package VPBP
 */

// Exit if not called by WordPress.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

$vpbp_is_delete_data = get_option( 'vpbp_delete_data_on_uninstall', false );

if ( ! $vpbp_is_delete_data ) {
	return;
}

global $wpdb;

// 1. Delete all 'video-player-block' custom post type posts and their meta/revisions efficiently.
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Direct query is required in uninstall.php; caching is irrelevant as data is being permanently deleted.
$vpbp_post_ids = $wpdb->get_col( $wpdb->prepare( "SELECT ID FROM $wpdb->posts WHERE post_type = %s", 'video-player-block' ) );

if ( ! empty( $vpbp_post_ids ) ) {
	foreach ( $vpbp_post_ids as $post_id ) {
		wp_delete_post( $post_id, true ); // Force delete (bypass trash).
	}
}

// 2. Delete plugin options.
delete_option( 'vpbp_delete_data_on_uninstall' );