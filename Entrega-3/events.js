// ==========================================
// DATOS DE LOS 14 EVENTOS DEL PIZZA INDEX
// ==========================================

const EVENTOS = [
    // ========== INVASIONES TERRESTRES (ROJO) ==========
    {
        id: 1,
        nombre: "Invasión de Irak",
        fecha: "20 de marzo de 2003",
        color: "ROJO",
        tamaño: 15, // cm
        categoria: "Invasiones Terrestres",
        pizzasCriticas: 220,
        pizzasNormales: 45,
        incremento: 389,
        descripcion: "Inicio de la invasión estadounidense a Irak bajo la operación 'Libertad Iraquí'",
        emoji: "🔴"
    },
    {
        id: 2,
        nombre: "Guerra del Golfo",
        fecha: "17 de enero de 1991",
        color: "ROJO",
        tamaño: 10,
        categoria: "Invasiones Terrestres",
        pizzasCriticas: 116,
        pizzasNormales: 35,
        incremento: 231,
        descripcion: "Operación Tormenta del Desierto - liberación de Kuwait",
        emoji: "🔴"
    },
    {
        id: 3,
        nombre: "Invasión de Granada",
        fecha: "25 de octubre de 1983",
        color: "ROJO",
        tamaño: 5,
        categoria: "Invasiones Terrestres",
        pizzasCriticas: 100,
        pizzasNormales: 30,
        incremento: 233,
        descripcion: "Operación Furia Urgente - intervención estadounidense en Granada",
        emoji: "🔴"
    },

    // ========== BOMBARDEOS Y ATAQUES AÉREOS (NARANJA) ==========
    {
        id: 4,
        nombre: "Bombardeo de Libia",
        fecha: "14 de abril de 1986",
        color: "NARANJA",
        tamaño: 15,
        categoria: "Bombardeos y Ataques Aéreos",
        pizzasCriticas: 180,
        pizzasNormales: 35,
        incremento: 414,
        descripcion: "Operación El Dorado Canyon - bombardeos contra objetivos libios",
        emoji: "🟠"
    },
    {
        id: 5,
        nombre: "Ataques aéreos en Siria",
        fecha: "7 de abril de 2017",
        color: "NARANJA",
        tamaño: 10,
        categoria: "Bombardeos y Ataques Aéreos",
        pizzasCriticas: 145,
        pizzasNormales: 42,
        incremento: 245,
        descripcion: "Bombardeo con misiles Tomahawk a base aérea siria",
        emoji: "🟠"
    },
    {
        id: 6,
        nombre: "Bombardeo de Kosovo",
        fecha: "24 de marzo de 1999",
        color: "NARANJA",
        tamaño: 5,
        categoria: "Bombardeos y Ataques Aéreos",
        pizzasCriticas: 92,
        pizzasNormales: 38,
        incremento: 142,
        descripcion: "Operación Fuerza Aliada - campaña aérea de la OTAN",
        emoji: "🟠"
    },

    // ========== CRISIS POLÍTICAS (AMARILLO) ==========
    {
        id: 7,
        nombre: "Crisis de los Misiles de Cuba",
        fecha: "16 de octubre de 1962",
        color: "AMARILLO",
        tamaño: 15,
        categoria: "Crisis Políticas",
        pizzasCriticas: 250,
        pizzasNormales: 40,
        incremento: 525,
        descripcion: "Confrontación nuclear entre EE.UU. y la Unión Soviética",
        emoji: "🟡"
    },
    {
        id: 8,
        nombre: "Crisis de Rehenes en Irán",
        fecha: "4 de noviembre de 1979",
        color: "AMARILLO",
        tamaño: 10,
        categoria: "Crisis Políticas",
        pizzasCriticas: 135,
        pizzasNormales: 35,
        incremento: 286,
        descripcion: "52 estadounidenses tomados como rehenes en Teherán",
        emoji: "🟡"
    },
    {
        id: 9,
        nombre: "Intervención en Libia",
        fecha: "19 de marzo de 2011",
        color: "AMARILLO",
        tamaño: 5,
        categoria: "Crisis Políticas",
        pizzasCriticas: 100,
        pizzasNormales: 30,
        incremento: 233,
        descripcion: "Intervención militar internacional en la Guerra Civil Libia",
        emoji: "🟡"
    },

    // ========== ATENTADOS TERRORISTAS (AZUL) ==========
    {
        id: 9,
        nombre: "11 de Septiembre",
        fecha: "11 de septiembre de 2001",
        color: "AZUL",
        tamaño: 15,
        categoria: "Atentados Terroristas",
        pizzasCriticas: 300,
        pizzasNormales: 45,
        incremento: 567,
        descripcion: "Ataques terroristas al World Trade Center y el Pentágono",
        emoji: "🔵"
    },
    {
        id: 10,
        nombre: "Atentado de Oklahoma City",
        fecha: "19 de abril de 1995",
        color: "AZUL",
        tamaño: 10,
        categoria: "Atentados Terroristas",
        pizzasCriticas: 128,
        pizzasNormales: 38,
        incremento: 237,
        descripcion: "Bombardeo del edificio federal Alfred P. Murrah",
        emoji: "🔵"
    },
    {
        id: 11,
        nombre: "Atentado USS Cole",
        fecha: "12 de octubre de 2000",
        color: "AZUL",
        tamaño: 5,
        categoria: "Atentados Terroristas",
        pizzasCriticas: 88,
        pizzasNormales: 35,
        incremento: 151,
        descripcion: "Ataque suicida contra el destructor USS Cole en Yemen",
        emoji: "🔵"
    },

    // ========== OPERACIONES ESPECIALES (VERDE) ==========
    {
        id: 12,
        nombre: "Operación Lanza de Neptuno",
        fecha: "2 de mayo de 2011",
        color: "VERDE",
        tamaño: 15,
        categoria: "Operaciones Especiales",
        pizzasCriticas: 195,
        pizzasNormales: 43,
        incremento: 353,
        descripcion: "Operación que eliminó a Osama bin Laden en Pakistán",
        emoji: "🟢"
    },
    {
        id: 13,
        nombre: "Operación Garra del Águila",
        fecha: "24 de abril de 1980",
        color: "VERDE",
        tamaño: 10,
        categoria: "Operaciones Especiales",
        pizzasCriticas: 110,
        pizzasNormales: 32,
        incremento: 244,
        descripcion: "Intento fallido de rescate de rehenes en Irán",
        emoji: "🟢"
    },
    {
        id: 14,
        nombre: "Captura de Noriega",
        fecha: "20 de diciembre de 1989",
        color: "VERDE",
        tamaño: 5,
        categoria: "Operaciones Especiales",
        pizzasCriticas: 95,
        pizzasNormales: 33,
        incremento: 188,
        descripcion: "Operación Causa Justa - invasión de Panamá",
        emoji: "🟢"
    }
];

