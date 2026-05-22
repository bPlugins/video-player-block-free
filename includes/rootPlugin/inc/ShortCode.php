<?php
namespace VPBP;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class ShortCode {
	function __construct() {
		add_shortcode( 'video_player', [ $this, 'vpbp_shortcode' ] );
	}

	function vpbp_shortcode( $atts ) {
		$post_id = isset( $atts['id'] ) ? intval( $atts['id'] ) : 0;
		if ( ! $post_id ) {
			return '';
		}
		$post = get_post( $post_id );
		if ( ! $post ) {
			return '';
		}
		if ( post_password_required( $post ) ) {
			return get_the_password_form( $post );
		}
		switch ( $post->post_status ) {
			case 'publish':
				return $this->displayContent( $post );

			case 'private':
				if ( current_user_can( 'read_private_posts' ) ) {
					return $this->displayContent( $post );
				}
				return '';

			case 'draft':
			case 'pending':
			case 'future':
				if ( current_user_can( 'edit_post', $post_id ) ) {
					return $this->displayContent( $post );
				}
				return '';

			default:
				return '';
		}
	}

	function displayContent( $post ) {
		// Filter out freeform (null-blockName) entries produced by parse_blocks() on non-block content.
		$blocks = array_values(
			array_filter(
				parse_blocks( $post->post_content ),
				function( $block ) {
					return ! empty( $block['blockName'] );
				}
			)
		);

		if ( empty( $blocks ) ) {
			return '';
		}

		// render_block() output is trusted WordPress core output — no need for wp_kses_post().
		return render_block( $blocks[0] );
	}
}
