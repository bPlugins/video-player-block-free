<?php
namespace VPBP;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class AdminMenu  {
    function __construct() {
        add_action('admin_menu', [$this, 'adminMenu']);
    }
    function adminMenu(){
        add_submenu_page(
            'edit.php?post_type=video-player-block',
            __('Help - bPlugins', 'video-player-block'),
            __('Help & Demos', 'video-player-block'),
            'manage_options',
            'vpbp-help-demo',
            [$this, 'renderDashboardPage']
        );
    }

    function renderDashboardPage(){
        ?>
            <div
                id='vpbpDashboard'
                data-info='<?php echo esc_attr( wp_json_encode( [
                    'version' => VPBP_PLUGIN_VERSION,
                    'adminUrl' => admin_url(), 
                    'nonce' => wp_create_nonce('vpbp_activation_nonce'),
                    'disabledBlocksNonce' => wp_create_nonce('vpbp_disabled_blocks'),
                    'vpbpDisabledBlocks' => get_option('vpbpDisabledBlocks', []),
                    'uninstallNonce' => wp_create_nonce('vpbp_activation_nonce'),
                    'deleteDataOnUninstall' => get_option('vpbp_delete_data_on_uninstall', false)                
                ] ) ); ?>'
            ></div>
        <?php
    }
}