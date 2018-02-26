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
  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask('default', ['clean', 'mkdir', 'responsive_images']);

};
