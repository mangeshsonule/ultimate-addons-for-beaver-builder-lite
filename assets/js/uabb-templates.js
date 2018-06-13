(function($) {

	UABBTemplateCloud = {

		init: function()
		{
			this._bind();
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
			// Add install button for the downloaded templates only.
			$( document ).on('uabb-templates-reinit-grid-added',			UABBTemplateCloud._reinitGridAdded );
		},

		/**
		 * Load First Grid.
		 *
		 * This is triggered after all category loaded.
		 * 
		 * @param  {object} event Event Object.
		 */
		_reinitGridAdded: function( event, data )
		{
			event.preventDefault();

			$.each( data.items, function(itemIndex, itemValue) {
				if( itemValue['uabb-unique-beaver-builder-id'] )
				{
					// Check template.
					if( $( '#' + itemValue['uabb-unique-beaver-builder-id'] ).length )
					{
						var template = $( '#' + itemValue['uabb-unique-beaver-builder-id'] );

						template.find( '.template-meta h3' ).append( wp.template( 'uabb-templates-upgrade-button' ) );
					}
				}
			});

		}

	};

	/**
	 * Initialize UABBTemplateCloud
	 */
	$(function(){
		UABBTemplateCloud.init();
	});

})(jQuery);