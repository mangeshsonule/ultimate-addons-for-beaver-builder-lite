<?php
/**
 * UABB Templates Shortcode
 *
 * @package UABB Templates
 * @since 1.0.0
 */

if ( ! class_exists( 'UABB_Templates_Shortcode' ) ) :

	/**
	 * UABB_Templates_Shortcode
	 *
	 * @since 1.0.0
	 */
	class UABB_Templates_Shortcode {

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
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
			add_shortcode( 'uabb-templates', array( $this, 'page_templates' ) );
		}

		/**
		 * Enqueue Assets.
		 *
		 * @version 1.0.0
		 * @return void
		 */
		function enqueue_assets() {

			// History.js for Sharable URL.
			wp_register_script( 'uabb-templates-history', UABB_TEMPLATES_URI . 'assets/vendor/js/jquery-history.js', array( 'jquery' ), UABB_TEMPLATES_VER, true );

			// Lazyload & Image Loaded.
			wp_register_script( 'uabb-templates-lazyload', UABB_TEMPLATES_URI . 'assets/vendor/js/jquery.lazy.min.js', array( 'jquery' ), UABB_TEMPLATES_VER, true );

			// API.
			wp_register_script( 'uabb-templates-api', UABB_TEMPLATES_URI . 'assets/js/uabb-templates-api.js', array( 'jquery' ), UABB_TEMPLATES_VER, true );
			wp_register_script( 'uabb-templates-shortcode', UABB_TEMPLATES_URI . 'assets/js/shortcode.js', array( 'wp-util', 'uabb-templates-api', 'imagesloaded', 'jquery', 'jquery-masonry', 'uabb-templates-lazyload', 'uabb-templates-history' ), UABB_TEMPLATES_VER, true );

			$data = array(
				'ApiURL'  => UABB_TEMPLATES_API,
				'filters' => array(
					'page_builder' => array(
						'title'   => __( 'Page Builder', 'uabb-templates' ),
						'slug'    => 'uabb-template-type',
						'trigger' => 'astra-api-category-loaded',
					),
					'categories'   => array(
						'title'   => __( 'Categories', 'uabb-templates' ),
						'slug'    => 'uabb-template-category',
						'trigger' => 'astra-api-category-loaded',
					),
				),
			);
			wp_localize_script( 'uabb-templates-api', 'UABBTemplatesApi', $data );

			$settings = UABB_Templates_Helper::get_page_settings();

			$data = array(
				'showSitesOn' => apply_filters( 'astra_sites_showcase_show_sites_on', 'click' ),
				'apiEndpoint' => UABB_TEMPLATES_API,
				'apiDomain'   => UABB_TEMPLATES_API_DOMAIN,
				'ajaxurl'     => esc_url( admin_url( 'admin-ajax.php' ) ),
				'settings'    => $settings,
				'strings'     => array(
					'selectSite'           => __( '- Select Site -', 'uabb-templates' ),
					'loadingTitle'         => __( 'Loading...', 'uabb-templates' ),
					'rowLoadingMessage'    => __( 'Section is loading please wait for a moment.', 'uabb-templates' ),
					'layoutLoadingMessage' => __( 'Templates is loading please wait for a moment.', 'uabb-templates' ),
				),
			);

			wp_localize_script( 'uabb-templates-shortcode', 'astraSitesShowcase', $data );

			// Styles.
			wp_register_style( 'uabb-templates-shortcode', UABB_TEMPLATES_URI . 'assets/css/shortcode.css', null, UABB_TEMPLATES_VER, 'all' );
			wp_register_style( 'uabb-templates-grid', UABB_TEMPLATES_URI . 'assets/css/grid.css', null, UABB_TEMPLATES_VER, 'all' );

			$custom_css = '
                .spinner {
                    background-image: url(' . site_url() . '/wp-includes/images/spinner.gif);
                }
            ';

			wp_add_inline_style( 'uabb-templates-shortcode', $custom_css );

		}

		/**
		 * Shortcode
		 *
		 * @since 1.0.0
		 * @return mixed    Shortcode markup.
		 */
		function page_templates() {

			// Enqueue assets.
			wp_enqueue_script( 'uabb-templates-shortcode' );
			wp_enqueue_style( 'uabb-templates-shortcode' );
			wp_enqueue_style( 'uabb-templates-grid' );

			// Add thickbox.
			add_thickbox();

			// Stored Settings.
			$settings = UABB_Templates_Helper::get_page_settings();

			$row_class = apply_filters( 'astra_sites_showcase_row_class', 'uabb-templates-row' );
			$classes   = apply_filters(
				'astra_sites_showcase_column_classes', array(
					'1' => 'uabb-templates-col-md-12',
					'2' => 'uabb-templates-col-md-6',
					'3' => 'uabb-templates-col-md-4',
					'4' => 'uabb-templates-col-md-3',
				)
			);

			$column_class = 'uabb-templates-col-md-3';
			if ( isset( $classes[ $settings['no-of-columns'] ] ) ) {
				$column_class = $classes[ $settings['no-of-columns'] ];
			}

			ob_start();
			require_once UABB_TEMPLATES_DIR . 'includes/shortcode.php';
			return ob_get_clean();

		}

	}

	/**
	 * Kicking this off by calling 'get_instance()' method
	 */
	UABB_Templates_Shortcode::get_instance();

endif;
