<?php
/**
 * Astra Theme Compatibility
 *
 * @package UABB Templates
 * @since 1.0.0
 */

if ( ! class_exists( 'UABB_Templates_Theme_Astra' ) ) :

	/**
	 * UABB_Templates_Theme_Astra
	 *
	 * @since 1.0.0
	 */
	class UABB_Templates_Theme_Astra {

		/**
		 * Instance
		 *
		 * @access private
		 * @var object Class object.
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
		public function __construct() {

			add_action( 'after_setup_theme', array( $this, 'theme_setup' ) );

		}

		/**
		 * Theme Setup
		 *
		 * @since 1.0.0
		 *
		 * @return void
		 */
		function theme_setup()
		{
			$theme = wp_get_theme();
			if ( 'astra' === $theme->get( 'TextDomain' ) ) {
				add_filter( 'astra_sites_showcase_row_class', array( $this, 'row_class' ) );
				add_filter( 'astra_sites_showcase_column_classes', array( $this, 'column_classes' ) );
				add_action( 'wp_enqueue_scripts', array( $this, 'scripts' ) );
			}

		}

		/**
		 * Row Class
		 *
		 * @since 1.0.0
		 *
		 * @return string Row class.
		 */
		function row_class() {
			return 'ast-row uabb-templates-row';
		}

		/**
		 * Column Class
		 *
		 * @since 1.0.0
		 *
		 * @return string Column class.
		 */
		function column_classes()
		{
			return array(
				'1' => 'ast-col-md-12 uabb-templates-col-md-12',
				'2' => 'ast-col-md-6 uabb-templates-col-md-6',
				'3' => 'ast-col-md-4 uabb-templates-col-md-4',
				'4' => 'ast-col-md-3 uabb-templates-col-md-3',
			);

		}

		/**
		 * De-register
		 *
		 * @since 1.0.0
		 *
		 * @return void
		 */
		function scripts() {
			wp_deregister_style( 'uabb-templates-grid' );
		}

	}

	/**
	 * Kicking this off by calling 'get_instance()' method
	 */
	UABB_Templates_Theme_Astra::get_instance();

endif;
