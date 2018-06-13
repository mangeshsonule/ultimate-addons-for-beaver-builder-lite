
(function($) {

	var _api_categories = {};

	AstraSitesShowcase = {

		_ref			: null,

		/**
		 * _api_params = {
		 * 		'search'                  : '',
		 * 		'per_page'                : '',
		 * 		'uabb-template-category'     : '',
		 * 		'uabb-template-type' : '',
		 * 		'page'                    : '',
		 *   };
		 *
		 * E.g. per_page=<page-id>&uabb-template-category=<category-ids>&uabb-template-type=<template-type-ids>&page=<page>
		 */
		_api_params		: {},
		_breakpoint		: 768,
		_iconUploader	: null,
	
		_api_types      : {},
		_api_tags       : {},
		_api_categories : {},

		init: function()
		{
			this._showLoader();
			this._showSiteOnLoad();
			this._masonry();
			this._resetPagedCount();
			this._bind();
			this._showFilters();
			this._showSiteSearch();
			this._showSiteCount();
		},

		_showLoader: function()
		{
			$('#uabb-templates-wrap').append( wp.template('uabb-templates-spinner') );
		},

		/**
		 * Show Site On Load.
		 *
		 * @since 1.0.2
		 */
		_showSiteOnLoad: function()
		{
			if( AstraSitesShowcase._getParamFromURL('slug') )
			{
				var slug      = AstraSitesShowcase._getParamFromURL('slug');
				var clean_url = astraSitesShowcase.apiDomain;

				// Clean the URL.
				clean_url = clean_url.replace('http:','');
				clean_url = clean_url.replace('https:','');

				var api_params = {
					meta_key   : 'uabb-template-url',
					meta_value : clean_url + slug,
				};

				// API Request.
				var api_url = astraSitesShowcase.apiEndpoint + 'uabb-template?' + decodeURIComponent( $.param( api_params ) );
				$.ajax({
					url   : api_url,
					cache : false
				})
				.done(function( items, status, XHR ) {

					if( 'success' === status && items.length && items[0] ) {
						var site_url = ( 'uabb-template-url' in items[0] ) ? items[0]['uabb-template-url'] + 'TB_iframe=true&width=600&height=550' : '';
						var title    = ( 'title' in items[0] ) ? items[0]['title']['rendered'] : '';
						var rel      = false;

						if( title && site_url ) {
							AstraSitesShowcase._showSingleSite( title, site_url, rel );
						}
					}
				});
			}
		},

		/**
		 * Get URL param.
		 */
		_getParamFromURL: function(name, url)
		{
		    if (!url) url = window.location.href;
		    name = name.replace(/[\[\]]/g, "\\$&");
		    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		        results = regex.exec(url);
		    if (!results) return null;
		    if (!results[2]) return '';
		    return decodeURIComponent(results[2].replace(/\+/g, " "));
		},

		/**
		 * Show Site Search Box.
		 *
		 * @since 1.0.0
		 */
		_showSiteSearch: function() {

			// Show search.
			if( astraSitesShowcase.settings['show-search'] ) {
				var template = wp.template('uabb-templates-search');
				$('#uabb-templates-filters').append(template);
			}
		},

		/**
		 * Show Site Count.
		 *
		 * @since 1.0.0
		 */
		_showSiteCount: function() {

			// Show count.
			if( astraSitesShowcase.settings['show-count'] ) {
				var template = wp.template('uabb-templates-count');
				$('#uabb-templates-filters').prepend(template);
			}

		},
		
		/**
		 * Binds events for the UABB Templates.
		 *
		 * @since 1.0.0
		 * @access private
		 * @method _bind
		 */
		_bind: function()
		{
			$( document ).on('click', '.filter-links.uabb-template-type a', 				AstraSitesShowcase._generateCategories );
			$( window ).on('resize', 									AstraSitesShowcase._resize );

			$( document ).on('uabb-templates-api-request-fail',			AstraSitesShowcase._apiFailed );
			$( document ).on('astra-api-post-loaded-on-scroll',			AstraSitesShowcase._reinitGridScrolled );
			$( document ).on('astra-api-post-loaded', 					AstraSitesShowcase._reinitGrid );
			$( document ).on('astra-api-type-loaded', 				AstraSitesShowcase._addTemplateTypes );
			$( document ).on('astra-api-tag-loaded', 				AstraSitesShowcase._addTemplateTags );
			$( document ).on('astra-api-all-category-loaded', 			AstraSitesShowcase._loadFirstGrid );

			$( document ).on('click', 'span.site-preview', 					AstraSitesShowcase._previewOpen );
			$( document ).on('click', '.actions a', 					AstraSitesShowcase._previewResponsive );
			$( 'body' ).on('thickbox:removed', 							AstraSitesShowcase._previewClose );

			// Event's for API request.
			$( document ).on('keyup input', '#wp-filter-search-input', 	AstraSitesShowcase._search );
			$( document ).on('click', '.filter-links a', 				AstraSitesShowcase._filterClick );
			$( document ).on('change', 'select.uabb-template-category', 				AstraSitesShowcase._changeCategoryDropdown );
			$( document ).on('change', 'select.uabb-template-tag', 				AstraSitesShowcase._changeTagDropdown );

			if( 'click' === astraSitesShowcase.showSitesOn ) {
				$( document ).on('click', '.uabb-templates-load-more-sites', AstraSitesShowcase._next_page );
			} else {
				$( document ).on('scroll', 									AstraSitesShowcase._scroll );
			}
		},

		_generateCategories: function( event )
		{
			event.preventDefault();

			// if( $.isEmptyObject( AstraSitesShowcase._api_categories ) ) {
			// 	return;
			// }

			var link = $( this );
			var slug = link.data('slug') || 'layout';

			if( 'layout' === slug ) 
			{
				$('#uabb-template-tag').show();
				$('#uabb-template-category').hide();
				$('#uabb-template-category .filter-links a').removeClass('active');
				$('#uabb-template-category .filter-links a[data-slug="all"]').addClass('active');
			} else {
				$('#uabb-template-category').show();
				
				$('#uabb-template-tag').hide();
				$('#uabb-template-tag .filter-links a').removeClass('active');
				$('#uabb-template-tag .filter-links a[data-slug="all"]').addClass('active');
			}

			AstraSitesShowcase._regenerateCategories( slug, AstraSitesShowcase._api_categories );
			AstraSitesShowcase._regenerateTags( slug, AstraSitesShowcase._api_tags );

		},

		_regenerateTags: function( slug, api_tags )
		{
			if( $.isEmptyObject( api_tags ) ) {
				return;
			}

			// var newObject = jQuery.extend(true, {}, oldObject);
			// var localTempCategories = jQuery.extend({}, api_tags);
			// var localTempCategories = $.extend(true, {}, api_tags);
			// var localTempCategories = api_tags;
			var localTempCategories = $.extend(true,{}, api_tags);
			// // // console.log( slug );
			// // console.log( 'tags' );
			// // console.log( localTempCategories );
			// // // console.log( api_tags );
			if( localTempCategories.items )
			{
				var type     = slug;
				var newArray = [];

				$.each(localTempCategories.items, function(index, item)
				{
					var allTypes = item['uabb-template-type'] || [];

					// // // console.log( allTypes.includes( type ) );
					if( allTypes.length ) {
						if( allTypes.includes( type ) )
						{
							newArray.push( localTempCategories.items[index] );
						}
					}
				});

				localTempCategories.items       = newArray;
				localTempCategories.items_count = String( newArray.length );
			}

			var data = localTempCategories;

			if( $('#' + data.args.id).length ) {
				var template = wp.template('uabb-templates-filters');
				$('#' + data.args.id).html(template( data )).find('li:first a').addClass('active');

				$( document ).trigger( data.args.id + '-loaded', [ data ] );
			}

			// $('.filter-links.uabb-template-category li').hide();

			// if( $('.filter-links.uabb-template-category').find( '.' + slug ).length )
			// {
			// 	$('.filter-links.uabb-template-category').find( '.' + slug ).parents('li').show();
			// } else {
			// 	// $('.filter-links.uabb-template-category li').show();
			// }
		},

		_regenerateCategories: function( slug, api_categories )
		{
			if( $.isEmptyObject( api_categories ) ) {
				return;
			}

			// var newObject = jQuery.extend(true, {}, oldObject);
			// var localTempCategories = jQuery.extend({}, api_categories);
			// var localTempCategories = $.extend(true, {}, api_categories);
			// var localTempCategories = api_categories;
			var localTempCategories = $.extend(true,{},api_categories);
			// // // console.log( slug );
			// // // console.log( localTempCategories );
			// // // console.log( api_categories );
			if( localTempCategories.items )
			{
				var type     = slug;
				var newArray = [];

				$.each(localTempCategories.items, function(index, item)
				{
					var allTypes = item['uabb-template-type'] || [];

					// // // console.log( allTypes.includes( type ) );
					if( allTypes.length ) {
						if( allTypes.includes( type ) )
						{
							newArray.push( localTempCategories.items[index] );
						}
					}
				});

				localTempCategories.items       = newArray;
				localTempCategories.items_count = String( newArray.length );
			}

			var data = localTempCategories;

			if( $('#' + data.args.id).length ) {
				var template = wp.template('uabb-templates-filters');
				$('#' + data.args.id).html(template( data )).find('li:first a').addClass('active');

				$( document ).trigger( data.args.id + '-loaded', [ data ] );
			}

			// $('.filter-links.uabb-template-category li').hide();

			// if( $('.filter-links.uabb-template-category').find( '.' + slug ).length )
			// {
			// 	$('.filter-links.uabb-template-category').find( '.' + slug ).parents('li').show();
			// } else {
			// 	// $('.filter-links.uabb-template-category li').show();
			// }
		},

		/**
		 * Responsive On Click.
		 */
		_previewResponsive: function( event ) {

			event.preventDefault();

			var icon = $(this).find('.dashicons');

			var viewClass = icon.attr('data-view') || '';

			$('#TB_window').removeClass( 'desktop' );
			$('#TB_window').removeClass( 'tablet' );
			$('#TB_window').removeClass( 'mobile' );
			$('#TB_window').addClass( viewClass );

			$('.actions .dashicons').removeClass('active');
			icon.addClass('active');

			$('#TB_iframeContent').removeClass();
			$('#TB_iframeContent').addClass( viewClass );

		},

		_changeTagDropdown: function( event )
		{
			event.preventDefault();

			$('.filter-links.uabb-template-tag').find('a').removeClass('active');

			// Clean data before process request.
			$('#uabb-templates').css('height', '');
			$('#uabb-templates > div').remove();

			$('body').addClass( 'uabb-templates-loading' );

			if( $('.uabb-templates-not-found').length ) {
				$('.spinner').removeClass('hide-me').addClass('is-active');
				$('.uabb-templates-not-found').remove();	
			} else {
				$('.spinner').removeClass('hide-me'); // addClass('is-active');
			}
			$('#wp-filter-search-input').val('');

			if( $( '#uabb-templates-wrap .no-more-demos').length ) {
				$('#uabb-templates-wrap .no-more-demos').remove();
			}



			/*// Clean data before process request.
			$('#uabb-templates').css('height', '');
			$('#uabb-templates > div').remove();
			$('.no-more-demos').addClass('hide-me');

			$('body').addClass( 'uabb-templates-loading' );

			if( $('.uabb-templates-not-found').length ) {
				// $('.spinner').removeClass('hide-me').addClass('is-active');
				$('.uabb-templates-not-found').remove();	
			} else {
				// $('.spinner').removeClass('hide-me'); // addClass('is-active');
			}
			$('#wp-filter-search-input').val('');
			$('.uabb-template-category').val('');*/

			if( $('#uabb-templates-wrap .spinner').length )
			{
				$('#uabb-templates-wrap .spinner').remove();
			}
			if( $('#uabb-templates-wrap .uabb-templates-load-more-sites').length )
			{
				$('#uabb-templates-wrap .uabb-templates-load-more-sites').remove();
			}
			$('#uabb-templates-wrap').append( wp.template('uabb-templates-spinner') );


	        // Show sites.
			AstraSitesShowcase._showSites();

			if( $('.filters-wrap').length ) {
				
				$('html, body').animate({
					scrollTop: $('.filters-wrap').offset().top - 100
				});

				// Change Category URLs.
				// AstraSitesShowcase._change_category_urls();
			}
		},

		/**
		 * On Filter Change
		 */
		_changeCategoryDropdown: function( event )
		{
			event.preventDefault();
			
			$('.filter-links.uabb-template-category').find('a').removeClass('active');

			// Clean data before process request.
			$('#uabb-templates').css('height', '');
			$('#uabb-templates > div').remove();

			$('body').addClass( 'uabb-templates-loading' );

			if( $('.uabb-templates-not-found').length ) {
				$('.spinner').removeClass('hide-me').addClass('is-active');
				$('.uabb-templates-not-found').remove();	
			} else {
				$('.spinner').removeClass('hide-me'); // addClass('is-active');
			}
			$('#wp-filter-search-input').val('');

			if( $( '#uabb-templates-wrap .no-more-demos').length ) {
				$('#uabb-templates-wrap .no-more-demos').remove();
			}

			/*// Clean data before process request.
			$('#uabb-templates').css('height', '');
			$('#uabb-templates > div').remove();
			$('.no-more-demos').addClass('hide-me');

			$('body').addClass( 'uabb-templates-loading' );

			if( $('.uabb-templates-not-found').length ) {
				// $('.spinner').removeClass('hide-me').addClass('is-active');
				$('.uabb-templates-not-found').remove();	
			} else {
				// $('.spinner').removeClass('hide-me'); // addClass('is-active');
			}
			$('#wp-filter-search-input').val('');
			$('.uabb-template-category').val('');*/

			if( $('#uabb-templates-wrap .spinner').length )
			{
				$('#uabb-templates-wrap .spinner').remove();
			}
			if( $('#uabb-templates-wrap .uabb-templates-load-more-sites').length )
			{
				$('#uabb-templates-wrap .uabb-templates-load-more-sites').remove();
			}
			$('#uabb-templates-wrap').append( wp.template('uabb-templates-spinner') );


	        // Show sites.
			AstraSitesShowcase._showSites();

			if( $('.filters-wrap').length ) {
				
				$('html, body').animate({
					scrollTop: $('.filters-wrap').offset().top - 100
				});

				// Change Category URLs.
				// AstraSitesShowcase._change_category_urls();
			}
		},

		/**
		 * On Filter Clicked
		 */
		_filterClick: function( event )
		{
			event.preventDefault();

			$(this).parents('.filter-links').find('a').removeClass('active');
			$(this).addClass('active');

			AstraSitesShowcase._cleanTheMarkup();

	        // Show sites.
			AstraSitesShowcase._showSites();

			if( $('.filters-wrap').length ) {
				
				$('html, body').animate({
					scrollTop: $('.filters-wrap').offset().top - 100
				});

				// Change Category URLs.
				// AstraSitesShowcase._change_category_urls();
			}
		},

		_cleanTheMarkup: function()
		{
			// Add loading class.
			$('body').addClass( 'uabb-templates-loading' );

			// Clean markup.
			$('#uabb-templates').css('height', '');
			$('#uabb-templates > div').remove();

			// Remove no more demos.
			if( $( '#uabb-templates-wrap .no-more-demos').length ) {
				$('#uabb-templates-wrap .no-more-demos').remove();
			}

			// Remove no sites found.
			if( $('.uabb-templates-not-found').length ) {
				$('.uabb-templates-not-found').remove();	
			}

			// Clean the search.
			$('#wp-filter-search-input').val('');
			
			// Clean the category dropdown.
			$('.uabb-template-category').val('');

			// Remove spinner.
			if( $('#uabb-templates-wrap .spinner').length )
			{
				$('#uabb-templates-wrap .spinner').remove();
			}

			// Remove load more button.
			if( $('#uabb-templates-wrap .uabb-templates-load-more-sites').length )
			{
				$('#uabb-templates-wrap .uabb-templates-load-more-sites').remove();
			}

			// Add spinner.
			$('#uabb-templates-wrap').append( wp.template('uabb-templates-spinner') );
		},

		/**
		 * Change category URLs.
		 */
		_change_category_urls: function() {
			var url_params = AstraSitesShowcase._getQueryStrings();
			delete url_params['template-type'];	
			delete url_params['category'];	

			var current_url = window.location.href;
			var root_url = current_url.substr(0, current_url.indexOf('?')); 
			if( '' === root_url ) {
				root_url = current_url;
			}

			var current_category = $('.filter-links.uabb-template-category').find('.active').data('slug') || '';
			var current_type     = $('.filter-links.uabb-template-type').find('.active').data('slug') || '';

			url_params['template-type'] = current_type;
			
			if( '' === current_category ) {
				current_category = $('.uabb-template-category option:selected').data('slug') || '';
			}

			url_params['category']     = current_category;
			delete url_params[''];		// Removed extra empty object.

			var current_url_separator = ( root_url.indexOf( "?" ) === -1 ) ? "?" : "&";
			var new_url = root_url + current_url_separator + decodeURIComponent( $.param( url_params ) );

			// Change URL.
			// AstraSitesShowcase._changeURL( new_url );
		},

		/**
		 * On Resize
		 */
		_resize: function() {

			if( AstraSitesShowcase._windowWidth() ) {

				$('#uabb-templates').masonry().masonry( 'destroy' );

				// Init masonry.
				AstraSitesShowcase._masonry();
			}
		},

		/**
		 * Preview Close
		 * 
		 * @param  {object} event Object.
		 */
		_previewClose: function( event ) {

			event.preventDefault();
			$('html').removeClass('processing');

			var url_params = AstraSitesShowcase._getQueryStrings();
			delete url_params['slug'];

			var current_url = window.location.href;
			var root_url = current_url.substr(0, current_url.indexOf('?')); 
			if( $.isEmptyObject( url_params ) ) {
				var new_url = root_url + decodeURIComponent( $.param( url_params ) );
			} else {
				var current_url_separator = ( root_url.indexOf( "?" ) === -1 ) ? "?" : "&";
				var new_url = root_url + current_url_separator + decodeURIComponent( $.param( url_params ) );
			}

			// Change URL.
			// AstraSitesShowcase._changeURL( new_url );
		},

		/**
		 * Get query strings.
		 */
		_getQueryStrings( str )
		{
			return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
		},

		/**
		 * Preview Open
		 * 
		 * @param  {object} event Object.
		 */
		_previewOpen: function( event )
		{
			event.preventDefault();

			// Site Preview.
			var title = $(this).data('title') || $(this).data('name') || null,
				href  = $(this).data('href') || $(this).data('alt'),
				rel   = $(this).data('rel') || false;

			var clean_url = href.substr(0, href.indexOf('TB_iframe')) || ''; 
			var slug      = /[^/]*$/.exec( clean_url )[0] || '';
	
			if( slug ) {

				$('html').addClass('processing');
				AstraSitesShowcase._showSingleSite( title, href, rel );

				var url_params = {
									'slug' : slug
								};

				// Change URL.
				if( ! AstraSitesShowcase._getParamFromURL('slug') ) {
					var current_url = window.location.href;
					var current_url_separator = ( window.location.href.indexOf( "?" ) === -1 ) ? "?" : "&";

					var new_url = current_url + current_url_separator + decodeURIComponent( $.param( url_params ) );
					
					// AstraSitesShowcase._changeURL( new_url );
				}
			}

		},

		/**
		 * Clean the URL.
		 * 
		 * @param  string url URL string.
		 * @return string     Change the current URL.
		 */
		_changeURL: function( url )
		{
			History.pushState(null, null, url);
		},

		/**
		 * Preview Open
		 * 
		 * @param  {object} event Object.
		 */
		_showSingleSite: function( title, href, rel )
		{
			if( href )
			{
				$('html').addClass('processing');

				var slug = $('.filter-links.uabb-template-type .active').data('slug') || '';

				var loadingMessage = astraSitesShowcase.strings.layoutLoadingMessage;
				if( 'row' === slug ) {
					loadingMessage = astraSitesShowcase.strings.rowLoadingMessage;
					title = $( '.filter-links.uabb-template-category' ).find('.active').text() || title;
				}

				tb_show( title, href, rel );

				$('#TB_closeAjaxWindow').prepend( wp.template('uabb-templates-responsive-view') );
				$('#TB_iframeContent').wrap('<div id="TB_iframeContent-wrapper"></div>');

		
				$('#TB_window').addClass('desktop').append('<div class="site-loading"><h3>'+astraSitesShowcase.strings.loadingTitle+'</h3><p>'+ loadingMessage +'</p></div>');
			}
		},

		/**
		 * Lazy Load Images
		 *
		 * @see  http://jquery.eisbehr.de/lazy/#features
		 */
		_lazyLoad: function() {

			$('#uabb-templates img').Lazy({
		        effect: 'fadeIn',
		        onFinishedAll: function() {
		            if( $( window ).outerWidth() > AstraSitesShowcase._breakpoint ) {
						$('#uabb-templates').masonry('reload');
					}
		        }
		    });
		},

		/**
		 * Init Masonry.
		 * 
		 * @see  /wp-includes/js/jquery/jquery.masonry.min.js (Source http://masonry.desandro.com).
		 */
		_masonry: function() {

			if( AstraSitesShowcase._windowWidth() ) {
				$('#uabb-templates').masonry({
					horizontalOrder : false,
					percentPosition : false
				});
			}
		},

		/**
		 * Show Sites
		 * 
		 * @param  {Boolean}
		 */
		_windowWidth: function() {

			if( $( window ).outerWidth() > AstraSitesShowcase._breakpoint ) {
				return true;
			}
			
			return false;
		},

		// Add 'search'
		_apiAddParam_search: function() {
			var search_val = $('#wp-filter-search-input').val() || '';
			if( '' !== search_val ) {
				AstraSitesShowcase._api_params['search'] = search_val;
			}
		},

		_apiAddParam_per_page: function()
		{
			var per_page_val = 9;
			var active_type  = $( '.filter-links.uabb-template-type' ).find('.active').data('slug') || 'layout';

			if( 'row' === active_type ) {
				var setting_name = 'row-par-page';
			} else {
				var setting_name = 'layout-par-page';
			}

			// Add 'per_page'
			if( astraSitesShowcase.settings && astraSitesShowcase.settings[ setting_name ] ) {
				per_page_val = parseInt( astraSitesShowcase.settings[ setting_name ] );
			}

			AstraSitesShowcase._api_params['per_page'] = per_page_val;
		},

		// Add 'uabb-template-category'
		_apiAddParam_astra_site_tag: function() {

			var selected_tag_id = $('.filter-links.uabb-template-tag').find('.active').data('group') || '';
			if( '' === selected_tag_id && 'all' !== selected_tag_id ) {
				
				// Select Box tag
				selected_tag_id = $('.uabb-template-tag option:selected').val() || '';
				if( selected_tag_id ) {
					AstraSitesShowcase._api_params['uabb-template-tag'] = selected_tag_id;
				
				} else {
					// Has `tag` slug in URL param?
					var tag_slug  = AstraSitesShowcase._getParamFromURL('tag') || '';
					if( tag_slug ) {
						var selected_tag_id = $('.filter-links.uabb-template-tag').find('a[data-slug="'+tag_slug+'"]').data('group') || '';
						AstraSitesShowcase._api_params['uabb-template-tag'] = selected_tag_id;
					}
				}


			} else if( '' !== selected_tag_id && 'all' !== selected_tag_id ) {
				AstraSitesShowcase._api_params['uabb-template-tag'] =  selected_tag_id;
			} else if( 'uabb-template-tag' in astraSitesShowcase.settings ) {

				if( $.inArray('all', astraSitesShowcase.settings['uabb-template-tag']) !== -1 ) {
					var storedCategories = astraSitesShowcase.settings['uabb-template-tag'];
					storedCategories = jQuery.grep(storedCategories, function(value) {
						return value != 'all';
					});
					AstraSitesShowcase._api_params['uabb-template-tag'] =  storedCategories.join(',');
				}
			}
		},

		// Add 'uabb-template-category'
		_apiAddParam_astra_site_category: function() {

			var selected_category_id = $('.filter-links.uabb-template-category').find('.active').data('group') || '';
			if( '' === selected_category_id && 'all' !== selected_category_id ) {
				
				// Select Box Category
				selected_category_id = $('.uabb-template-category option:selected').val() || '';
				if( selected_category_id ) {
					AstraSitesShowcase._api_params['uabb-template-category'] = selected_category_id;
				
				} else {
					// Has `category` slug in URL param?
					var category_slug  = AstraSitesShowcase._getParamFromURL('category') || '';
					if( category_slug ) {
						var selected_category_id = $('.filter-links.uabb-template-category').find('a[data-slug="'+category_slug+'"]').data('group') || '';
						AstraSitesShowcase._api_params['uabb-template-category'] = selected_category_id;
					}
				}


			} else if( '' !== selected_category_id && 'all' !== selected_category_id ) {
				AstraSitesShowcase._api_params['uabb-template-category'] =  selected_category_id;
			} else if( 'uabb-template-category' in astraSitesShowcase.settings ) {

				if( $.inArray('all', astraSitesShowcase.settings['uabb-template-category']) !== -1 ) {
					var storedCategories = astraSitesShowcase.settings['uabb-template-category'];
					storedCategories = jQuery.grep(storedCategories, function(value) {
						return value != 'all';
					});
					AstraSitesShowcase._api_params['uabb-template-category'] =  storedCategories.join(',');
				}
			}
		},

		// Add 'uabb-template-type'
		_apiAddParam_astra_site_page_builder: function() {

			var selected_page_builder_id = $('.filter-links.uabb-template-type').find('.active').data('group') || '';
			if( '' === selected_page_builder_id && 'all' !== selected_page_builder_id ) {

				// Has `template-type` slug in URL param?
				var category_slug  = AstraSitesShowcase._getParamFromURL('template-type') || '';
				if( category_slug ) {
					var selected_page_builder_id = $('.filter-links.uabb-template-type').find('a[data-slug="'+category_slug+'"]').data('group') || '';
					AstraSitesShowcase._api_params['uabb-template-type'] =  selected_page_builder_id;
				}

			} else if( '' !== selected_page_builder_id && 'all' !== selected_page_builder_id ) {
				AstraSitesShowcase._api_params['uabb-template-type'] =  selected_page_builder_id;
			} else if( 'uabb-template-type' in astraSitesShowcase.settings ) {
				if( $.inArray('all', astraSitesShowcase.settings['uabb-template-type']) !== -1 ) {
					var storedBuilders = astraSitesShowcase.settings['uabb-template-type'];
					storedBuilders = jQuery.grep(storedBuilders, function(value) {
						return value != 'all';
					});
					AstraSitesShowcase._api_params['uabb-template-type'] = storedBuilders.join(',');
				}
			}
		},

		_apiAddParam_page: function() {
			// Add 'page'
			var page_val = parseInt($('body').attr('data-astra-demo-paged')) || 1;
			AstraSitesShowcase._api_params['page'] = page_val;
		},

		/**
		 * Show Sites
		 * 
		 * 	Params E.g. per_page=<page-id>&uabb-template-category=<category-ids>&uabb-template-type=<template-type-ids>&page=<page>
		 *
		 * @param  {Boolean} resetPagedCount Reset Paged Count.
		 * @param  {String}  trigger         Filtered Trigger.
		 */
		_showSites: function( resetPagedCount, trigger ) {

			if( undefined === resetPagedCount ) {
				resetPagedCount = true
			}

			if( undefined === trigger ) {
				trigger = 'astra-api-post-loaded';
			}

			if( resetPagedCount ) {
				AstraSitesShowcase._resetPagedCount();
			}

			// Add Params for API request.
			AstraSitesShowcase._api_params = {};

			AstraSitesShowcase._apiAddParam_search();
			AstraSitesShowcase._apiAddParam_per_page();
			AstraSitesShowcase._apiAddParam_astra_site_category();
			AstraSitesShowcase._apiAddParam_astra_site_tag();
			AstraSitesShowcase._apiAddParam_astra_site_page_builder();
			AstraSitesShowcase._apiAddParam_page();

			// API Request.
			var api_post = {
				slug    : 'uabb-template?' + decodeURIComponent( $.param( AstraSitesShowcase._api_params ) ),
				trigger : trigger,
				open_in : astraSitesShowcase.settings['open-template-in'],
			};

			UABBTemplatesApi._api_request( api_post );

		},

		/**
		 * Get Category Params
		 * 
		 * @param  {string} category_slug Category Slug.
		 * @return {mixed}               Add `include=<category-ids>` in API request.
		 */
		_getCategoryParams: function( category_slug ) {

			// Has category?
			if( category_slug in astraSitesShowcase.settings ) {

				var storedBuilders = astraSitesShowcase.settings[ category_slug ];

				// Remove `all` from stored list?
				storedBuilders = jQuery.grep(storedBuilders, function(value) {
					return value != 'all';
				});

				return '?hide_empty=true&per_page=100&include='+storedBuilders.join(',');
			}

			return '?hide_empty=true&per_page=100';
		},

		/**
		 * Get All Select Status
		 * 
		 * @param  {string} category_slug Category Slug.
		 * @return {boolean}              Return true/false.
		 */
		_getCategoryAllSelectStatus: function( category_slug ) {	

			// Has category?
			if( category_slug in astraSitesShowcase.settings ) {

				// Has `all` in stored list?
				if( $.inArray('all', astraSitesShowcase.settings[ category_slug ]) === -1 ) {
					return false;
				}
			}

			return true;
		},

		/**
		 * Show Filters
		 */
		_showFilters: function() {

			/**
			 * Categories
			 */
			var category_slug = 'uabb-template-type';
			var category = {
				slug          : category_slug + AstraSitesShowcase._getCategoryParams( category_slug ),
				id            : category_slug,
				class         : category_slug,
				trigger       : 'astra-api-type-loaded',
				wrapper_class : 'filter-links',
				show_all      : astraSitesShowcase.settings['show-all-option-for-types'],
			};

			UABBTemplatesApi._api_request( category );

			/**
			 * Categories
			 */
			var category_slug = 'uabb-template-tag';
			var category = {
				slug                    : category_slug + AstraSitesShowcase._getCategoryParams( category_slug ),
				id                      : category_slug,
				class                   : category_slug,
				trigger                 : 'astra-api-tag-loaded',
				wrapper_class           : 'filter-links',
				show_all                : true, // astraSitesShowcase.settings['show-all-option-for-types'],
				no_of_visible_items     : astraSitesShowcase.settings['no-of-visible-items-tags'],
			};

			UABBTemplatesApi._api_request( category );

			/**
			 * Page Builder
			 */
			var category_slug = 'uabb-template-category';
			var category = {
				slug                : category_slug + AstraSitesShowcase._getCategoryParams( category_slug ),
				id                  : category_slug,
				class               : category_slug,
				trigger             : 'astra-api-all-category-loaded',
				wrapper_class       : 'filter-links',
				show_all            : astraSitesShowcase.settings['show-all-option-for-categories'],
				no_of_visible_items : astraSitesShowcase.settings['no-of-visible-items-categories'],
			};

			UABBTemplatesApi._api_request( category );
		},

		/**
		 * Load First Grid.
		 *
		 * This is triggered after all category loaded.
		 * 
		 * @param  {object} event Event Object.
		 */
		_loadFirstGrid: function( event, data )
		{
			event.preventDefault();

			if( $.isEmptyObject( AstraSitesShowcase._api_categories ) ) {
				AstraSitesShowcase._api_categories = data;
			}


			// var newObject = jQuery.extend(true, {}, oldObject);
			// var localTempCategories = jQuery.extend({}, AstraSitesShowcase._api_tags);
			// var localTempCategories = $.extend(true, {}, AstraSitesShowcase._api_tags);
			// var localTempCategories = AstraSitesShowcase._api_tags;

			// if( AstraSitesShowcase._api_categories.items )
			// {
			// 	var type     = 'layout';
			// 	var newArray = [];
			// 	// // console.log( AstraSitesShowcase._api_categories );

			// 	// Keep items items only have 'layout' type.
				
			// 	$.each(AstraSitesShowcase._api_categories.items, function(index, item)
			// 	{
			// 		var allTypes = item['uabb-template-type'] || [];
			// 		if( allTypes.length ) {
			// 			// // // console.log( allTypes );
			// 			if( allTypes.includes( type ) )
			// 			{
			// 				// // // console.log( index );
			// 				// ArrayName.splice(index,1);
			// 				// AstraSitesShowcase._api_categories.items[index] = {};
			// 				// allTypes.includes( type );
			// 				newArray.push( AstraSitesShowcase._api_categories.items[index] );
			// 				// newArray[] = AstraSitesShowcase._api_categories.items.splice(index, 1);
			// 			}
			// 		}
			// 		// if( ! item['uabb-template-type'].includes( type ) )
			// 		// {
			// 		// 	// // // console.log('index: ' + index);
			// 		// 	// // // console.log( item['uabb-template-type'].includes( 'layout' ) );

			// 		// 	AstraSitesShowcase._api_categories.items.splice(index, 1);
			// 		// 	// var i = AstraSitesShowcase._api_categories.items.indexOf( index );
			// 		// 	// // // console.log('index: ' + index);
			// 		// 	// if (i > -1) {
			// 		// 	// 	// // console.log('i: ' + i);
			// 		// 	// }
			// 		// }
			// 	});

			// 	AstraSitesShowcase._api_categories.items = newArray;
			// 	AstraSitesShowcase._api_categories.items_count = String( newArray.length );

			// 	// // console.log( AstraSitesShowcase._api_categories );

				
			// }
			// return;

			AstraSitesShowcase._addFilters( event, data );

			setTimeout(function() {

				AstraSitesShowcase._regenerateTags( 'layout', data );
				$('#uabb-template-tag').show();

				// Add active class for `Category`.
				var category_slug  = AstraSitesShowcase._getParamFromURL('category') || '';
				if( category_slug ) {
					$('.filter-links.uabb-template-category').find('a').removeClass('active');
					$('.filter-links.uabb-template-category').find('a[data-slug="'+category_slug+'"]').addClass('active');
				}

				// Add active class for `Page Builder`.
				var page_builder_slug  = AstraSitesShowcase._getParamFromURL('template-type') || '';
				if( page_builder_slug ) {
					$('.filter-links.uabb-template-type').find('a').removeClass('active');
					$('.filter-links.uabb-template-type').find('a[data-slug="'+page_builder_slug+'"]').addClass('active');
				}

				AstraSitesShowcase._showSites();

			}, 100);
		},

		/**
		 * Append filters.
		 * 
		 * @param  {object} event Object.
		 * @param  {object} data  API response data.
		 */
		_addTemplateTags: function( event, data )
		{
			event.preventDefault();

			if( $.isEmptyObject( AstraSitesShowcase._api_tags ) ) {
				AstraSitesShowcase._api_tags = data;
			}

			AstraSitesShowcase._regenerateTags( 'layout', data );
		},

		_addTemplateTypes: function( event, data )
		{
			event.preventDefault();

			if( $.isEmptyObject( AstraSitesShowcase._api_types ) ) {
				AstraSitesShowcase._api_types = data;
			}

			AstraSitesShowcase._addFilters( event, data );
		},

		_addFilters: function( event, data )
		{
			event.preventDefault();

			if( $('#' + data.args.id).length ) {
				var template = wp.template('uabb-templates-filters');
				$('#' + data.args.id).html(template( data )).find('li:first a').addClass('active');

				$( document ).trigger( data.args.id + '-loaded', [ data ] );
			}

		},

		/**
		 * Append sites on scroll.
		 * 
		 * @param  {object} event Object.
		 * @param  {object} data  API response data.
		 */
		_reinitGridScrolled: function( event, data )
		{
			var template = wp.template('uabb-templates-list');

			if( data.items_count > 0 ) {
				$('body').addClass('uabb-templates-has-items').removeClass('uabb-templates-not-has-items');
			} else {
				$('body').removeClass('uabb-templates-has-items').addClass('uabb-templates-not-has-items');
			}

			if( data.items.length > 0 ) {

				$('.filter-count .count').text( data.items_count );

				setTimeout(function() {
					$('#uabb-templates').append(template( data ));

					$( document ).trigger('uabb-templates-reinit-grid-added', [ data ]);

					AstraSitesShowcase._lazyLoad();

					AstraSitesShowcase._imagesLoaded();
				}, 800);
			} else {
				$('#uabb-templates').find('.spinner').removeClass('is-active');
			}


		},

		/**
		 * Update UABB Templates list.
		 * 
		 * @param  {object} event Object.
		 * @param  {object} data  API response data.
		 */
		_reinitGrid: function( event, data )
		{
			var template = wp.template('uabb-templates-list');

			$('.filter-count .count').text( data.items_count );

			if( data.items_count > 0 ) {
				$('body').addClass('uabb-templates-has-items').removeClass('uabb-templates-not-has-items');
			} else {
				$('body').removeClass('uabb-templates-has-items').addClass('uabb-templates-not-has-items');
			}

			$('body').attr('data-astra-demo-last-request', data.items_count);

			$('#uabb-templates').html( template( data ) );

			$( document ).trigger('uabb-templates-reinit-grid-added', [ data ]);

			AstraSitesShowcase._lazyLoad();

			AstraSitesShowcase._imagesLoaded();

			$('#uabb-templates').find('.spinner').removeClass('is-active');
			
			// $('#uabb-templates').append( wp.template('uabb-templates-load-more-button') );

		},

		/**
		 * Check image loaded with function `imagesLoaded()`
		 */
		_imagesLoaded: function() {

			var self = $('#sites-filter.execute-only-one-time a');
			
			$('.uabb-templates-grid').imagesLoaded()
			.always( function( instance ) {
				if( $( window ).outerWidth() > AstraSitesShowcase._breakpoint ) {
					$('#uabb-templates').masonry('reload');
				}

				$('body').removeClass( 'uabb-templates-loading' );
				$('body').addClass('uabb-templates-loaded');

				if( $('#uabb-templates-wrap .spinner').length )
				{
					$('#uabb-templates-wrap .spinner').remove();
				}
				
				if( 'click' === astraSitesShowcase.showSitesOn && ! $('#uabb-templates-wrap .uabb-templates-load-more-sites').length ) {
					$('#uabb-templates-wrap').append( wp.template('uabb-templates-load-more-sites') );
				}

				// $('.uabb-templates-load-more-sites').removeClass( 'hide-me' );

				// $('#uabb-templates').find('.spinner').removeClass('is-active');
			})
			.progress( function( instance, image ) {
				var result = image.isLoaded ? 'loaded' : 'broken';
			});

		},

		/**
		 * API Request Failed/Not found any demos.
		 */
		_apiFailed: function()
		{
			if( $('#uabb-templates-wrap .spinner').length )
			{
				$('#uabb-templates-wrap .spinner').remove();
			}
			if( $('#uabb-templates-wrap .uabb-templates-load-more-sites').length )
			{
				$('#uabb-templates-wrap .uabb-templates-load-more-sites').remove();
			}

			if( $( 'body' ).hasClass( 'uabb-templates-loaded' ) ) {

				if( ! $( '.uabb-templates-suggestions').length ) {

					// $('#uabb-templates').append( wp.template('uabb-templates-suggestions') );
					
					if( ! $( '.no-more-demos').length ) {
						$('#uabb-templates-wrap').append( wp.template('uabb-templates-no-more-demos') );
					}

					if( $( window ).outerWidth() > AstraSitesShowcase._breakpoint ) {
						$('#uabb-templates').masonry('reload');
					}
				}
			}
		},

		/**
		 * Search Site.
		 */
		_search: function() {

			$this = $('#wp-filter-search-input').val();

			var astra_page_builder = $('.filter-links.uabb-template-type'),
				astra_category 	   = $('.filter-links.uabb-template-category'),
				page_builder_id   	= astra_page_builder.find('.active').data('group') || '',
				category_id   		= astra_category.find('.active').data('group') || '';

			// Clean data before process request.
			$('#uabb-templates').css('height', '');

			if( $( '#uabb-templates-wrap .no-more-demos').length ) {
				$('#uabb-templates-wrap .no-more-demos').remove();
			}

			$('body').addClass( 'uabb-templates-loading' );

			if( $('.uabb-templates-not-found').length ) {
				$('.spinner').removeClass('hide-me').addClass('is-active');
				$('.uabb-templates-not-found').remove();

			} else {
				$('.spinner').removeClass('hide-me'); // addClass('is-active');
			}
			
			window.clearTimeout(AstraSitesShowcase._ref);
			AstraSitesShowcase._ref = window.setTimeout(function () {
				AstraSitesShowcase._ref = null;

				AstraSitesShowcase._resetPagedCount();
				$('body').addClass('loading-content');
				$('body').attr('data-astra-demo-search', $this);

				AstraSitesShowcase._showSites();

			}, 500);

		},

		/**
		 * On Scroll
		 */
		_next_page: function(event) {

			AstraSitesShowcase._updatedPagedCount();

			$('body').addClass( 'uabb-templates-loading' );

			if( $('#uabb-templates-wrap .uabb-templates-load-more-sites').length )
			{
				$('#uabb-templates-wrap .uabb-templates-load-more-sites').remove();
			}
			$('#uabb-templates-wrap').append( wp.template('uabb-templates-spinner') );

			/**
			 * @see _reinitGridScrolled() which called in trigger 'astra-api-post-loaded-on-scroll'
			 */
			AstraSitesShowcase._showSites( false, 'astra-api-post-loaded-on-scroll' );
		},

		/**
		 * On Scroll
		 */
		_scroll: function(event) {

			var scrollDistance = $(window).scrollTop();

			var themesBottom = Math.abs($(window).height() - $('#uabb-templates').offset().top - $('#uabb-templates').height());
			themesBottom = themesBottom + 100;

			ajaxLoading = $('body').data('scrolling');

			$('body').addClass( 'uabb-templates-loading' );

			if( $('#uabb-templates-wrap .uabb-templates-load-more-sites').length )
			{
				$('#uabb-templates-wrap .uabb-templates-load-more-sites').remove();
			}
			if( $('#uabb-templates-wrap .spinner').length )
			{
				$('#uabb-templates-wrap .spinner').remove();
			}

			if( ! $('#uabb-templates-wrap .no-more-demos').length ) {
				$('#uabb-templates-wrap').append( wp.template('uabb-templates-spinner') );
	
				console.log( scrollDistance + ' > ' + themesBottom );

				if (scrollDistance > themesBottom && ajaxLoading == false) {
					AstraSitesShowcase._updatedPagedCount();

					$('body').data('scrolling', true);
					
					/**
					 * @see _reinitGridScrolled() which called in trigger 'astra-api-post-loaded-on-scroll'
					 */
					AstraSitesShowcase._showSites( false, 'astra-api-post-loaded-on-scroll' );
				}
			}
		
		},
		
		/**
		 * Update Page Count.
		 */
		_updatedPagedCount: function() {
			paged = parseInt($('body').attr('data-astra-demo-paged'));
			$('body').attr('data-astra-demo-paged', paged + 1);
			window.setTimeout(function () {
				$('body').data('scrolling', false);
			}, 800);
		},

		/**
		 * Reset Page Count.
		 */
		_resetPagedCount: function() {

			$('body').attr('data-astra-demo-last-request', '1');
			$('body').attr('data-astra-demo-paged', '1');
			$('body').attr('data-astra-demo-search', '');
			$('body').attr('data-scrolling', false);
			$('body').removeClass( 'uabb-templates-loading' );
		}

	};

	/**
	 * Initialize AstraSitesShowcase
	 */
	$(function(){
		AstraSitesShowcase.init();
	});

})(jQuery);