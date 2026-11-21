<?php
/**
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content.
 * @var WP_Block $block      Block instance.
 */

if (!defined('ABSPATH')) {
    exit;
}

$attributes = $attributes ?? [];
// No video yet: render nothing. An empty <video src=""> resolves to the page
// URL, so the browser downloaded the page again and showed a broken player.
if ( '' === trim( (string) ( $attributes['source'] ?? '' ) ) ) {
    return;
}
$id         = wp_unique_id( 'vpbpVideoPlayer-' );

static $vpbp_plyr_sprite_rendered = false;
if ( ! $vpbp_plyr_sprite_rendered ) {
    $vpbp_plyr_sprite_rendered = true;
    $sprite_file = VPBP_DIR_PATH . 'public/images/plyr.svg';
    if ( file_exists( $sprite_file ) ) {
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted local Plyr SVG sprite
        echo '<div id="sprite-plyr" hidden style="display:none">' . file_get_contents( $sprite_file ) . '</div>';
    }
}
?>
<div
    <?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes(); ?>
    id='<?php echo esc_attr( $id ); ?>'
    data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'
></div>