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
			define( 'UABB_TEMPLATES_API_DOMAIN', apply_filters( 'uabb_templates_api_domain', 'https://templates.ultimatebeaver.com/' ) );
			define( 'UABB_TEMPLATES_API', UABB_TEMPLATES_API_DOMAIN . 'wp-json/wp/v2/' );
			define( 'UABB_TEMPLATES_VER', '1.0.0' );
			define( 'UABB_TEMPLATES_FILE', BB_ULTIMATE_ADDON_FILE );
			define( 'UABB_TEMPLATES_BASE', plugin_basename( BB_ULTIMATE_ADDON_FILE ) );
			define( 'UABB_TEMPLATES_DIR', BB_ULTIMATE_ADDON_DIR . 'classes/uabb-templates/inc/' );
			define( 'UABB_TEMPLATES_URI', BB_ULTIMATE_ADDON_URL . 'classes/uabb-templates/inc/' );

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
