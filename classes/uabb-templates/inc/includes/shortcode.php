<?php
/**
 * Shortcode Markup
 *
 * @package UABB Templates
 * @since 1.0.0
 */

?>
<div id="uabb-templates-wrap">

	<div id="uabb-templates-filters" class="wp-filter hide-if-no-js">

		<!-- All Filters -->
		<div class="filters-wrap">
			<div id="uabb-template-type"></div>
			<div id="uabb-template-category" style="display: none;"></div>
			<div id="uabb-template-tag" style="display: none;"></div>
		</div>

	</div>

	<!-- All UABB Templates -->
	<div id="uabb-templates" class="uabb-templates-grid uabb-templates <?php echo esc_attr( $row_class ); ?>"></div><!-- #uabb-templates -->

</div><!-- #uabb-templates -->


<script type="text/template" id="tmpl-uabb-templates-spinner">
	<span class="spinner is-active"></span>
</script>

<script type="text/template" id="tmpl-uabb-templates-load-more-sites">
	<span class="uabb-templates-load-more-sites button"><?php _e( 'Load More', 'uabb' ); ?></span>
</script>

<script type="text/template" id="tmpl-uabb-templates-no-more-demos">
	<span class="no-more-demos">
		<p><?php _e( 'Stay tuned! More awesome templates coming real soon.', 'uabb' ); ?></p>
	</span>
</script>

<script type="text/template" id="tmpl-uabb-templates-count">
	<div class="filter-count">
		<span class="count"></span>
	</div>
</script>

<script type="text/template" id="tmpl-uabb-templates-search">
	<div class="search-form">
		<label class="screen-reader-text" for="wp-filter-search-input"><?php _e( 'Search Sites', 'uabb' ); ?> </label>
		<input placeholder="<?php _e( 'Search Sites...', 'uabb' ); ?>" type="search" aria-describedby="live-search-desc" id="wp-filter-search-input" class="wp-filter-search">
	</div>
</script>

<script type="text/template" id="tmpl-uabb-templates-responsive-view">
	<span class="responsive-view">
		<# if( data ) { #>
			<a href="{{data}}" class="preview-in-new-window" target="_blank">
				<i class="dashicons dashicons-external"></i>
			</a>
		<# } #>
		<span class="actions">
			<a class="desktop" href="#"><span data-view="desktop " class="active dashicons dashicons-desktop"></span></a>
			<a class="tablet" href="#"><span data-view="tablet" class="dashicons dashicons-tablet"></span></a>
			<a class="mobile" href="#"><span data-view="mobile" class="dashicons dashicons-smartphone"></span></a>
		</span>
	</span>
</script>
<script type="text/template" id="tmpl-uabb-templates-filters">

	<# if ( data ) { #>

		<div class="inner">
			
			<# if( data.args.no_of_visible_items && 1 <= parseInt( data.args.no_of_visible_items ) ) { #>
				
				<# var no_of_visible_items = parseInt( data.args.no_of_visible_items ); #>

				<ul class="{{ data.args.wrapper_class }} {{ data.args.class }}">

					<# if ( data.args.show_all ) { #>
						<li>
							<a href="#" data-group="all" data-slug="all"> <?php _e( 'All', 'uabb' ); ?> </a>
						</li>
					<# } #>

					<# for ( key in data.items ) { #>
						<# if ( data.items[ key ].count ) { #>
			
							<# var classes = ''; #>
							<# if ( data.items[ key ]['uabb-template-type'] ) { #>
							<# classes = data.items[ key ]['uabb-template-type'].join(" "); #>
							<# } #>

							<# if( key < no_of_visible_items ) { #>
								<li>
									<a href="#" data-uabb-unique-beaver-builder-id='{{ data.items[ key ]['uabb-unique-beaver-builder-id'] }}' data-group='{{ data.items[ key ].id }}' class="{{ classes }} {{ data.items[ key ].slug }}" data-slug="{{ data.items[ key ].slug }}">
										{{ data.items[ key ].name }}
									</a>
								</li>
							<# } #>

						<# } #>
					<# } #>

				</ul>

				<# if( data.items_count > no_of_visible_items ) { #>

					<select class="{{ data.args.class }}">
						<option value=""><?php _e( 'Other', 'uabb' ); ?></option>
						<# for ( key in data.items ) { #>
							<# if ( data.items[ key ].count ) { #>
								<# if( key >= no_of_visible_items ) { #>

									<# var classes = ''; #>
									<# if ( data.items[ key ]['uabb-template-type'] ) { #>
									<# classes = data.items[ key ]['uabb-template-type'].join(" "); #>
									<# } #>

									<option value='{{ data.items[ key ].id }}' data-uabb-unique-beaver-builder-id='{{ data.items[ key ]['uabb-unique-beaver-builder-id'] }}' data-group='{{ data.items[ key ].id }}' class="{{ classes }} {{ data.items[ key ].slug }}" data-slug="{{ data.items[ key ].slug }}">{{ data.items[ key ].name }}</option>
								<# } #>
							<# } #>

						<# } #>
					</select>

				<# } #>

			<# } else { #>

				<ul class="{{ data.args.wrapper_class }} {{ data.args.class }}">

					<# if ( data.args.show_all ) { #>
						<li>
							<a href="#" data-group="all" data-slug="all"> <?php _e( 'All', 'uabb' ); ?> </a>
						</li>
					<# } #>

					<# for ( key in data.items ) { #>
						<# if ( data.items[ key ].count ) { #>
			
							<# var classes = ''; #>
							<# if ( data.items[ key ]['uabb-template-type'] ) { #>
							<# classes = data.items[ key ]['uabb-template-type'].join(" "); #>
							<# } #>

							<li>
								<a href="#" data-uabb-unique-beaver-builder-id='{{ data.items[ key ]['uabb-unique-beaver-builder-id'] }}' data-group='{{ data.items[ key ].id }}' class="{{ classes }} {{ data.items[ key ].slug }}" data-slug="{{ data.items[ key ].slug }}">
									{{ data.items[ key ].name }}
								</a>
							</li>

						<# } #>
					<# } #>

				</ul>
				
			<# } #>

		</div>

	<# } #>

