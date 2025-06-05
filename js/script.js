// Script simplificado para la aplicación VR
console.log("🥽 Aplicación Web VR - Examen Tema 4 (Versión Simplificada)")

// Variables globales
let scene,
  camera,
  interactiveObjects = []
let isVRMode = false

// Colores para objetos
const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#FF6347",
  "#9ACD32",
  "#20B2AA",
  "#FFD700",
  "#FF69B4",
]

// Esperar a que A-Frame esté listo
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado, inicializando aplicación VR simplificada...")

  // Ocultar pantalla de carga
  setTimeout(() => {
    const loadingScreen = document.getElementById("loadingScreen")
    if (loadingScreen) {
      loadingScreen.style.opacity = "0"
      loadingScreen.style.transition = "opacity 1s ease-out"
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 1000)
    }
  }, 2000)

  // Inicializar cuando A-Frame esté listo
  const sceneEl = document.querySelector("a-scene")
  if (sceneEl.hasLoaded) {
    initializeVRApp()
  } else {
    sceneEl.addEventListener("loaded", initializeVRApp)
  }
})

function initializeVRApp() {
  console.log("🎮 Inicializando aplicación VR simplificada...")

  scene = document.querySelector("a-scene")
  camera = document.querySelector("#camera")

  // Obtener todos los objetos interactivos
  interactiveObjects = document.querySelectorAll(".interactive-object")
  console.log(`📦 ${interactiveObjects.length} objetos interactivos encontrados`)

  // Verificar si el modelo GLB se cargó
  checkBathroomModel()

  // Configurar eventos de interacción
  setupInteractionEvents()

  // Configurar eventos VR
  setupVREvents()

  // Configurar animaciones aleatorias
  setupRandomAnimations()

  console.log("✅ Aplicación VR simplificada inicializada correctamente")
}

function checkBathroomModel() {
  const bathroomModel = document.querySelector("#bathroom-scene")
  const bathroomEnvironment = document.querySelector("#bathroom-environment")

  // Intentar mostrar el modelo GLB después de 3 segundos
  setTimeout(() => {
    if (bathroomModel && bathroomModel.getAttribute("gltf-model")) {
      console.log("📦 Intentando cargar modelo GLB...")
      bathroomModel.setAttribute("visible", true)
      // Mantener el entorno básico visible también
      bathroomEnvironment.setAttribute("visible", true)
    } else {
      console.log("🏠 Usando entorno básico creado con primitivas")
      bathroomEnvironment.setAttribute("visible", true)
    }
  }, 3000)
}

function setupInteractionEvents() {
  console.log("🤚 Configurando eventos de interacción simplificados...")

  // Configurar interacciones para objetos
  interactiveObjects.forEach((object) => {
    // Evento de hover
    object.addEventListener("mouseenter", function () {
      console.log(`✨ Hover sobre objeto: ${this.id}`)

      // Efecto de escala
      this.setAttribute("animation__hover", {
        property: "scale",
        to: "1.3 1.3 1.3",
        dur: 300,
        easing: "easeOutQuad",
      })

      // Efecto de brillo
      const currentMaterial = this.getAttribute("material")
      this.setAttribute("material", {
        ...currentMaterial,
        emissive: "#FFFFFF",
        emissiveIntensity: 0.3,
      })
    })

    object.addEventListener("mouseleave", function () {
      // Volver al tamaño normal
      this.setAttribute("animation__hover", {
        property: "scale",
        to: "1 1 1",
        dur: 300,
        easing: "easeOutQuad",
      })

      // Quitar brillo
      const currentMaterial = this.getAttribute("material")
      this.setAttribute("material", {
        ...currentMaterial,
        emissive: "#000000",
        emissiveIntensity: 0,
      })
    })

    // Evento de click - hacer desaparecer el objeto
    object.addEventListener("click", function () {
      console.log(`🎯 Click en objeto: ${this.id} - Desapareciendo`)

      // Crear efecto de partículas antes de desaparecer
      createParticleExplosion(this.getAttribute("position"))

      // Hacer desaparecer el objeto con animación
      this.setAttribute("animation__disappear", {
        property: "scale",
        to: "0.01 0.01 0.01",
        dur: 500,
        easing: "easeInQuad",
      })

      this.setAttribute("animation__fade", {
        property: "material.opacity",
        to: "0",
        dur: 500,
        easing: "easeInQuad",
      })

      // Eliminar el objeto después de la animación
      setTimeout(() => {
        if (this.parentNode) {
          this.parentNode.removeChild(this)
        }
      }, 600)
    })
  })
}

