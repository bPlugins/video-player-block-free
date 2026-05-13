<?php

if (!defined('ABSPATH')) exit;

if( !class_exists( 'VPBP_VideoPlayer' ) ){
    class VPBP_VideoPlayer{
        function __construct(){
            $this -> loaded_classes();
        }
        function loaded_classes(){
			require_once VPBP_DIR_PATH . 'includes/rootPlugin/inc/Init.php';
			require_once VPBP_DIR_PATH . 'includes/rootPlugin/inc/Enqueue.php';
			require_once VPBP_DIR_PATH . 'includes/rootPlugin/inc/AdminMenu.php';
			require_once VPBP_DIR_PATH . 'includes/rootPlugin/inc/ShortCode.php';
			require_once VPBP_DIR_PATH . 'includes/rootPlugin/inc/CustomColumn.php';
			require_once VPBP_DIR_PATH . 'includes/class-vpbp-rest-handler.php';

			new VPBP\Init();
			new VPBP\Enqueue();
			new VPBP\AdminMenu();
			new VPBP\ShortCode();
			new VPBP\CustomColumn();
		}
    }
    new VPBP_VideoPlayer();
}