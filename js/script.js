// Script simplificado y corregido para la aplicación VR
console.log('🥽 Aplicación Web VR - Examen Tema 4 iniciada');

// Variables globales
let scene, camera, interactiveObjects = [];
let isVRMode = false;
let colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#FF6347', '#9ACD32', '#20B2AA', '#FFD700', '#FF69B4'
];

// Esperar a que A-Frame esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando aplicación VR...');
    
    // Ocultar pantalla de carga
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 1s ease-out';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1000);
        }
    }, 2000);

    // Inicializar cuando A-Frame esté listo
    const sceneEl = document.querySelector('a-scene');
    if (sceneEl.hasLoaded) {
        initializeVRApp();
    } else {
        sceneEl.addEventListener('loaded', initializeVRApp);
    }
});

function initializeVRApp() {
    console.log('🎮 Inicializando aplicación VR...');
    
    scene = document.querySelector('a-scene');
    camera = document.querySelector('#camera');
    
    // Obtener todos los objetos interactivos
    interactiveObjects = document.querySelectorAll('.interactive-object');
    console.log(`📦 ${interactiveObjects.length} objetos interactivos encontrados`);
    
    // Verificar si el modelo GLB se cargó
    checkBathroomModel();
    
    // Configurar eventos de interacción
    setupInteractionEvents();
    
    // Configurar eventos VR
    setupVREvents();
    
    // Configurar animaciones aleatorias
    setupRandomAnimations();
    
    console.log('✅ Aplicación VR inicializada correctamente');
}

function checkBathroomModel() {
    const bathroomModel = document.querySelector('#bathroom-scene');
    const bathroomEnvironment = document.querySelector('#bathroom-environment');
    
    // Intentar mostrar el modelo GLB después de 3 segundos
    setTimeout(() => {
        if (bathroomModel && bathroomModel.getAttribute('gltf-model')) {
            console.log('📦 Intentando cargar modelo GLB...');
            bathroomModel.setAttribute('visible', true);
            // Ocultar el entorno básico si el modelo se carga
            bathroomEnvironment.setAttribute('visible', false);
        } else {
            console.log('🏠 Usando entorno básico creado con primitivas');
            bathroomEnvironment.setAttribute('visible', true);
        }
    }, 3000);
}

function setupInteractionEvents() {
    console.log('🤚 Configurando eventos de interacción...');
    
    interactiveObjects.forEach((object, index) => {
        // Evento de hover
        object.addEventListener('mouseenter', function() {
            console.log(`👆 Hover sobre ${this.id}`);
            
            // Efecto de escala
            this.setAttribute('animation__hover', {
                property: 'scale',
                to: '1.3 1.3 1.3',
                dur: 300,
                easing: 'easeOutQuad'
            });
            
            // Efecto de brillo
            const currentMaterial = this.getAttribute('material');
            this.setAttribute('material', {
                ...currentMaterial,
                emissive: '#FFFFFF',
                emissiveIntensity: 0.2
            });
        });
        
        object.addEventListener('mouseleave', function() {
            // Volver al tamaño normal
            this.setAttribute('animation__hover', {
                property: 'scale',
                to: '1 1 1',
                dur: 300,
                easing: 'easeOutQuad'
            });
            
            // Quitar brillo
            const currentMaterial = this.getAttribute('material');
            this.setAttribute('material', {
                ...currentMaterial,
                emissive: '#000000',
                emissiveIntensity: 0
            });
        });
        
        // Evento de click
        object.addEventListener('click', function() {
            console.log(`🎯 Objeto ${this.id} clickeado`);
            
            // Cambiar color aleatoriamente
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            this.setAttribute('material', 'color', randomColor);
            
            // Efecto de rotación rápida
            this.setAttribute('animation__click', {
                property: 'rotation',
                to: `${Math.random() * 720} ${Math.random() * 720} ${Math.random() * 720}`,
                dur: 1000,
                easing: 'easeOutBounce'
            });
            
            // Efecto de escala
            this.setAttribute('animation__clickScale', {
                property: 'scale',
                from: '1 1 1',
                to: '1.5 1.5 1.5',
                dur: 200,
                direction: 'alternate',
                loop: 2
            });
            
            // Crear efecto de partículas
            createSimpleParticleEffect(this.getAttribute('position'));
        });
    });
}

