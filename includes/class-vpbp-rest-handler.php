<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class VPBP_REST_Handler {

	public function __construct() {
		add_action( 'wp_ajax_vpbp_disabled_blocks', array( $this, 'handle_disabled_blocks' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'rest_api_init', array( $this, 'register_settings' ) );
		add_action( 'wp_ajax_vpbpSaveUninstallOption', array( $this, 'handle_uninstall_option' ) );
	}

	/**
	 * Handle AJAX for disabling blocks (from Dashboard).
	 */
	public function handle_disabled_blocks() {
		$nonce = isset( $_POST['_wpnonce'] ) ? sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ) ) : null;
		if ( ! wp_verify_nonce( $nonce, 'vpbp_disabled_blocks' ) ) {
			wp_send_json_error( 'Invalid Request' );
		}

		$data = isset( $_POST['data'] ) ? json_decode( wp_unslash( $_POST['data'] ), true ) : null;
		
		if ( is_array( $data ) ) {
			$data = array_map( 'sanitize_text_field', $data );
			update_option( 'vpbpDisabledBlocks', $data );
			wp_send_json_success( $data );
		} else {
			$db_data = get_option( 'vpbpDisabledBlocks', [] );
			wp_send_json_success( $db_data );
		}
	}

	/**
	 * Handle AJAX for saving uninstall data deletion preference.
	 */
	public function handle_uninstall_option() {
		$nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : null;
		if ( ! wp_verify_nonce( $nonce, 'vpbp_activation_nonce' ) ) {
			wp_send_json_error( array( 'message' => __( 'Invalid security token.', 'video-player' ) ) );
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'You do not have permission to perform this action.', 'video-player' ) ) );
		}

		// Support both string 'true' and actual boolean/numeric values
		$enabled = isset( $_POST['enabled'] ) && ( 'true' === $_POST['enabled'] || true === $_POST['enabled'] || 1 == $_POST['enabled'] );
		update_option( 'vpbp_delete_data_on_uninstall', $enabled );

		wp_send_json_success( array(
			'enabled' => $enabled,
			'message' => __( 'Setting saved successfully.', 'video-player' ),
		) );
	}


	/**
	 * Register settings (from RestAPI).
	 */
	public function register_settings() {
		register_setting( 'vpbpUtils', 'vpbpUtils', array(
			'show_in_rest' => array(
				'name'   => 'vpbpUtils',
				'schema' => array( 'type' => 'string' ),
			),
			'type'              => 'string',
			'default'           => wp_json_encode( array( 'nonce' => wp_create_nonce( 'wp_ajax' ) ) ),
			'sanitize_callback' => function ( $val ) {
				$decoded = json_decode( $val, true );
				if ( is_array( $decoded ) ) {
					return wp_json_encode( $decoded ); // Re-encode to ensure it's valid JSON
				}
				return sanitize_text_field( $val );
			},
		) );
	}
}

new VPBP_REST_Handler();
