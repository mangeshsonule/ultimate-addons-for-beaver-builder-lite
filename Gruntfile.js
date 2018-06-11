module.exports = function( grunt ) {

	'use strict';
	var banner = '/**\n * <%= pkg.homepage %>\n * Copyright (c) <%= grunt.template.today("yyyy") %>\n * This file is generated automatically. Do not edit.\n */\n';
	// Project configuration
	grunt.initConfig( {

		pkg: grunt.file.readJSON( 'package.json' ),

		wp_readme_to_markdown: {
			your_target: {
				files: {
					'README.md': 'readme.txt'
				}
			},
		},

		addtextdomain: {
			options: {
				textdomain: 'uabb',
			},
			target: {
				files: {
					src: [
						'*.php',
						'**/*.php',
						'!node_modules/**',
						'!admin/bsf-core/**',
						'!php-tests/**',
						'!bin/**',
					]
				}
			}
		},

		makepot: {
			target: {
				options: {
					domainPath: '/languages',
					mainFile: 'uabb.php',
					potFilename: 'uabb.pot',
					potHeaders: {
						poedit: true,
						'x-poedit-keywordslist': true
					},
					type: 'wp-plugin',
					updateTimestamp: true
				}
			}
		}

	} );

	// Load grunt tasks.
    grunt.loadNpmTasks('grunt-wp-readme-to-markdown');
    grunt.loadNpmTasks('grunt-wp-i18n');

    // Register tasks.
    grunt.registerTask('readme', ['wp_readme_to_markdown']);

    // Generate .pot file.
	grunt.registerTask( 'i18n', ['addtextdomain', 'makepot'] );

	grunt.util.linefeed = '\n';

};
