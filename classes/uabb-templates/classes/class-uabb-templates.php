<?php
/**
 * UABB Templates
 *
 * @package UABB Templates
 * @since 1.0.0
 */

if ( ! class_exists( 'UABB_Templates' ) ) :

	/**
	 * UABB_Templates
	 *
	 * @since 1.0.0
	 */
	class UABB_Templates {

		/**
		 * Instance
		 *
		 * @access private
		 * @var object Class Instance.
		 * @since 1.0.0
		 */
		private static $instance;

		/**
		 * Initiator
		 *
		 * @since 1.0.0
		 * @return object initialized object of class.
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self;
			}
			return self::$instance;
		}

		/**
		 * Constructor
		 *
		 * @since 1.0.0
		 */
		public function __construct()
		{
			require_once UABB_TEMPLATES_DIR . 'classes/class-uabb-templates-helper.php';
			require_once UABB_TEMPLATES_DIR . 'classes/class-uabb-templates-shortcode.php';

			// Compatibility.
			require_once UABB_TEMPLATES_DIR . 'classes/compatibility/class-uabb-templates-theme-astra.php';
		}
	}

	/**
	 * Kicking this off by calling 'get_instance()' method
	 */
	UABB_Templates::get_instance();

endif;
