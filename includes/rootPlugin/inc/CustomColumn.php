<?php
namespace VPBP;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class CustomColumn {
	function __construct() {
		add_filter(
			'manage_video-player-block_posts_columns',
			[ $this, 'manageColumns' ]
		);
		add_action(
			'manage_video-player-block_posts_custom_column',
			[ $this, 'manageCustomColumns' ],
			10,
			2
		);
	}

	function manageColumns( $columns ) {
		unset( $columns['date'] );
		// Only show the shortcode column if the shortcode is actually registered.
		if ( shortcode_exists( 'video_player' ) ) {
			$columns['shortcode'] = __( 'Shortcode', 'video-player-block' );
		}
		$columns['date'] = __( 'Date', 'video-player-block' );
		return $columns;
	}

	function manageCustomColumns( $column_name, $post_id ) {
		if ( 'shortcode' === $column_name && shortcode_exists( 'video_player' ) ) {
			$shortcode = sprintf( '[video_player id=%d]', $post_id );
			printf(
				'<div class="bPlAdminShortcode" id="bPlAdminShortcode-%s">
					<input value="%s" onclick="copyBPlAdminShortcode(\'%s\')" readonly>
					<span class="tooltip">%s</span>
				</div>',
				esc_attr( $post_id ),
				esc_attr( $shortcode ),
				esc_js( $post_id ),
				esc_html__( 'Copy To Clipboard', 'video-player-block' )
			);
		}
	}
}