</script>

<script type="text/template" id="tmpl-uabb-templates-list">

	<# if ( data.items.length ) { #>
		<# for ( key in data.items ) { #>

			<# var template_type_classes = ''; #>
			<# if ( data.items[ key ]['uabb-template-type'] ) { #>
				<# for ( template_type_index in data.items[ key ]['uabb-template-type'] ) { #>
					<# var template_type_id   = data.items[ key ]['uabb-template-type'][ template_type_index ]; #>
					<# var template_type_slug = jQuery( '.filter-links.uabb-template-type' ).find( 'a[data-group="'+template_type_id+'"]' ).data('slug') || ''; #>
					<# template_type_classes = template_type_classes + ' uabb-template-type-' + template_type_slug; #>
				<# } #>
			<# } #>
			<div id="{{ data.items[ key ]['uabb-unique-beaver-builder-id'] }}" data-uabb-template-id="{{ data.items[ key ].id }}" data-uabb-template-type="{{ template_type_slug }}" class="{{ template_type_classes }} site-single <?php echo esc_attr( $column_class ); ?>" data-groups=["{{ data.items[ key ].tags }}"]>

				<div class="inner">

					<# if( 'tab' === data.args.open_in ) { #>
						<a class="site-preview" target="_blank" data-open-in="{{ data.args.open_in }}" href="{{ data.items[ key ]['uabb-template-url'] }}" data-title="{{ data.items[ key ].title.rendered }}">
					<# } else { #>
						<span class="site-preview" data-open-in="{{ data.args.open_in }}" data-href="{{ data.items[ key ]['uabb-template-url'] }}TB_iframe=true&width=600&height=550" data-title="{{ data.items[ key ].title.rendered }}">
					<# } #>

						<# if( '' !== data.items[ key ]['featured-image-url'] ) { #>
							<img src="{{ data.items[ key ]['featured-image-url'] }}" />
								<noscript>
									<img src="{{ data.items[ key ]['featured-image-url'] }}" />
								</noscript>
						<# } #>
						<span class="view-demo-wrap">
							<span class="view-demo"> <?php _e( 'Quick View', 'uabb' ); ?> </span>
						</span>

					<# if( 'tab' === data.args.open_in ) { #>
						</a>
					<# } else { #>
						</span>
					<# } #>

					<div class="template-meta" data-uabb-template-dat-file-url="{{ data.items[ key ]['uabb-template-dat-file-url'] }}">
						<h3>
							{{{ data.items[ key ].title.rendered }}}
							<# if ( data.items[ key ]['uabb-template-type'] ) { #>
								<# if ( 'premium' == data.items[ key ]['uabb-template-type'] ) { #>
									<span class="site-type {{data.items[ key ]['uabb-template-type']}}"><?php _e( 'Agency', 'uabb' ); ?></span>
								<# } else { #>
									<span class="site-type {{data.items[ key ]['uabb-template-type']}}">{{data.items[ key ]['uabb-template-type']}}</span>
								<# } #>
							<# } #>
						</h3>
					</div>

				</div>

			</div>
		<# } #>
	<# } else { #>
		<div class="uabb-templates-not-found">
			<p>
				<?php _e( 'No templates found!', 'uabb' ); ?><br/>
			</p>
		</div>
	<# } #>
</script>

<?php
/**
 * TMPL - Suggestion Box
 */
?>
<script type="text/template" id="tmpl-uabb-templates-suggestions">
	<div class="site-single ast-col-md-4 uabb-templates-suggestions" style="background-image: url('<?php echo esc_url( UABB_TEMPLATES_URI . 'assets/images/suggestion-box.png' ); ?>');">
		<div class="inner">
			<p>
			<?php
			/* translators: %1$s External Link */
			printf( __( '<a target="_blank" href="%1$s">Suggest Your Ideas!</a>', 'uabb' ), esc_url( 'https://wpastra.com/sites-suggestions/?utm_source=demo-import-panel&utm_campaign=uabb-templates&utm_medium=suggestions' ) );
			?>
			</p>
		</div>
	</div>
</script>
