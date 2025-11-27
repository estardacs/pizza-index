
// ==========================================
// MOTOR DE AUDIO CON TONE.JS (VERSIÓN CON ARCHIVOS DE AUDIO)
// ==========================================

const AudioEngine = {
    isStarted: false,
    players: {}, // Usaremos Players en lugar de Synths
    reverb: null,
    activeSounds: new Map(), // Para rastrear sonidos activos por color
    baseVolume: 80, // Volumen base del slider (0-100)
    isMuted: false,

    // Iniciar el contexto de audio y cargar los archivos
    async start() {
        if (this.isStarted) return;
        try {
            await Tone.start();
            this.isStarted = true;
            console.log("AudioContext iniciado correctamente.");
            await this.loadPlayers();
        } catch (error) {
            console.error("Error al iniciar AudioContext:", error);
            this.isStarted = false;
        }
    },

    // Cargar los archivos de audio en objetos Tone.Player
    async loadPlayers() {
        try {
            log('🔊 Cargando archivos de audio...', 'info');
            this.reverb = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).toDestination();

            const loadPromises = Object.entries(COLORES_CONFIG).map(([color, config]) => {
                return new Promise((resolve, reject) => {
                    const player = new Tone.Player({
                        url: config.soundFile,
                        loop: false, // Los sonidos se reproducen 1 sola vez
                        fadeIn: 0.5,
                        fadeOut: 0.5,
                        onload: resolve,
                        onerror: reject,
                    }).connect(this.reverb);
                    this.players[color] = player;
                });
            });

            await Promise.all(loadPromises);
            log('✅ Archivos de audio cargados.', 'success');
        } catch (error) {
            log('❌ Error al cargar los archivos de audio: ' + error, 'error');
            console.error("Error en loadPlayers:", error);
        }
    },

    // Reproducir sonido para un evento
    play(evento) {
        if (!this.isStarted || !evento || !this.players[evento.color] || this.isMuted) return;

        const { color, tamaño } = evento;
        const player = this.players[color];

        if (!player.loaded || this.activeSounds.has(color)) return;

        let playbackRate = 1.0;
        let gravityMultiplier = 1.0; // Multiplicador según gravedad del evento

        // Ajustar parámetros según la gravedad (tamaño)
        switch (tamaño) {
            case 15: // Grande - 100% del volumen base
                playbackRate = 1.1;
                gravityMultiplier = 1.0;
                break;
            case 10: // Mediano - 66% del volumen base
                playbackRate = 1.0;
                gravityMultiplier = 0.66;
                break;
            case 5: // Chico - 33% del volumen base
                playbackRate = 0.9;
                gravityMultiplier = 0.33;
                break;
        }

        // Calcular volumen en dB basado en el slider y la gravedad
        // baseVolume está en rango 0-100, convertir a dB
        const volumePercent = (this.baseVolume / 100) * gravityMultiplier;
        const volumeDb = this.percentToDb(volumePercent);

        player.playbackRate = playbackRate;
        player.volume.value = volumeDb;

        player.start();
        this.activeSounds.set(color, player);

        // Limpiar de activeSounds cuando termine de reproducirse
        player.onstop = () => {
            this.activeSounds.delete(color);
            console.log(`⏹️ Audio ${color} terminó`);
        };

        console.log(`🔊 Play: ${color} (Tamaño: ${tamaño}cm, Volumen: ${Math.round(volumePercent * 100)}%, dB: ${volumeDb.toFixed(1)})`);
    },

    // Convertir porcentaje (0-1) a decibeles
    percentToDb(percent) {
        if (percent <= 0) return -100; // Silencio
        // Mapeo logarítmico: 0.01 (1%) = -40dB, 1.0 (100%) = 0dB
        return 20 * Math.log10(percent);
    },

    // Detener el sonido de una categoría de color
    stop(color) {
        if (!this.isStarted || !this.activeSounds.has(color)) return;

        const player = this.activeSounds.get(color);
        
        if (player && player.state === "started") {
            player.stop();
        }

        this.activeSounds.delete(color);
        console.log(`🔇 Stop: ${color}`);
    },

    // Detener todos los sonidos
    stopAll() {
        if (!this.isStarted) return;
        for (const color of this.activeSounds.keys()) {
            this.stop(color);
        }
        console.log("🔇 Todos los sonidos detenidos.");
    },

    // Establecer volumen base (0-100)
    setVolume(volume) {
        this.baseVolume = Math.max(0, Math.min(100, volume));

        // Actualizar volumen de sonidos activos
        for (const [color, player] of this.activeSounds.entries()) {
            if (player && player.state === "started") {
                // Obtener el evento actual para saber su tamaño
                // (Como no tenemos acceso directo, usaremos el volumen actual)
                // Por ahora, solo actualizamos si hay sonidos activos
                const volumePercent = this.baseVolume / 100;
                const volumeDb = this.percentToDb(volumePercent);
                player.volume.value = volumeDb;
            }
        }

        console.log(`🔊 Volumen ajustado a ${this.baseVolume}%`);
    },

    // Alternar mute
    toggleMute() {
        this.isMuted = !this.isMuted;

        if (this.isMuted) {
            // Silenciar todos los sonidos activos
            for (const player of this.activeSounds.values()) {
                if (player && player.state === "started") {
                    player.volume.value = -100; // Silencio
                }
            }
        } else {
            // Restaurar volumen
            for (const player of this.activeSounds.values()) {
                if (player && player.state === "started") {
                    const volumePercent = this.baseVolume / 100;
                    const volumeDb = this.percentToDb(volumePercent);
                    player.volume.value = volumeDb;
                }
            }
        }

        console.log(`🔇 Mute: ${this.isMuted}`);
        return { isMuted: this.isMuted, volume: this.baseVolume };
    }
};

