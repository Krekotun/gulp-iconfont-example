"use strict";

import gulp from 'gulp'
import stylus from 'gulp-stylus'
import rename from 'gulp-rename'
import lodash from 'lodash'
import consolidate from 'gulp-consolidate'
import iconfont from 'gulp-iconfont'

let paths = {
	src: {
		images: {
			icons: {
				all: './src/assets/images/icons/**/*.svg'
			}
		},

		styles: {
			main: './src/assets/styles/main.styl',
			iconfont: {
				root: './src/assets/styles/iconfont/',
				font: './src/assets/styles/iconfont/font.styl',
				template: './src/assets/styles/iconfont/template.styl'
			}
		},

		templates: {
			all: './src/templates/**/*.html'
		}
	},

	dist: {
		fonts: {
			root: './dist/assets/fonts'
		},
		styles: {
			root: './dist/assets/styles'
		},
		templates: {
			root: './dist/'
		}
	}
}

gulp.task('iconfont', () => {
	let runTimestamp = Math.round(Date.now()/1000),
			fontName = "iconfont"

	gulp.src( paths.src.images.icons.all )
		.pipe( iconfont({
			fontName: fontName,
			appendCodepoints: false,
			normalize: true,
			formats: ['woff'],
			timestamp: runTimestamp
		}) )
		.on('glyphs', (glyphs) => {
			let options = {
				glyphs: glyphs.map( (glyph) => {
					return {
						name: glyph.name,
						codepoint: glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase()
					}
				} ),
				fontName: fontName,
				fontPath: '../fonts/'
			}

			gulp.src( paths.src.styles.iconfont.template )
				.pipe( consolidate('lodash', options) )
				.pipe( rename({ basename: fontName }) )
				.pipe( gulp.dest( paths.src.styles.iconfont.root ) );
		})
		.pipe( gulp.dest( paths.dist.fonts.root ) );
});

gulp.task('templates', () => {
	gulp.src( paths.src.templates.all )
		.pipe( gulp.dest( paths.dist.templates.root ) )
});

gulp.task('stylus', () => {
	gulp.src( paths.src.styles.main )
		.pipe( stylus() )
		.pipe( gulp.dest( paths.dist.styles.root ) );
});

gulp.task('default', ['iconfont', 'stylus', 'templates'])
