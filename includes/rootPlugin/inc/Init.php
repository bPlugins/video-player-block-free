<?php
namespace VPBP;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Init {
    function __construct() {
        add_action( 'init', [ $this, 'onInit' ] );
        add_filter( 'block_editor_settings_all', [ $this, 'vpbp_dynamic_template_lock' ], 10, 2 );
    }
    function onInit() {
		$this->vpbp_register_blocks();
		register_post_type('video-player-block', [
			'label' => __('Video Player', 'video-player-block'),
			'labels' => [
				'name'                  => __('Video Player', 'video-player-block'),
				'singular_name'         => __('Video Player', 'video-player-block'),
				'add_new'               => __('Add New', 'video-player-block'),
				'add_new_item'          => __('Add New Video Player', 'video-player-block'),
				'edit_item'             => __('Edit Video Player', 'video-player-block'),
				'new_item'              => __('New Video Player', 'video-player-block'),
				'view_item'             => __('View Video Player', 'video-player-block'),
				'view_items'            => __('View Video Players', 'video-player-block'),
				'search_items'          => __('Search Video Players', 'video-player-block'),
				'not_found'             => __('No Video Player found.', 'video-player-block'),
				'not_found_in_trash'    => __('No Video Player found in Trash.', 'video-player-block'),
				'all_items'             => __('All Video Players', 'video-player-block'),
				'archives'              => __('Video Player Archives', 'video-player-block'),
				'item_published'        => __('Video Player Published', 'video-player-block'),
				'item_updated'          => __('Video Player Updated', 'video-player-block'),
			],
            'show_in_rest' => true,
            'public' => true,
			'menu_icon' => 'dashicons-controls-play',
            'publicly_queryable' => false,
            'template' => [['vpb/video']],
            'template_lock' => 'all',
        ]);

	}

	function vpbp_register_blocks() {
        $blocks_path = VPBP_DIR_PATH . '/build/blocks/';
        $all_blocks  = glob( $blocks_path . '*', GLOB_ONLYDIR );

        if ( empty( $all_blocks ) ) {
            return;
        }

        foreach ( $all_blocks as $block_path ) {
			register_block_type( $block_path );
        }
    }

     /**
     * Dynamically lock the block editor once a video gallery layout has been selected.
     */
    function vpbp_dynamic_template_lock( $settings, $context ) {
        if ( ! empty( $context->post ) && $context->post->post_type === 'video-player-block' ) {
            $settings['templateLock'] = 'all'; 
        }
        return $settings;
    }
}