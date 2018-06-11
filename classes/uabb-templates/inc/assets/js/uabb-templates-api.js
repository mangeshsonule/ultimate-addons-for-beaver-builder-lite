
(function($){

	UABBTemplatesApi = {

		_api_url  : UABBTemplatesApi.ApiURL,

		/**
		 * API Request
		 */
		_api_request: function( args ) {

			$.ajax({
				url   : UABBTemplatesApi._api_url + args.slug,
				cache : false
			})
			.done(function( items, status, XHR ) {

				if( 'success' === status && XHR.getResponseHeader('x-wp-total') )
				{
					var data = {
						args 		: args,
						items 		: items,
						items_count	: XHR.getResponseHeader('x-wp-total') || 0,
					};

					if( 'undefined' !== args.trigger && '' !== args.trigger ) {
						$(document).trigger( args.trigger, [data] );
					}

				} else {
					$(document).trigger( 'uabb-templates-api-request-error' );
				}

			})
			.fail(function( jqXHR, textStatus ) {

				$(document).trigger( 'uabb-templates-api-request-fail-for-' + args.id );

				$(document).trigger( 'uabb-templates-api-request-fail' );

			})
			.always(function() {

				$(document).trigger( 'uabb-templates-api-request-always' );

			});

		},

	};

})(jQuery);