function setupVREvents() {
    console.log('🥽 Configurando eventos VR...');
    
    const sceneEl = document.querySelector('a-scene');
    
    sceneEl.addEventListener('enter-vr', function() {
        console.log('🎮 Entrando en modo VR');
        isVRMode = true;
        
        // Ocultar instrucciones en VR
        const instructions = document.getElementById('instructions');
        if (instructions) {
            instructions.style.display = 'none';
        }
    });
    
    sceneEl.addEventListener('exit-vr', function() {
        console.log('🖥️ Saliendo del modo VR');
        isVRMode = false;
        
        // Mostrar instrucciones
        const instructions = document.getElementById('instructions');
        if (instructions) {
            instructions.style.display = 'block';
        }
    });
}

function setupRandomAnimations() {
    console.log('🎭 Configurando animaciones aleatorias...');
    
    interactiveObjects.forEach((object, index) => {
        // Crear animación de rotación única para cada objeto
        const randomDuration = 3000 + Math.random() * 8000; // Entre 3 y 11 segundos
        const randomX = Math.random() * 720; // 0 a 720 grados
        const randomY = Math.random() * 720;
        const randomZ = Math.random() * 720;
        
        object.setAttribute('animation', {
            property: 'rotation',
            to: `${randomX} ${randomY} ${randomZ}`,
            loop: true,
            dur: randomDuration,
            easing: 'linear'
        });
        
        // Animación de flotación sutil
        const floatDuration = 2000 + Math.random() * 4000;
        const floatHeight = 0.1 + Math.random() * 0.3;
        
        object.setAttribute('animation__float', {
            property: 'position.y',
            to: `+=${floatHeight}`,
            dur: floatDuration,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
        });
    });
}

function createSimpleParticleEffect(position) {
    console.log('💫 Creando efecto de partículas simple');
    
    // Crear 3 partículas simples
    for (let i = 0; i < 3; i++) {
        const particle = document.createElement('a-sphere');
        particle.setAttribute('radius', 0.05);
        particle.setAttribute('material', {
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 0.8
        });
        
        const offsetX = (Math.random() - 0.5) * 1;
        const offsetY = Math.random() * 1;
        const offsetZ = (Math.random() - 0.5) * 1;
        
        particle.setAttribute('position', {
            x: position.x + offsetX,
            y: position.y + offsetY,
            z: position.z + offsetZ
        });
        
        // Animación de movimiento hacia arriba
        particle.setAttribute('animation', {
            property: 'position.y',
            to: position.y + 2,
            dur: 1500,
            easing: 'easeOutQuad'
        });
        
        // Animación de desvanecimiento
        particle.setAttribute('animation__fade', {
            property: 'material.opacity',
            from: 0.8,
            to: 0,
            dur: 1500
        });
        
        scene.appendChild(particle);
        
        // Eliminar partícula después de la animación
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1600);
    }
}

// Función para cambiar todos los colores aleatoriamente
function randomizeAllColors() {
    interactiveObjects.forEach(object => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        object.setAttribute('material', 'color', randomColor);
    });
}

// Función para resetear todos los objetos
function resetAllObjects() {
    interactiveObjects.forEach(object => {
        object.setAttribute('scale', '1 1 1');
        object.setAttribute('material', 'emissiveIntensity', 0);
    });
}

// Exponer funciones para debugging
window.vrApp = {
    randomizeColors: randomizeAllColors,
    resetObjects: resetAllObjects,
    isVRMode: () => isVRMode,
    objectCount: () => interactiveObjects.length
};

console.log('🚀 Script VR cargado y funcionando');
console.log('💡 Prueba: vrApp.randomizeColors() para cambiar todos los colores');