function setupVREvents() {
  console.log("🥽 Configurando eventos VR...")

  const sceneEl = document.querySelector("a-scene")

  sceneEl.addEventListener("enter-vr", () => {
    console.log("🎮 Entrando en modo VR")
    isVRMode = true

    // Ocultar instrucciones en VR
    const instructions = document.getElementById("instructions")
    if (instructions) {
      instructions.style.display = "none"
    }

    // Activar hand tracking
    enableHandTracking()
  })

  sceneEl.addEventListener("exit-vr", () => {
    console.log("🖥️ Saliendo del modo VR")
    isVRMode = false

    // Mostrar instrucciones
    const instructions = document.getElementById("instructions")
    if (instructions) {
      instructions.style.display = "block"
    }
  })
}

function enableHandTracking() {
  console.log("👋 Activando hand tracking...")

  // Asegurarse de que las manos estén correctamente configuradas
  const leftHand = document.querySelector("#leftHand")
  const rightHand = document.querySelector("#rightHand")

  if (leftHand) {
    leftHand.setAttribute("hand-tracking-controls", {
      hand: "left",
      modelStyle: "highPoly",
    })
  }

  if (rightHand) {
    rightHand.setAttribute("hand-tracking-controls", {
      hand: "right",
      modelStyle: "highPoly",
    })
  }
}

function setupRandomAnimations() {
  console.log("🎭 Configurando animaciones aleatorias...")

  interactiveObjects.forEach((object) => {
    // Crear animación de rotación única para cada objeto
    const randomDuration = 3000 + Math.random() * 8000
    const randomX = Math.random() * 720
    const randomY = Math.random() * 720
    const randomZ = Math.random() * 720

    object.setAttribute("animation", {
      property: "rotation",
      to: `${randomX} ${randomY} ${randomZ}`,
      loop: true,
      dur: randomDuration,
      easing: "linear",
    })

    // Animación de flotación sutil
    const floatDuration = 2000 + Math.random() * 4000
    const floatHeight = 0.2 + Math.random() * 0.4

    object.setAttribute("animation__float", {
      property: "position.y",
      to: `+=${floatHeight}`,
      dur: floatDuration,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })
  })
}

function createParticleExplosion(position) {
  console.log("💥 Creando explosión de partículas")

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("a-sphere")
    particle.setAttribute("radius", 0.08)
    particle.setAttribute("material", {
      color: colors[Math.floor(Math.random() * colors.length)],
      transparent: true,
      opacity: 0.9,
      emissive: colors[Math.floor(Math.random() * colors.length)],
      emissiveIntensity: 0.5,
    })

    const offsetX = (Math.random() - 0.5) * 4
    const offsetY = Math.random() * 3
    const offsetZ = (Math.random() - 0.5) * 4

    particle.setAttribute("position", {
      x: position.x,
      y: position.y,
      z: position.z,
    })

    // Animación de explosión
    particle.setAttribute("animation", {
      property: "position",
      to: {
        x: position.x + offsetX,
        y: position.y + offsetY + 2,
        z: position.z + offsetZ,
      },
      dur: 1500,
      easing: "easeOutQuad",
    })

    // Animación de rotación
    particle.setAttribute("animation__spin", {
      property: "rotation",
      to: `${Math.random() * 720} ${Math.random() * 720} ${Math.random() * 720}`,
      dur: 1500,
      loop: true,
    })

    // Animación de desvanecimiento
    particle.setAttribute("animation__fade", {
      property: "material.opacity",
      from: 0.9,
      to: 0,
      dur: 1500,
    })

    scene.appendChild(particle)

    // Eliminar partícula después de la animación
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle)
      }
    }, 1600)
  }
}

// Función para verificar cuántos objetos quedan
function checkRemainingObjects() {
  const remainingObjects = document.querySelectorAll(".interactive-object")
  console.log(`🔢 Objetos restantes: ${remainingObjects.length}`)

  if (remainingObjects.length === 0) {
    console.log("🎉 ¡Todos los objetos han sido eliminados!")
    // Aquí podrías mostrar un mensaje de felicitación o reiniciar el juego
  }
}

// Exponer funciones para debugging
window.vrApp = {
  isVRMode: () => isVRMode,
  objectCount: () => document.querySelectorAll(".interactive-object").length,
  checkRemaining: checkRemainingObjects,
}

console.log("🚀 Script VR simplificado cargado")
console.log("💡 Haz click en los objetos para hacerlos desaparecer")
