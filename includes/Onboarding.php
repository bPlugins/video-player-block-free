<?php
/**
 * First-run onboarding tours (Driver.js coach marks).
 *
 * Five contexts, each shown once per user:
 * - "adminmenu":  the main WP Dashboard (sidebar menu orientation)
 * - "editor":     the block editor on a normal post/page (insert → customize
 *                 → publish walkthrough)
 * - "cpt-editor": the Video Player CPT editor (fill the locked block → publish
 *                 a reusable player)
 * - "cpt-list":   the All Video Players list (Add New + copy the shortcode)
 * - "dashboard":  the plugin's Help & Demos admin page (section walkthrough)
 *
 * Dismissal is stored per user + per context (user meta), so every
 * editor/admin gets each tour exactly once, and dismissing one tour (or one
 * user dismissing it) doesn't hide the others.
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class VPBP_Onboarding {

	const CPT = 'video-player-block';

	const USER_META = [
		'adminmenu'  => 'vpbp_onboarding_adminmenu_dismissed',
		'editor'     => 'vpbp_onboarding_dismissed',
		'cpt-editor' => 'vpbp_onboarding_cpteditor_dismissed',
		'cpt-list'   => 'vpbp_onboarding_cptlist_dismissed',
		'dashboard'  => 'vpbp_onboarding_dashboard_dismissed',
	];

	public function __construct() {
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_editor' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin' ] );
		add_action( 'rest_api_init', [ $this, 'register_rest' ] );
	}

	private function should_show( $type ) {
		if ( ! current_user_can( 'edit_posts' ) ) return false;
		return ! get_user_meta( get_current_user_id(), self::USER_META[ $type ], true );
	}

	private function enqueue_assets() {
		$asset_file = VPBP_DIR_PATH . 'build/admin/onboarding.asset.php';
		if ( ! file_exists( $asset_file ) ) return false;
		$asset = include $asset_file;

		wp_enqueue_script(
			'vpbp-onboarding',
			VPBP_DIR_URL . 'build/admin/onboarding.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);
		wp_enqueue_style(
			'vpbp-onboarding',
			VPBP_DIR_URL . 'build/admin/onboarding.css',
			[],
			$asset['version']
		);
		wp_set_script_translations( 'vpbp-onboarding', 'video-player-block', VPBP_DIR_PATH . 'languages' );
		return true;
	}

	/**
	 * Block editor. The Video Player CPT opens the same editor but is locked to
	 * a single video block, so it gets its own (cpt-editor) walkthrough; every
	 * other post type gets the generic editor tour.
	 */
	public function enqueue_editor() {
		$screen  = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		$context = ( $screen && self::CPT === $screen->post_type ) ? 'cpt-editor' : 'editor';

		if ( ! $this->should_show( $context ) ) return;
		if ( ! $this->enqueue_assets() ) return;
		$this->set_context( $context );
	}

	/**
	 * Non-editor admin screens: the main Dashboard (menu orientation), the
	 * All Video Players list (shortcode tour), and the plugin's Help & Demos
	 * page (dashboard tour).
	 */
	public function enqueue_admin( $hook ) {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		if ( 'index.php' === $hook ) {
			$context = 'adminmenu';
		} elseif ( 'video-player-block_page_vpbp-help-demo' === $hook ) {
			$context = 'dashboard';
		} elseif ( 'edit.php' === $hook && $screen && 'edit' === $screen->base && self::CPT === $screen->post_type ) {
			$context = 'cpt-list';
		} else {
			return;
		}

		if ( ! $this->should_show( $context ) ) return;
		if ( ! $this->enqueue_assets() ) return;
		$this->set_context( $context );
	}

	private function set_context( $context ) {
		wp_add_inline_script(
			'vpbp-onboarding',
			'window.vpbpOnboardingContext = ' . wp_json_encode( $context ) . ';',
			'before'
		);
	}

	public function register_rest() {
		register_rest_route( 'vpbp/v1', '/onboarding/dismiss', [
			'methods'             => 'POST',
			'callback'            => function ( $request ) {
				$type = $request->get_param( 'context' );
				if ( ! isset( self::USER_META[ $type ] ) ) $type = 'editor';
				update_user_meta( get_current_user_id(), self::USER_META[ $type ], 1 );
				return rest_ensure_response( [ 'success' => true ] );
			},
			'permission_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
			'args'                => [
				'context' => [
					'type'    => 'string',
					'enum'    => array_keys( self::USER_META ),
					'default' => 'editor',
				],
			],
		] );
	}
}

new VPBP_Onboarding();
