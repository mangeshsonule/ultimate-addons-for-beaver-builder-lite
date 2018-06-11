<div id="fl-uabb-cloud-templates-form" class="fl-settings-form uabb-cloud-templates-fl-settings-form">

	<div class="uabb-go-premium"><?php _e( '<a href="' . BB_ULTIMATE_ADDON_UPGRADE_URL . '" target="_blank">Go Premium</a> and get access to all Page Templates and Sections.', 'uabb' ); ?></div>

	<form id="uabb-cloud-templates-form" action="<?php UABBBuilderAdminSettings::render_form_action( 'uabb-cloud-templates' ); ?>" method="post">

		<?php if ( FLBuilderAdminSettings::multisite_support() && ! is_network_admin() ) : ?>
		<label>
			<input class="fl-override-ms-cb" type="checkbox" name="fl-override-ms" value="1" <?php if(get_option('_fl_builder_uabb_cloud_templates')) echo 'checked="checked"'; ?> />
			<?php _e('Override network settings?', 'uabb'); ?>
		</label>
		<?php endif; ?>

		<div class="fl-settings-form-content">

			<?php echo do_shortcode( '[uabb-templates]' ); ?>

		</div>
	</form>
</div>
