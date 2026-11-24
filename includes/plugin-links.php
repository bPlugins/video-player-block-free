<?php
/**
 * Plugins screen links: Upgrade (when no sale is on) and a bold Dashboard! last in the action links;
 * Docs, Support and a rating link in the row meta under the description.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'plugin_action_links_' . plugin_basename( VPBP_DIR_PATH . 'plugin.php' ), function ( $links ) {
	if ( ! current_user_can( 'manage_options' ) ) {
		return $links;
	}

	// While a sale link is on the row it already is the upgrade offer.
	$on_sale = (bool) preg_grep( '/^bfcm/', array_map( 'strval', array_keys( $links ) ) );
	if ( ! $on_sale ) {
		$links['vpbp-upgrade'] = sprintf(
			'<a href="%s" style="color:#1a7f37;font-weight:600;">%s</a>',
			esc_url( admin_url( \VPBP\Pricing::PRICING_URL ) ),
			esc_html__( 'Upgrade to Pro', 'video-player-block' )
		);
	}

	// Last and bold orange, the same as the Video Gallery Block row.
	$links['vpbp-dashboard'] = sprintf(
		'<a href="%s" target="_blank" rel="noopener" style="font-weight:700;color:#f18500;">%s</a>',
		esc_url( admin_url( 'edit.php?post_type=video-player-block&page=vpbp-help-demo' ) ),
		esc_html__( 'Dashboard!', 'video-player-block' )
	);
	return $links;
}, 30 );

add_filter( 'plugin_row_meta', function ( $meta, $file ) {
	if ( plugin_basename( VPBP_DIR_PATH . 'plugin.php' ) !== $file ) {
		return $meta;
	}

	$link = function ( $url, $label ) {
		return sprintf( '<a href="%s" target="_blank" rel="noopener noreferrer">%s</a>', esc_url( $url ), esc_html( $label ) );
	};

	$meta[] = $link( 'https://bplugins.com/docs/video-player-block/', __( 'Docs', 'video-player-block' ) );
	$meta[] = $link( 'https://wordpress.org/support/plugin/video-player-block/', __( 'Support', 'video-player-block' ) );
	$meta[] = $link( 'https://wordpress.org/support/plugin/video-player-block/reviews/#new-post', __( 'Rate ★★★★★', 'video-player-block' ) );
	return $meta;
}, 10, 2 );
