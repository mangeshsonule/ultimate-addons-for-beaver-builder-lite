<?php
/**
 * UABB Cloud Templates
 *
 * @package UABB
 * @since 1.2.0.2
 */

if( ! class_exists( 'UABB_Cloud_Templates' ) ) :

	/**
	 * UABB_Cloud_Templates
	 *
	 * @since 1.2.0.2
	 */
	class UABB_Cloud_Templates {

		/**
		 * Instance
		 *
		 * @since 1.2.0.2
		 *
		 * @access private
		 * @var object Class object.
		 */
		private static $instance;

		/**
		 * File system object.
		 *
		 * @since 1.2.0.2
		 *
		 * @access protected
		 * @var object File system object.
		 */
		protected static $uabb_filesystem = null;

		/**
		 * Initiator
		 *
		 * @since 1.2.0.2
		 *
		 * @return object initialized object of class.
		 */
		public static function get_instance(){
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self;
			}
			return self::$instance;
		}

		/**
		 * Constructor
		 *
		 * @since 1.2.0.2
		 */
		public function __construct()
		{
			// Filters & Hooks
			
			add_filter( 'uabb_templates_localize_vars', 		array( $this, 'localize_vars' ) );
			add_filter( 'uabb_templates_default_settings', 		array( $this, 'uabb_templates_settings' ) );
			add_action( 'admin_enqueue_scripts', 				array( $this, 'styles_scripts' ) );
		}

		function localize_vars( $defaults )
		{
			$defaults['showSitesOn'] = 'scroll';

			return $defaults;
		}

		function uabb_templates_settings( $defaults )
		{
			$defaults['row-par-page']                   = 28;
			$defaults['layout-par-page']                = 12;
			$defaults['show-count']                     = true;
			$defaults['open-template-in']               = 'iframe';
			$defaults['no-of-visible-items-categories'] = 8; // Show the no. of items in <ul> and rest in <select>. Add negative number to show all.

			return $defaults;
		}

		function styles_scripts( $hook )
		{
			wp_register_style( 'uabb-templates', BB_ULTIMATE_ADDON_URL . 'assets/css/uabb-templates.css', array() );
			wp_register_script( 'uabb-templates', BB_ULTIMATE_ADDON_URL . 'assets/js/uabb-templates.js', array( 'jquery' ), BB_ULTIMATE_ADDON_LITE_VERSION, true );

			if( 'settings_page_uabb-builder-settings' == $hook || 'settings_page_uabb-builder-multisite-settings' == $hook )
			{
				wp_enqueue_style( 'uabb-templates' );
				wp_enqueue_script( 'uabb-templates' );
			}
		}

	}

	/**
	 * Initialize class object with 'get_instance()' method
	 */
	UABB_Cloud_Templates::get_instance();

endif;