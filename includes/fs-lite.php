<?php
if ( !defined( 'ABSPATH' ) ) { exit; }

 if (!function_exists('vpbp_fs')) {
        function vpbp_fs() {
            global $vpbp_fs;
            if (!isset($vpbp_fs)) {
                require_once VPBP_DIR_PATH . 'vendor/freemius-lite/start.php';
                $vpbp_fs = fs_lite_dynamic_init([
                'id'                  => '20181',
                'slug'                => 'video-player-block',
                '__FILE__'            => VPBP_DIR_PATH . 'plugin.php',
                'premium_slug'        => 'video-player-block-pro',
                'type'                => 'plugin',
                'public_key'          => 'pk_24433ae07b8acef1ebd1c99de9fa5',
                'is_premium'          => false,
                'premium_suffix'      => 'Pro',
                'has_premium_version' => true,
                'has_addons'          => false,
                'has_paid_plans'      => true,
                'is_org_compliant'    => true,
                'menu'                => array(
                    'slug'           => 'edit.php?post_type=video-player-block',
                    'first-path'     => 'edit.php?post_type=video-player-block&page=vpbp-help-demo',
                    'support'        => false,
                ),
                ]);
            }
            return $vpbp_fs;
        }
        vpbp_fs();
        do_action('vpbp_fs_loaded');
    }