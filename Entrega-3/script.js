// ==========================================
// VARIABLES GLOBALES
// ==========================================

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const statusEl = document.getElementById('status');
const detectionEl = document.getElementById('detection');
const qrCodeCanvas = document.getElementById('qr-code');
const qrUrlEl = document.getElementById('qr-url');
const qrContainer = document.getElementById('qr-container');
const debugLog = document.getElementById('debug-log');

let peer;
let conn;
let frameCount = 0;

// ==========================================
// FUNCIONES DE DEBUG
// ==========================================

function log(message, type = 'info') {
    console.log(message);
    if (debugLog) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        if (type === 'error') entry.classList.add('log-error');
        if (type === 'success') entry.classList.add('log-success');
        
        const timestamp = new Date().toLocaleTimeString();
        entry.textContent = `[${timestamp}] ${message}`;
        
        debugLog.appendChild(entry);
        debugLog.scrollTop = debugLog.scrollHeight;
    }
}

function updateStatus(message, type = 'info') {
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = '';
        if (type === 'success') statusEl.classList.add('connected');
        if (type === 'error') statusEl.classList.add('error');
    }
    log(message, type);
}

// ==========================================
// VERIFICAR LIBRERÍAS
// ==========================================

function verificarLibrerias() {
    log('🔍 Verificando librerías...', 'info');
    
    if (typeof QRCode === 'undefined') {
        log('❌ QRCode no está cargado!', 'error');
        updateStatus('❌ Error: QRCode no cargó. Recarga la página.', 'error');
        return false;
    }
    
    if (typeof Peer === 'undefined') {
        log('❌ PeerJS no está cargado!', 'error');
        updateStatus('❌ Error: PeerJS no cargó. Recarga la página.', 'error');
        return false;
    }
    
    log('✅ QRCode cargado: v' + (QRCode.version || 'OK'), 'success');
    log('✅ PeerJS cargado', 'success');
    return true;
}

// ==========================================
// COMPUTADOR: GENERAR QR Y RECIBIR VIDEO
// ==========================================

function inicializarComputador() {
    // Esperar a que las librerías se carguen si no están listas
    if (typeof QRCode === 'undefined' || typeof Peer === 'undefined') {
        log('⏳ Esperando que las librerías se carguen...', 'info');
        updateStatus('⏳ Cargando librerías... espera 2 segundos', 'info');
        
        setTimeout(() => {
            if (!verificarLibrerias()) {
                alert('Error: Las librerías no se cargaron. Recarga la página (F5).');
                document.getElementById('generateQR').disabled = false;
                return;
            }
            inicializarComputador();
        }, 2000);
        return;
    }

    log('🖥️ Inicializando modo computador...', 'info');
    updateStatus('🔄 Conectando al servidor...', 'info');

    // Generar ID único
    const peerId = 'pizza-' + Math.random().toString(36).substr(2, 9);
    log('🆔 ID generado: ' + peerId, 'success');

    // Deshabilitar botón
    document.getElementById('generateQR').disabled = true;

    // Crear peer
    peer = new Peer(peerId, {
        host: '0.peerjs.com',
        port: 443,
        path: '/',
        secure: true,
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
            ]
        },
        debug: 2
    });

    peer.on('open', (id) => {
        log('✅ Conectado al servidor PeerJS!', 'success');
        updateStatus('🟡 Esperando que el celular se conecte...', 'info');

        // Generar URL
        const baseUrl = window.location.origin + window.location.pathname;
        const celularUrl = baseUrl + '?remote=' + id;
        
        log('📱 URL para celular: ' + celularUrl, 'info');
        qrUrlEl.textContent = celularUrl;

        // Generar QR usando el canvas directamente
        try {
            QRCode.toCanvas(qrCodeCanvas, celularUrl, {
                width: 256,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            }, (error) => {
                if (error) {
                    log('❌ Error generando QR: ' + error, 'error');
                    updateStatus('❌ Error generando QR. Usa la URL de abajo.', 'error');
                    return;
                }
                qrContainer.style.display = 'block';
                log('✅ QR Code generado!', 'success');
            });
        } catch (error) {
            log('❌ Excepción al generar QR: ' + error, 'error');
            updateStatus('❌ Error: ' + error.message, 'error');
        }
    });

    peer.on('connection', (connection) => {
        log('📱 Celular intentando conectar...', 'info');
        conn = connection;

        conn.on('open', () => {
            log('✅ Celular conectado exitosamente!', 'success');
            updateStatus('🟢 Celular conectado! Recibiendo video...', 'success');
            qrContainer.style.display = 'none';
        });

        conn.on('data', (data) => {
            if (data.type === 'frame') {
                mostrarFrame(data.frame);
            }
        });

        conn.on('close', () => {
            log('🔴 Celular desconectado', 'error');
            updateStatus('🔴 Celular desconectado - Recarga para reconectar', 'error');
            qrContainer.style.display = 'block';
        });

        conn.on('error', (err) => {
            log('❌ Error en conexión: ' + err, 'error');
        });
    });

    peer.on('error', (error) => {
        log('❌ Error de PeerJS: ' + error.type, 'error');
        let mensaje = 'Error desconocido';
        
        switch(error.type) {
            case 'network':
                mensaje = '❌ Error de red. Verifica tu Internet.';
                break;
            case 'server-error':
                mensaje = '❌ Error del servidor. Intenta de nuevo en 10 segundos.';
                break;
            case 'browser-incompatible':
                mensaje = '❌ Navegador incompatible. Usa Chrome/Firefox.';
                break;
            case 'disconnected':
                mensaje = '⚠️ Desconectado. Recargando...';
                setTimeout(() => window.location.reload(), 2000);
                break;
            default:
                mensaje = '❌ Error: ' + error.type;
        }
        
        updateStatus(mensaje, 'error');
        document.getElementById('generateQR').disabled = false;
    });

    peer.on('disconnected', () => {
        log('⚠️ Desconectado, intentando reconectar...', 'error');
        updateStatus('⚠️ Reconectando...', 'info');
        peer.reconnect();
    });
}

