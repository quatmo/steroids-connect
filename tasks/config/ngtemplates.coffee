module.exports =
  components:
    options:
      module: "SteroidsConnect"
      prefix: "/steroids-connect"
    cwd: "<%= dir.templates %>/"
    src: ["**/*.html"]
    dest: "<%= dir.temp %>/templates/SteroidsConnectTemplates.js"
