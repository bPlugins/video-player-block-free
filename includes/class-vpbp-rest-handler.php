<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class VPBP_REST_Handler {

	public function __construct() {
		// Logged-in users only; no nopriv equivalent needed.
		add_action( 'wp_ajax_vpbpSaveUninstallOption', array( $this, 'handle_uninstall_option' ) );
	}

	/**
	 * Handle AJAX for saving uninstall data deletion preference.
	 */
	public function handle_uninstall_option() {
		$nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : null;
		if ( ! wp_verify_nonce( $nonce, 'vpbp_save_uninstall_option' ) ) {
			wp_send_json_error( array( 'message' => __( 'Invalid security token.', 'video-player-block' ) ), 403 );
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'You do not have permission to perform this action.', 'video-player-block' ) ), 403 );
		}

		// Support both string 'true' and actual boolean/numeric values.
		$raw_enabled = isset( $_POST['enabled'] ) ? sanitize_text_field( wp_unslash( $_POST['enabled'] ) ) : '';
		$enabled     = ( 'true' === $raw_enabled || '1' === $raw_enabled );
		update_option( 'vpbp_delete_data_on_uninstall', $enabled );

		wp_send_json_success( array(
			'enabled' => $enabled,
			'message' => __( 'Setting saved successfully.', 'video-player-block' ),
		) );
	}
}

// Defer instantiation until all plugins are loaded.
add_action( 'plugins_loaded', function() {
	new VPBP_REST_Handler();
} );