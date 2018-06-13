<div id="fl-uabb-cloud-templates-form" class="fl-settings-form uabb-cloud-templates-fl-settings-form">

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

<!-- Template: Upgrade Button -->
<script type="text/template" id="tmpl-uabb-templates-upgrade-button">
	<div class="uabb-template-actions" style="opacity: 1;">
		<span
			class="button button-primary uabb-template-upgrade"
			data-uabb-unique-beaver-builder-id="{{data['uabb-unique-beaver-builder-id']}}"
			style="background: #d54e21;border-color: #cc4518;box-shadow: 0 1px 0 #a73510;text-shadow: 0 -1px 1px #ec5e2e, 1px 0 1px #9e3613, 0 1px 1px #d54e21, -1px 0 1px #b9461f;"
		><?php _e( 'Upgrade', 'uabb' ); ?></span>
	</div>
</script>