// ==========================================
// CONFIGURACIÓN DE COLORES
// ==========================================

const COLORES_CONFIG = {
    ROJO: {
        rgb: { r: 255, g: 0, b: 0 },
        hex: "#dc2626",
        nombre: "Rojo",
        categoria: "Invasiones Terrestres",
        icono: "assets/icons/militar.svg",
        soundFile: "../Entrega-2/assets/sounds/marcha.mp3"
    },
    NARANJA: {
        rgb: { r: 255, g: 140, b: 0 },
        hex: "#ea580c",
        nombre: "Naranja",
        categoria: "Bombardeos y Ataques Aéreos",
        icono: "assets/icons/bombardeo.svg",
        soundFile: "../Entrega-2/assets/sounds/explosion.mp3"
    },
    AMARILLO: {
        rgb: { r: 255, g: 255, b: 0 },
        hex: "#ca8a04",
        nombre: "Amarillo",
        categoria: "Crisis Políticas",
        icono: "assets/icons/politica.svg",
        soundFile: "../Entrega-2/assets/sounds/conversacion.mp3"
    },
    AZUL: {
        rgb: { r: 0, g: 0, b: 255 },
        hex: "#2563eb",
        nombre: "Azul",
        categoria: "Atentados Terroristas",
        icono: "assets/icons/terrorista.svg",
        soundFile: "../Entrega-2/assets/sounds/sirena.mp3"
    },
    VERDE: {
        rgb: { r: 0, g: 255, b: 0 },
        hex: "#059669",
        nombre: "Verde",
        categoria: "Operaciones Especiales",
        icono: "assets/icons/espia.svg",
        soundFile: "../Entrega-2/assets/sounds/radio.mp3"
    }
};