// ==========================================
// MOSTRAR FRAME DEL CELULAR
// ==========================================

function mostrarFrame(frameData) {
    const img = new Image();
    img.onload = () => {
        if (canvas.width !== img.width || canvas.height !== img.height) {
            canvas.width = img.width;
            canvas.height = img.height;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        frameCount++;
        detectarPizzas();
    };
    img.onerror = () => {
        log('❌ Error cargando frame', 'error');
    };
    img.src = frameData;
}

// ==========================================
// DETECCIÓN SIMPLE
// ==========================================

function detectarPizzas() {
    if (!canvas.width || !canvas.height) return;

    try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let totalBrightness = 0;
        let redPixels = 0;
        let greenPixels = 0;
        let bluePixels = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            totalBrightness += (r + g + b) / 3;
            
            if (r > 150 && g < 100 && b < 100) redPixels++;
            if (g > 150 && r < 100 && b < 100) greenPixels++;
            if (b > 150 && r < 100 && g < 100) bluePixels++;
        }
        
        const avgBrightness = Math.round(totalBrightness / (data.length / 4));
        const totalPixels = data.length / 4;
        
        detectionEl.textContent = `📸 Frame #${frameCount} | Brillo: ${avgBrightness} | 🔴 ${Math.round(redPixels/totalPixels*100)}% 🟢 ${Math.round(greenPixels/totalPixels*100)}% 🔵 ${Math.round(bluePixels/totalPixels*100)}%`;
        
    } catch (error) {
        log('❌ Error en detección: ' + error, 'error');
    }
}

// ==========================================
// TEST DE CÁMARA LOCAL
// ==========================================

function testCamaraLocal() {
    log('🎥 Probando cámara local...', 'info');
    updateStatus('🔄 Accediendo a cámara local...', 'info');

    navigator.mediaDevices.getUserMedia({ 
        video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
        } 
    })
    .then(stream => {
        video.srcObject = stream;
        log('✅ Cámara local funcionando!', 'success');
        updateStatus('✅ Cámara local activa (modo test)', 'success');
        detectionEl.textContent = 'Cámara local - Sin detección en modo test';
    })
    .catch(error => {
        log('❌ Error accediendo a cámara: ' + error.message, 'error');
        updateStatus('❌ Error: ' + error.message, 'error');
    });
}

// ==========================================
// CELULAR: CAPTURAR Y ENVIAR VIDEO
// ==========================================

