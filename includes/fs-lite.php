<?php
if ( !defined( 'ABSPATH' ) ) { exit; }

 if (!function_exists('vpb_fs')) {
        function vpb_fs() {
            global $vpb_fs;
            if (!isset($vpb_fs)) {
                require_once VPBP_DIR_PATH . 'vendor/freemius-lite/start.php';
                $vpb_fs = fs_lite_dynamic_init([
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
            return $vpb_fs;
        }
        vpb_fs();
        do_action('vpb_fs_loaded');
    }