<?php
namespace VPBP;
class CustomColumn {
    function __construct() {
        add_filter(
            'manage_video-player-block_posts_columns',
            [$this, 'manageColumns']
        );
        add_action(
            'manage_video-player-block_posts_custom_column',
            [$this, 'manageCustomColumns'],
            10,
            2
        );
    }
    
    function manageColumns($columns) {
        unset($columns['date']);
        $columns['shortcode'] = __('Shortcode', 'video-player');
        $columns['date'] = __('Date', 'video-player');
        return $columns;
    }

    function manageCustomColumns($column_name, $post_id) {
        if ($column_name === 'shortcode') {
            $shortcode = sprintf( '[video_player id=%d]', $post_id );
            printf(
                '<div class="bPlAdminShortcode" id="bPlAdminShortcode-%s">
                    <input value="%s" onclick="copyBPlAdminShortcode(\'%s\')" readonly>
                    <span class="tooltip">%s</span>
                </div>',
                esc_attr( $post_id ),
                esc_attr( $shortcode ),
                esc_js( $post_id ),
                esc_html__( 'Copy To Clipboard', 'video-player' )
            );
        }
    }
}