module.exports =

  build:
    expand: true
    cwd: '<%= dir.src %>/steroids/'
    src: '**/*.coffee'
    dest: '<%= dir.temp %>/steroids/'

  html_files:
    expand: true
    cwd: '<%= dir.src %>/steroids/'
    src: '**/*.html'
    dest: '<%= dir.dist %>/'

  ag_ui_kit:
    expand: true
    cwd: 'node_modules/ag-ui-kit/dist/'
    src: '*'
    dest: '<%= dir.dist %>/'

  ag_data_browser:
    expand: true
    cwd: 'node_modules/ag-data-browser/dist/'
    src: '*'
    dest: '<%= dir.dist %>/'

  ag_data_configurator:
    expand: true
    cwd: 'node_modules/ag-data-configurator/dist/'
    src: '*'
    dest: '<%= dir.dist %>/'