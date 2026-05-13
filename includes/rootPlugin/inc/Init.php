<?php
namespace VPBP;

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Init {
    function __construct() {
        add_action( 'init', [ $this, 'onInit' ] );
        add_filter( 'block_editor_settings_all', [ $this, 'vpbp_dynamic_template_lock' ], 10, 2 );
    }
    function onInit() {
		load_plugin_textdomain( 'video-player', false, dirname( plugin_basename( VPBP_DIR_PATH . 'plugin.php' ) ) . '/languages' );
		register_setting(
			'vpbpPluginSettings',
			'vpbpAPIKey',
			[
				'default'		=> '',
				'show_in_rest'	=> true,
				'type'			=> 'string',
				'sanitize_callback' => 'sanitize_text_field'
			]
		);
		$this->vpbp_register_blocks();
		register_post_type('video-player-block', [
			'label' => __('Video Player', 'video-player'),
			'labels' => [
				'name'                  => __('Video Player', 'video-player'),
				'singular_name'         => __('Video Player', 'video-player'),
				'add_new'               => __('Add New', 'video-player'),
				'add_new_item'          => __('Add New Video Player', 'video-player'),
				'edit_item'             => __('Edit Video Player', 'video-player'),
				'new_item'              => __('New Video Player', 'video-player'),
				'view_item'             => __('View Video Player', 'video-player'),
				'view_items'            => __('View Video Players', 'video-player'),
				'search_items'          => __('Search Video Players', 'video-player'),
				'not_found'             => __('No Video Player found.', 'video-player'),
				'not_found_in_trash'    => __('No Video Player found in Trash.', 'video-player'),
				'all_items'             => __('All Video Players', 'video-player'),
				'archives'              => __('Video Player Archives', 'video-player'),
			],
            'show_in_rest' => true,
            'public' => true,
			'menu_icon' => 'dashicons-controls-play',
            'publicly_queryable' => false,
            'item_published' => 'Video Player Published',
            'item_updated' => 'Video Player Updated',
            'template' => [['vpbp/video-player-block']],
            'template_lock' => 'all',
        ]);

		wp_set_script_translations( 'vpbp-video-player-block-editor-script', 'video-player', VPBP_DIR_PATH . 'languages' );
	}

	function vpbp_register_blocks() {
        $blocks_path = VPBP_DIR_PATH . '/build/blocks/';
        $all_blocks  = glob( $blocks_path . '*', GLOB_ONLYDIR );

        if ( empty( $all_blocks ) ) {
            return;
        }

        $disabled_blocks = get_option( 'vpbpDisabledBlocks', [] );
        if ( ! is_array( $disabled_blocks ) ) {
            $disabled_blocks = [];
        }

        foreach ( $all_blocks as $block_path ) {
            $block_name = basename( $block_path );

            if ( $block_name === 'video-player-block' ) {
                register_block_type( $block_path );
                continue;
            }

            $full_block_name = 'vpbp/' . $block_name;

            if ( in_array( $full_block_name, $disabled_blocks, true ) ) {
                continue;
            }

			register_block_type( $block_path );
        }
    }

    /**
     * Dynamically lock the block editor once a video gallery layout has been selected.
     * This allows the initial selection block to replace itself, but prevents further
     * modifications once the layout is set.
     */
    function vpbp_dynamic_template_lock( $settings, $context ) {
        if ( ! empty( $context->post ) && $context->post->post_type === 'video-player-block' ) {
            $settings['templateLock'] = 'all'; 
        }
        return $settings;
    }
}