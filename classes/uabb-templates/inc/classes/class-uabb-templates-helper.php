<?php
/**
 * UABB_Templates_Helper
 *
 * @package UABB Templates
 * @since 1.0.0
 */

if ( ! class_exists( 'UABB_Templates_Helper' ) ) :

	/**
	 * UABB_Templates_Helper
	 *
	 * @since 1.0.0
	 */
	class UABB_Templates_Helper {

		/**
		 * Instance
		 *
		 * @var instance Class Instance.
		 * @access private
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
		}

		/**
		 * Get Page Settings.
		 *
		 * @since 1.0.0
		 * @return array Page settings.
		 */
		public static function get_page_settings()
		{
			$settings_defaults = apply_filters( 'uabb_templates_default_settings', array(
				'open-template-in'               => 'tab', // Leave empty to open in iFrame
				'row-par-page'                   => '28', // Sections per page.
				'layout-par-page'                => '9', // Page Layouts per page.
				'no-of-columns'                  => '3',
				'show-count'                     => false,
				'show-search'                    => false,
				'show-all-option-for-types'      => false,
				'show-all-option-for-categories' => true,
				'no-of-visible-items-tags'       => -1, // Show the no. of items in <ul> and rest in <select>. Add negative number to show all.
				'no-of-visible-items-categories' => 10, // Show the no. of items in <ul> and rest in <select>.
			));

			// Stored Settings.
			$settings = get_option( 'uabb-templates-settings', $settings_defaults );
			$settings = wp_parse_args( $settings, $settings_defaults );

			return $settings;
		}

		/**
		 * Get Page Setting.
		 *
		 * @since 1.0.0
		 *
		 * @param  string $key     Option key.
		 * @param  string $default Option default value.
		 * @return mixed Page setting.
		 */
		public static function get_page_setting( $key = '', $default = '' ) {

			$settings = self::get_page_settings();

			if ( array_key_exists( $key, $settings ) ) {
				return $settings[ $key ];
			}

			return $default;

		}

	}

	/**
	 * Kicking this off by calling 'get_instance()' method
	 */
	UABB_Templates_Helper::get_instance();

endif;
