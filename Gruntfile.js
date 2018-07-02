module.exports = function(grunt) {

  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [{
            width: '100%',
            name: 'large',
            quality: 80
          }, {
            width: '75%',
            name: 'medium',
            quality: 50
          }, {
            width: '50%',
            name: 'small',
            quality: 50
          }]
        },
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img/src/',
          dest: 'img/prod/'
        }]
      }
    },
    clean: {
      dev: {
        src: ['img/prod'],
      },
    },
    mkdir: {
      dev: {
        options: {
          create: ['img/prod']
        },
      },
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'css/',
          src: ['*.css', '!*.min.css'],
          dest: 'css/',
          ext: '.min.css'
        }]
      }
    },
    uglify: {
      my_target: {
        files: {
          'js/prod/index.min.js': [
            'js/src/IOPolyfill.js',
            'js/src/indexedDB.js',
            'js/src/registerSW.js',
            'js/src/main.js',
            'js/src/dbhelper.js',
          ],
          'js/prod/restaurant.min.js': [
            'js/src/indexedDB.js',
            'js/src/dbhelper.js',
            'js/src/restaurant_info.js',
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask('default', ['clean', 'mkdir', 'responsive_images', 'cssmin', 'uglify']);

};
