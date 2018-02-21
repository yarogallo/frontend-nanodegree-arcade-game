module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mkdir: {
            all: {
                options: {
                    create: ['dist']
                }
            }

        },
        concat: {
            options: {
                separator: ';',
                stripBanners: {
                    options: {
                        block: true,
                        line: true
                    }
                }
            },
            files: {
                src: ['js/resources.js', 'js/engine.js', 'js/gameCharacters.js', 'js/app.js', ],
                dest: 'dist/script-min.js'
            }
        },
        uglify: {
            options: {},
            files: {
                src: ['dist/script-min.js'],
                dest: 'dist/script-min.js'
            }

        },
        cssmin: {
            options: {},
            files: {
                src: 'css/style.css',
                dest: 'dist/style-min.css'
            }
        },
        processhtml: {
            build: {
                files: {
                    'dist/index.html': ['index.html']
                }
            }
        },
        clean: {
            all: {
                files: [{
                    src: ['dist']
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-processhtml')

    grunt.registerTask('default', ['clean', 'mkdir', 'concat', 'cssmin', 'uglify', 'processhtml']);
};