// ==========================================
// CONFIGURACIÓN DE TAMAÑOS
// ==========================================

const TAMAÑOS_CONFIG = {
    15: {
        nombre: "Grande",
        gravedad: "Alta",
        descripcion: ">150 pizzas críticas",
        icono: "🔺"
    },
    10: {
        nombre: "Mediano",
        gravedad: "Media",
        descripcion: "100-150 pizzas críticas",
        icono: "🔻"
    },
    5: {
        nombre: "Pequeño",
        gravedad: "Baja",
        descripcion: "<100 pizzas críticas",
        icono: "▪️"
    }
};

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

/**
 * Detecta el color dominante a partir de valores RGB
 */
function detectarColor(r, g, b) {
    // Normalizar valores
    const total = r + g + b;
    if (total === 0) return null;

    // Rojo dominante
    if (r > 150 && r > g * 1.8 && r > b * 1.8) return "ROJO";

    // Naranja (rojo + verde, sin azul)
    if (r > 150 && g > 80 && g < r && b < 100) return "NARANJA";

    // Amarillo (rojo + verde altos)
    if (r > 150 && g > 150 && b < 120) return "AMARILLO";

    // Azul dominante
    if (b > 150 && b > r * 1.8 && b > g * 1.8) return "AZUL";

    // Verde dominante
    if (g > 150 && g > r * 1.5 && g > b * 1.5) return "VERDE";

    return null;
}

/**
 * Clasifica el tamaño detectado en cm a una de las 3 categorías
 */
function clasificarTamaño(largoCm) {
    if (largoCm >= 12.5) return 15; // Grande: 12.5-17.5 cm
    if (largoCm >= 7.5) return 10;  // Mediano: 7.5-12.5 cm
    return 5;                        // Pequeño: 2.5-7.5 cm
}

/**
 * Busca un evento basado en color y tamaño
 */
function buscarEvento(color, tamaño) {
    return EVENTOS.find(e => e.color === color && e.tamaño === tamaño);
}

/**
 * Obtiene todos los eventos de una categoría (color)
 */
function eventosPorCategoria(color) {
    return EVENTOS.filter(e => e.color === color);
}

/**
 * Obtiene estadísticas generales
 */
function getEstadisticas() {
    return {
        totalEventos: EVENTOS.length,
        porCategoria: {
            ROJO: EVENTOS.filter(e => e.color === "ROJO").length,
            NARANJA: EVENTOS.filter(e => e.color === "NARANJA").length,
            AMARILLO: EVENTOS.filter(e => e.color === "AMARILLO").length,
            AZUL: EVENTOS.filter(e => e.color === "AZUL").length,
            VERDE: EVENTOS.filter(e => e.color === "VERDE").length
        },
        eventoMasGrave: EVENTOS.reduce((max, e) => e.pizzasCriticas > max.pizzasCriticas ? e : max),
        totalPizzas: EVENTOS.reduce((sum, e) => sum + e.pizzasCriticas, 0)
    };
}
