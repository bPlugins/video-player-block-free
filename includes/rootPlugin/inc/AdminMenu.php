<?php
namespace VPBP;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class AdminMenu  {
    function __construct() {
        add_action('admin_menu', [$this, 'adminMenu']);
        add_action('admin_head', [$this, 'highlightHelpDemoMenu']);
    }
    /**
     * Color the "Help & Demos" submenu link so it stands out in the sidebar, the same
     * treatment Image Gallery and Testimonials Block give theirs. One inline <style>
     * since the sidebar persists across every admin screen.
     */
    function highlightHelpDemoMenu() { ?>
        <style>
            #adminmenu a[href*="page=vpbp-help-demo"],
            #adminmenu a[href*="page=vpbp-help-demo"] *,
            #adminmenu a[href*="page=vpbp-help-demo"]:hover,
            #adminmenu a[href*="page=vpbp-help-demo"]:hover *,
            #adminmenu a[href*="page=vpbp-help-demo"]:focus,
            #adminmenu a[href*="page=vpbp-help-demo"]:focus *,
            #adminmenu li.current a[href*="page=vpbp-help-demo"],
            #adminmenu li.current a[href*="page=vpbp-help-demo"] * {
                color: #f18500 !important;
            }
        </style>
    <?php }

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
                    'version'              => VPBP_PLUGIN_VERSION,
                    'adminUrl'             => admin_url(),
                    'nonce'                => wp_create_nonce('vpbp_save_uninstall_option'),
                    'uninstallNonce'       => wp_create_nonce('vpbp_save_uninstall_option'),
                    'deleteDataOnUninstall' => get_option('vpbp_delete_data_on_uninstall', false),
                ] ) ); ?>'
            ></div>
        <?php
    }
}