function inicializarCelular(desktopId) {
    log('📱 Modo celular activado', 'info');
    
    // Mostrar vista móvil
    document.getElementById('desktop-view').style.display = 'none';
    document.getElementById('mobile-view').style.display = 'block';

    const mobileVideo = document.getElementById('mobile-video');
    const mobileStatus = document.getElementById('mobile-status');
    const frameCounter = document.getElementById('frame-counter');

    mobileStatus.textContent = '🔄 Solicitando acceso a cámara...';

    // Pedir cámara
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'environment',
            width: { ideal: 640 },
            height: { ideal: 480 }
        }
    })
    .then((stream) => {
        mobileVideo.srcObject = stream;
        mobileStatus.textContent = '✅ Cámara activada - Conectando...';
        mobileStatus.style.background = '#d4edda';

        // Crear peer del celular
        const mobilePeer = new Peer({
            host: '0.peerjs.com',
            port: 443,
            path: '/',
            secure: true,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:global.stun.twilio.com:3478' }
                ]
            },
            debug: 2
        });

        mobilePeer.on('open', (id) => {
            console.log('📱 Peer móvil abierto:', id);
            console.log('🔗 Conectando a:', desktopId);

            const conn = mobilePeer.connect(desktopId, {
                reliable: true
            });

            conn.on('open', () => {
                console.log('✅ Conectado!');
                mobileStatus.textContent = '🟢 ¡Conectado! Transmitiendo...';
                mobileStatus.style.background = '#d4edda';

                let frameSent = 0;

                // Enviar frames
                const intervalId = setInterval(() => {
                    if (conn.open) {
                        enviarFrame(mobileVideo, conn);
                        frameSent++;
                        frameCounter.textContent = frameSent;
                    } else {
                        clearInterval(intervalId);
                    }
                }, 150);
            });

            conn.on('error', (err) => {
                console.error('❌ Error:', err);
                mobileStatus.textContent = '❌ Error de conexión';
                mobileStatus.style.background = '#f8d7da';
            });

            conn.on('close', () => {
                mobileStatus.textContent = '🔴 Desconectado';
                mobileStatus.style.background = '#f8d7da';
            });
        });

        mobilePeer.on('error', (err) => {
            console.error('❌ Error del peer:', err);
            mobileStatus.textContent = '❌ Error: ' + err.type;
            mobileStatus.style.background = '#f8d7da';
        });
    })
    .catch((error) => {
        console.error('❌ Error de cámara:', error);
        mobileStatus.textContent = '❌ ' + error.message;
        mobileStatus.style.background = '#f8d7da';
        
        if (error.name === 'NotAllowedError') {
            mobileStatus.textContent = '❌ Permiso denegado. Permite la cámara en configuración.';
        }
    });
}

function enviarFrame(videoElement, connection) {
    if (!videoElement.videoWidth || !videoElement.videoHeight) return;

    try {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = videoElement.videoWidth;
        tempCanvas.height = videoElement.videoHeight;

        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(videoElement, 0, 0);

        const frameData = tempCanvas.toDataURL('image/jpeg', 0.6);

        connection.send({
            type: 'frame',
            frame: frameData,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('❌ Error enviando frame:', error);
    }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    log('🍕 Pizza Pentagon iniciado', 'success');
    log('📱 User Agent: ' + navigator.userAgent, 'info');
    log('🌐 URL: ' + window.location.href, 'info');

    const urlParams = new URLSearchParams(window.location.search);
    const remoteId = urlParams.get('remote');

    if (remoteId) {
        // Modo CELULAR
        log('📱 Detectado parámetro remote: ' + remoteId, 'info');
        inicializarCelular(remoteId);
    } else {
        // Modo COMPUTADOR - Esperar a que las librerías se carguen
        log('💻 Modo computador', 'info');
        updateStatus('⏳ Cargando librerías...', 'info');
        
        // Deshabilitar botones hasta que todo esté listo
        document.getElementById('generateQR').disabled = true;
        document.getElementById('testCamera').disabled = true;
        
        // Verificar cada 500ms si las librerías están listas
        const checkLibraries = setInterval(() => {
            if (typeof QRCode !== 'undefined' && typeof Peer !== 'undefined') {
                clearInterval(checkLibraries);
                log('✅ Librerías cargadas correctamente!', 'success');
                updateStatus('✅ Listo! Presiona "Generar QR Code"', 'success');
                
                // Habilitar botones
                document.getElementById('generateQR').disabled = false;
                document.getElementById('testCamera').disabled = false;
            }
        }, 500);
        
        // Timeout de 10 segundos
        setTimeout(() => {
            if (typeof QRCode === 'undefined' || typeof Peer === 'undefined') {
                clearInterval(checkLibraries);
                log('❌ Timeout: Librerías no se cargaron', 'error');
                updateStatus('❌ Error de carga. Recarga la página (F5)', 'error');
                alert('Las librerías tardaron mucho en cargar.\n\nPosibles soluciones:\n1. Recarga la página (F5)\n2. Verifica tu conexión a Internet\n3. Desactiva bloqueadores de anuncios');
            }
        }, 10000);
    }
});