<?php
/**
 * Bundled block patterns.
 *
 * The block arrives from the inserter with no source at all — an empty player
 * on an empty page. These patterns are the sections people actually build with
 * a video player: a hero, a demo beside its copy, a lesson, a customer story,
 * a podcast episode. Insert one, swap the video, done.
 *
 * On the source: every pattern points at the same public sample clip the
 * sibling Video Gallery Block already ships as its own default. Bundling
 * arbitrary third-party videos would be worse — they rot, and they are not
 * ours to feature. The posters, which are what a paused player shows, are
 * drawn inline so a pattern renders instantly and cannot 404.
 *
 * @package video-player-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The public sample clip used by every bundled pattern.
 */
const VPBP_PATTERN_VIDEO = 'https://files.vidstack.io/sprite-fight/720p.mp4';

/**
 * An inline poster: a two-tone diagonal composition, 1280x720.
 *
 * Drawn rather than fetched, so a freshly inserted pattern never waits on a
 * network request and never shows a broken poster.
 *
 * @param string $back  Background colour.
 * @param string $front Foreground colour.
 * @return string Data URI.
 */
function vpbp_pattern_poster( $back, $front ) {
	$svg = '%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'1280\' height=\'720\'%3E'
		. '%3Crect width=\'1280\' height=\'720\' fill=\'' . rawurlencode( $back ) . '\'/%3E'
		. '%3Cpath d=\'M0 720 L560 192 L1280 720 Z\' fill=\'' . rawurlencode( $front ) . '\' opacity=\'0.85\'/%3E'
		. '%3Ccircle cx=\'1012\' cy=\'184\' r=\'88\' fill=\'' . rawurlencode( $front ) . '\' opacity=\'0.45\'/%3E'
		. '%3C/svg%3E';

	/*
	 * The attribute quotes have to be percent-encoded. The player is Plyr, and
	 * Plyr sets the poster as CSS - background-image: url('<uri>') - so a raw
	 * apostrophe anywhere in the URI closes that string early, the whole
	 * declaration is rejected, and the player shows a black frame with no
	 * poster at all.
	 */
	return 'data:image/svg+xml;charset=utf-8,' . str_replace( "'", '%27', $svg );
}

/**
 * Serialise the player block into block markup.
 *
 * The block renders from render.php and saves nothing between its delimiters.
 *
 * @param array $attrs Block attributes.
 * @return string
 */
