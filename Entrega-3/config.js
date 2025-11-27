  // Configuración de Protobject Framework
// Habilitar modo producción para generar IDs únicos
Protobject.setProduction(true);

Protobject.initialize([
  {
    name: "Computador - Visualización",
    page: "index.html",
    main: true,
    debug: "master", // Recopila y muestra logs de todas las páginas conectadas
  },
  {
    name: "Celular - Detector",
    page: "detector.html",
    debug: "remote", // Envía logs a la página master
  }
]);
