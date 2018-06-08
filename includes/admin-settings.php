<div class="wrap <?php UABBBuilderAdminSettings::render_page_class(); ?>">

	<h2 class="fl-settings-heading">
		<?php UABBBuilderAdminSettings::render_page_heading(); ?>
	</h2>
	
	<?php UABBBuilderAdminSettings::render_update_message(); ?>

	<div class="fl-settings-nav nav-tab-wrapper">
		<?php UABBBuilderAdminSettings::render_nav_items(); ?>
	</div>

	<div class="fl-settings-content">
		<?php UABBBuilderAdminSettings::render_forms(); ?>
	</div>
</div>