function vpbp_pattern_block( $attrs ) {
	$attrs = array_merge(
		array( 'source' => VPBP_PATTERN_VIDEO ),
		$attrs
	);

	return '<!-- wp:vpb/video ' . wp_json_encode( $attrs, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . ' /-->';
}

/**
 * The block's control set, with overrides merged in.
 *
 * Spelled out rather than left to the default so each pattern can show the
 * controls that suit it — a lesson wants Restart, a hero wants almost nothing.
 *
 * @param array $overrides Controls to change.
 * @return array
 */
function vpbp_pattern_controls( $overrides = array() ) {
	return array_merge(
		array(
			'play-large'   => true,
			'restart'      => false,
			'rewind'       => true,
			'play'         => true,
			'fast-forward' => true,
			'progress'     => true,
			'current-time' => true,
			'duration'     => false,
			'mute'         => true,
			'volume'       => true,
			'pip'          => false,
			'airplay'      => false,
			'captions'     => false,
			'settings'     => true,
			'download'     => false,
			'fullscreen'   => true,
		),
		$overrides
	);
}

/**
 * A centred core heading.
 *
 * @param string $text  Heading text.
 * @param int    $level Heading level.
 * @param bool   $center Centre it.
 * @return string
 */
function vpbp_pattern_heading( $text, $level = 2, $center = true ) {
	$level = (int) $level;

	if ( ! $center ) {
		return '<!-- wp:heading {"level":' . $level . '} -->'
			. '<h' . $level . ' class="wp-block-heading">' . esc_html( $text ) . '</h' . $level . '>'
			. '<!-- /wp:heading -->';
	}

	return '<!-- wp:heading {"textAlign":"center","level":' . $level . '} -->'
		. '<h' . $level . ' class="wp-block-heading has-text-align-center">' . esc_html( $text ) . '</h' . $level . '>'
		. '<!-- /wp:heading -->';
}

/**
 * A core paragraph.
 *
 * @param string $text   Paragraph text.
 * @param bool   $center Centre it.
 * @return string
 */
function vpbp_pattern_paragraph( $text, $center = true ) {
	if ( ! $center ) {
		return '<!-- wp:paragraph --><p>' . esc_html( $text ) . '</p><!-- /wp:paragraph -->';
	}

	return '<!-- wp:paragraph {"align":"center"} -->'
		. '<p class="has-text-align-center">' . esc_html( $text ) . '</p>'
		. '<!-- /wp:paragraph -->';
}

/**
 * A vertical spacer.
 *
 * @param int $px Height in pixels.
 * @return string
 */
function vpbp_pattern_spacer( $px = 32 ) {
	$px = (int) $px;

	return '<!-- wp:spacer {"height":"' . $px . 'px"} -->'
		. '<div style="height:' . $px . 'px" aria-hidden="true" class="wp-block-spacer"></div>'
		. '<!-- /wp:spacer -->';
}

/**
 * A centred row of core buttons.
 *
 * @param array  $buttons List of labels.
 * @param string $justify flex justification.
 * @return string
 */
function vpbp_pattern_buttons( $buttons, $justify = 'center' ) {
	$markup = '';
	foreach ( $buttons as $i => $label ) {
		$outline = $i > 0 ? ' {"className":"is-style-outline"}' : '';
		$class   = $i > 0 ? 'wp-block-button is-style-outline' : 'wp-block-button';

		$markup .= '<!-- wp:button' . $outline . ' -->'
			. '<div class="' . esc_attr( $class ) . '"><a class="wp-block-button__link wp-element-button">' . esc_html( $label ) . '</a></div>'
			. '<!-- /wp:button -->';
	}

	return '<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"' . esc_attr( $justify ) . '"}} -->'
		. '<div class="wp-block-buttons">' . $markup . '</div>'
		. '<!-- /wp:buttons -->';
}

/**
 * Wrap blocks in a group.
 *
 * @param string $inner Inner block markup.
 * @param string $align full, wide or empty.
 * @return string
 */
function vpbp_pattern_group( $inner, $align = '' ) {
	$attrs   = $align ? '{"align":"' . $align . '","layout":{"type":"constrained"}}' : '{"layout":{"type":"constrained"}}';
	$classes = $align ? 'wp-block-group align' . $align : 'wp-block-group';

	return '<!-- wp:group ' . $attrs . ' -->'
		. '<div class="' . esc_attr( $classes ) . '">' . $inner . '</div>'
		. '<!-- /wp:group -->';
}

/**
 * Two columns.
 *
 * @param string $left  Left column markup.
 * @param string $right Right column markup.
 * @return string
 */
function vpbp_pattern_columns( $left, $right ) {
	return '<!-- wp:columns {"verticalAlignment":"center","align":"wide"} -->'
		. '<div class="wp-block-columns alignwide are-vertically-aligned-center">'
		. '<!-- wp:column {"verticalAlignment":"center","width":"58%"} -->'
		. '<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:58%">' . $left . '</div>'
		. '<!-- /wp:column -->'
		. '<!-- wp:column {"verticalAlignment":"center","width":"42%"} -->'
		. '<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:42%">' . $right . '</div>'
		. '<!-- /wp:column -->'
		. '</div><!-- /wp:columns -->';
}

/**
 * Register the pattern category and the patterns themselves.
 *
 * @return void
 */
function vpbp_register_patterns() {
	if ( ! function_exists( 'register_block_pattern' ) ) {
		return;
	}

	$category = 'video-player-block';

	register_block_pattern_category(
		$category,
		array( 'label' => __( 'Video Players', 'video-player-block' ) )
	);

	$patterns = array();

	/* Video hero --------------------------------------------------------- */
	$patterns['video-hero'] = array(
		'title'       => __( 'Full-width video hero', 'video-player-block' ),
		'description' => __( 'A wide player above the fold with a headline and one call to action, and the controls stripped back to the essentials.', 'video-player-block' ),
		'keywords'    => array( 'hero', 'header', 'landing', 'full width' ),
		'content'     => vpbp_pattern_group(
			vpbp_pattern_heading( __( 'See what two minutes can explain.', 'video-player-block' ), 1 )
			. vpbp_pattern_paragraph( __( 'The whole product, start to finish, without a sales call first.', 'video-player-block' ) )
			. vpbp_pattern_spacer( 24 )
			. vpbp_pattern_block(
				array(
					'poster'      => vpbp_pattern_poster( '#101c2b', '#5B8DEF' ),
					'ratio'       => '16:9',
					'radius'      => '12px',
					'accentColor' => '#5B8DEF',
					'controls'    => vpbp_pattern_controls(
						array(
							'rewind'       => false,
							'fast-forward' => false,
							'settings'     => false,
						)
					),
					'align'       => 'wide',
				)
			)
			. vpbp_pattern_spacer( 24 )
			. vpbp_pattern_buttons( array( __( 'Start free trial', 'video-player-block' ) ) ),
			'wide'
		),
	);

	/* Demo beside its copy ------------------------------------------------ */
	$patterns['demo-with-copy'] = array(
		'title'       => __( 'Product demo beside its copy', 'video-player-block' ),
		'description' => __( 'A two-column section with the player on the left and the explanation, a short list and a button on the right.', 'video-player-block' ),
		'keywords'    => array( 'demo', 'product', 'columns', 'feature' ),
		'content'     => vpbp_pattern_group(
			vpbp_pattern_columns(
				vpbp_pattern_block(
					array(
						'poster'      => vpbp_pattern_poster( '#12242a', '#2BC69C' ),
						'ratio'       => '16:9',
						'radius'      => '10px',
						'accentColor' => '#2BC69C',
					)
				),
				vpbp_pattern_heading( __( 'Built for people who ship', 'video-player-block' ), 2, false )
				. vpbp_pattern_paragraph( __( 'No timeline of meetings before anything appears on the page. Install it, insert a section, publish.', 'video-player-block' ), false )
				. '<!-- wp:list --><ul class="wp-block-list">'
				. '<li>' . esc_html__( 'Works in any block theme', 'video-player-block' ) . '</li>'
				. '<li>' . esc_html__( 'Loads nothing until it is on the page', 'video-player-block' ) . '</li>'
				. '<li>' . esc_html__( 'Keyboard and screen-reader friendly', 'video-player-block' ) . '</li>'
				. '</ul><!-- /wp:list -->'
				. vpbp_pattern_buttons( array( __( 'Read the docs', 'video-player-block' ) ), 'left' )
			),
			'wide'
		),
	);

	/* Lesson ------------------------------------------------------------- */
	$patterns['lesson-embed'] = array(
		'title'       => __( 'Lesson with restart and seek controls', 'video-player-block' ),
		'description' => __( 'A tutorial or course lesson, with Restart, Rewind and Fast-forward switched on so a viewer can go back over a step.', 'video-player-block' ),
		'keywords'    => array( 'lesson', 'course', 'tutorial', 'lms', 'training' ),
		'content'     => vpbp_pattern_group(
			vpbp_pattern_heading( __( 'Lesson 3 — Building your first layout', 'video-player-block' ), 2, false )
			. vpbp_pattern_paragraph( __( 'Nine minutes. By the end you will have a page you can publish.', 'video-player-block' ), false )
			. vpbp_pattern_spacer( 16 )
			. vpbp_pattern_block(
				array(
					'poster'      => vpbp_pattern_poster( '#0f2430', '#3FA9C9' ),
					'ratio'       => '16:9',
					'radius'      => '8px',
					'accentColor' => '#3FA9C9',
					'controls'    => vpbp_pattern_controls(
						array(
							'restart'  => true,
							'duration' => true,
							'captions' => true,
						)
					),
				)
			)
		),
	);

	/* Customer story ------------------------------------------------------ */
	$patterns['customer-story'] = array(
		'title'       => __( 'Customer story with quote', 'video-player-block' ),
		'description' => __( 'A video testimonial with the quote and attribution written out underneath, so the words are readable and indexable without pressing play.', 'video-player-block' ),
		'keywords'    => array( 'testimonial', 'customer', 'story', 'quote', 'social proof' ),
		'content'     => vpbp_pattern_group(
			vpbp_pattern_block(
				array(
					'poster'      => vpbp_pattern_poster( '#2e1a12', '#E8874F' ),
					'ratio'       => '16:9',
					'radius'      => '10px',
					'accentColor' => '#E8874F',
				)
			)
			. vpbp_pattern_spacer( 24 )
			. '<!-- wp:quote --><blockquote class="wp-block-quote">'
			. '<!-- wp:paragraph --><p>' . esc_html__( 'We replaced three plugins with this one, and the pages load faster than they did before.', 'video-player-block' ) . '</p><!-- /wp:paragraph -->'
			. '<cite>' . esc_html__( 'Emily Watson — Head of Operations, Meridian', 'video-player-block' ) . '</cite>'
			. '</blockquote><!-- /wp:quote -->'
		),
	);

	/* Podcast episode ----------------------------------------------------- */
	$patterns['podcast-episode'] = array(
		'title'       => __( 'Podcast episode with show notes', 'video-player-block' ),
		'description' => __( 'A video episode with the title, date and show notes beneath it, and Picture-in-Picture on so a listener can keep it running while they read.', 'video-player-block' ),
		'keywords'    => array( 'podcast', 'episode', 'show notes', 'interview' ),
		'content'     => vpbp_pattern_group(
			vpbp_pattern_heading( __( 'Episode 14 — Shipping on Fridays', 'video-player-block' ), 2, false )
			. vpbp_pattern_paragraph( __( '6 September 2026 · 48 minutes', 'video-player-block' ), false )
			. vpbp_pattern_spacer( 16 )
			. vpbp_pattern_block(
				array(
					'poster'      => vpbp_pattern_poster( '#241f33', '#9B87E0' ),
					'ratio'       => '16:9',
					'radius'      => '8px',
					'accentColor' => '#9B87E0',
					'controls'    => vpbp_pattern_controls(
						array(
							'pip'      => true,
							'duration' => true,
						)
					),
				)
			)
			. vpbp_pattern_spacer( 24 )
			. vpbp_pattern_heading( __( 'In this episode', 'video-player-block' ), 3, false )
			. '<!-- wp:list --><ul class="wp-block-list">'
			. '<li>' . esc_html__( '02:10 — Why the deploy freeze never worked', 'video-player-block' ) . '</li>'
			. '<li>' . esc_html__( '14:45 — What we measure instead', 'video-player-block' ) . '</li>'
			. '<li>' . esc_html__( '31:20 — The rollback that changed our minds', 'video-player-block' ) . '</li>'
			. '</ul><!-- /wp:list -->'
		),
	);

	/*
	 * Pattern search matches title, description and keywords — not the category
	 * label. Someone who has just read "Video Players" in the category list and
	 * types it into the search box would otherwise get nothing back.
	 */
	$base_keywords = array(
		__( 'video', 'video-player-block' ),
		__( 'video player', 'video-player-block' ),
		__( 'video players', 'video-player-block' ),
	);

	foreach ( $patterns as $slug => $pattern ) {
		register_block_pattern(
			'video-player-block/' . $slug,
			array(
				'title'       => $pattern['title'],
				'description' => $pattern['description'],
				'categories'  => array( $category ),
				'keywords'    => array_values( array_unique( array_merge( $base_keywords, $pattern['keywords'] ) ) ),
				'content'     => $pattern['content'],
			)
		);
	}
}

/**
 * Late on init: register_block_pattern() silently drops a pattern whose blocks
 * are not registered yet, and the block registers on init at the default
 * priority.
 */
add_action( 'init', 'vpbp_register_patterns', 20 );
