// Registrar el plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Variables globales
let selectedCVType = '';
let formData = {
  name: '',
  email: '',
  phone: '',
  education: [{ institution: '', degree: '', year: '' }],
  experience: [{ company: '', position: '', duration: '', description: '' }],
  skills: []
};

// Elementos DOM
const sections = document.querySelectorAll(".story-section");
const progressBar = document.querySelector(".progress-bar-fill");
const steps = document.querySelectorAll(".progress-step");
const cvTypeCards = document.querySelectorAll('.cv-type-card');
const addEducationBtn = document.getElementById('add-education');
const addExperienceBtn = document.getElementById('add-experience');
const generateCVBtn = document.getElementById('generate-cv-btn');
const previewBtn = document.getElementById('preview-btn');
const processingIndicator = document.getElementById('processing-indicator');
const aiImprovements = document.getElementById('ai-improvements');
const downloadPDFBtn = document.getElementById('download-pdf');
const downloadDOCXBtn = document.getElementById('download-docx');

// 1) Configuración inicial y animaciones
// Reemplaza esta sección en tu script.js (aproximadamente líneas 45-87)

document.addEventListener('DOMContentLoaded', function() {
  // Posición de inicio: opacity:0, fuera de pantalla para cada textBlock e imageBlock
  sections.forEach((section) => {
    const textBlock = section.querySelector(".text-block");
    const imageBlock = section.querySelector(".image-block");
    gsap.set(textBlock, { opacity: 0, y: 30 });
    gsap.set(imageBlock, { opacity: 0, x: 30 });
  });

  // Animación de la primera sección inmediatamente
  if (sections[0]) {
    gsap
      .timeline()
      .to(sections[0], {
        // Opcional si se quiere animar el contenedor
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      })
      .to(
        sections[0].querySelector(".text-block"),
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out"
        },
        "-=0.3"
      )
      .to(
        sections[0].querySelector(".image-block"),
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out"
        },
        "-=0.3"
      );
  }

  // Animación de las secciones siguientes con ScrollTrigger - MODIFICADO
  sections.forEach((section, index) => {
    if (index > 0) {
      // Crear un timeline para esta sección
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%", // Cambiar para que empiece a animar antes de llegar a la sección
          end: "bottom 20%", // Cambiar para que termine después de pasar la sección
          toggleActions: "play none none reverse", // Cambiar a "play none none reverse" para mantener visible
          // markers: true, // Descomentar para depuración
        }
      });
      
      // Añadir animaciones al timeline
      tl.fromTo(
        section,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out"
        }
      )
      .fromTo(
        section.querySelector(".text-block"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out"
        },
        "-=0.3"
      )
      .fromTo(
        section.querySelector(".image-block"),
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out"
        },
        "-=0.3"
      );
    }
  });

  // Configuración inicial del tema
  applyTheme(0);
});
// 2) Gestión del desplazamiento global (para barra de progreso)
window.addEventListener("scroll", () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercentage = (window.scrollY / docHeight) * 100;
  const progressWidth = Math.min(100, Math.max(0, scrollPercentage));
  progressBar.style.width = `${progressWidth}%`;

  const currentSection = Math.floor(scrollPercentage / (100 / sections.length));
  steps.forEach((step, i) => {
    if (i <= currentSection) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });

  // Actualizar el tema según la sección actual
  applyTheme(currentSection);
});

// 3) Navegación por pasos de progreso (clic)
steps.forEach((step, index) => {
  step.addEventListener("click", () => {
    sections[index].scrollIntoView({ behavior: "smooth" });
    applyTheme(index);
    steps.forEach((s, i) => {
      if (i <= index) s.classList.add("active");
      else s.classList.remove("active");
    });
  });
});

// 4) Gestión de los temas / fondos
function applyTheme(sectionIndex) {
  const body = document.body;
  body.classList.remove("light-theme", "sunset-theme", "mid-theme", "dark-theme");
  
  if (sectionIndex === 0) {
    body.classList.add("light-theme");
  } else if (sectionIndex === 1) {
    body.classList.add("sunset-theme");
  } else if (sectionIndex === 2) {
    body.classList.add("mid-theme");
  } else if (sectionIndex === 3) {
    body.classList.add("dark-theme");
  }
}

// 5) Modal para imágenes ampliadas
const modalOverlay = document.querySelector(".modal-overlay");
const modalImage = document.querySelector(".modal-image");
const modalClose = document.querySelector(".modal-close");

document.querySelectorAll(".image-placeholder").forEach((img) => {
  img.addEventListener("click", () => {
    modalImage.src = img.src;
    modalOverlay.style.display = "flex";
    gsap
      .timeline()
      .to(modalOverlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(
        modalImage,
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)"
        },
        "-=0.1"
      )
      .to(
        modalClose,
        {
          opacity: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        },
        "-=0.3"
      );
  });
});

function closeModal() {
  gsap
    .timeline()
    .to(modalClose, {
      opacity: 0,
      rotation: -180,
      duration: 0.3,
      ease: "power2.in"
    })
    .to(
      modalImage,
      {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      },
      "-=0.2"
    )
    .to(
      modalOverlay,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          modalOverlay.style.display = "none";
        }
      },
      "-=0.2"
    );
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// 6) Funcionalidad específica para el generador de CV

// Selección de tipo de CV
cvTypeCards.forEach(card => {
  card.addEventListener('click', () => {
    selectedCVType = card.getAttribute('data-type');
    console.log(`Tipo de CV seleccionado: ${selectedCVType}`);
    
    // Navegar a la siguiente sección
    sections[1].scrollIntoView({ behavior: "smooth" });
    
    // Forzar la visibilidad después de un breve retraso
    setTimeout(() => {
      gsap.to(sections[1], { opacity: 1, duration: 0.3 });
      gsap.to(sections[1].querySelector(".text-block"), { opacity: 1, y: 0, duration: 0.3 });
      gsap.to(sections[1].querySelector(".image-block"), { opacity: 1, x: 0, duration: 0.3 });
      
      // Actualizar pasos activos
      steps.forEach((step, i) => {
        if (i <= 1) step.classList.add("active");
        else step.classList.remove("active");
      });
      
      // Actualizar tema
      applyTheme(1);
    }, 500);
  });
});

// Añadir entrada de educación
addEducationBtn.addEventListener('click', () => {
  const educationContainer = document.getElementById('education-container');
  const newEntry = document.createElement('div');
  newEntry.classList.add('form-subgroup', 'education-entry');
  newEntry.innerHTML = `
    <input type="text" name="institution" placeholder="Nombre de la Institución">
    <input type="text" name="degree" placeholder="Título/Certificado">
    <input type="text" name="year" placeholder="Año">
    <button type="button" class="remove-btn">Eliminar</button>
  `;
  educationContainer.appendChild(newEntry);
  
  // Añadir funcionalidad al botón de eliminar
  const removeBtn = newEntry.querySelector('.remove-btn');
  removeBtn.addEventListener('click', () => {
    educationContainer.removeChild(newEntry);
  });
});

// Añadir entrada de experiencia
addExperienceBtn.addEventListener('click', () => {
  const experienceContainer = document.getElementById('experience-container');
  const newEntry = document.createElement('div');
  newEntry.classList.add('form-subgroup', 'experience-entry');
  newEntry.innerHTML = `
    <input type="text" name="company" placeholder="Empresa">
    <input type="text" name="position" placeholder="Puesto">
    <input type="text" name="duration" placeholder="Duración (ej. 2019-2022)">
    <textarea name="description" placeholder="Descripción del trabajo" rows="3"></textarea>
    <button type="button" class="remove-btn">Eliminar</button>
  `;
  experienceContainer.appendChild(newEntry);
  
  // Añadir funcionalidad al botón de eliminar
  const removeBtn = newEntry.querySelector('.remove-btn');
  removeBtn.addEventListener('click', () => {
    experienceContainer.removeChild(newEntry);
  });
});

// Recopilar datos del formulario
function collectFormData() {
  formData.name = document.querySelector('input[name="name"]').value;
  formData.email = document.querySelector('input[name="email"]').value;
  formData.phone = document.querySelector('input[name="phone"]').value;
  
  // Recopilar datos de educación
  formData.education = [];
  document.querySelectorAll('.education-entry').forEach(entry => {
    const educationItem = {
      institution: entry.querySelector('input[name="institution"]').value,
      degree: entry.querySelector('input[name="degree"]').value,
      year: entry.querySelector('input[name="year"]').value
    };
    formData.education.push(educationItem);
  });
  
  // Recopilar datos de experiencia
  formData.experience = [];
  document.querySelectorAll('.experience-entry').forEach(entry => {
    const experienceItem = {
      company: entry.querySelector('input[name="company"]').value,
      position: entry.querySelector('input[name="position"]').value,
      duration: entry.querySelector('input[name="duration"]').value,
      description: entry.querySelector('textarea[name="description"]').value
    };
    formData.experience.push(experienceItem);
  });
  
  // Recopilar habilidades (separadas por comas)
  const skillsInput = document.querySelector('textarea[name="skills"]').value;
  formData.skills = skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
  
  console.log('Datos recopilados:', formData);
  return formData;
}

// Generar CV con IA
// Reemplaza esta sección en el archivo script.js
// Busca el evento del botón generateCVBtn y reemplázalo con este código

// Reemplaza esta línea en tu archivo script.js:
// generateCVBtn.addEventListener

// Con este código completo:
generateCVBtn.addEventListener('click', async () => {
  // Recopilar datos del formulario
  collectFormData();
  
  // Validación básica
  if (!formData.name || !formData.email) {
    alert('Por favor, completa al menos el nombre y email');
    return;
  }
  
  // Navegar a la sección de procesamiento IA
  sections[2].scrollIntoView({ behavior: "smooth" });
  
  // Forzar la visibilidad después de un breve retraso
  setTimeout(() => {
    gsap.to(sections[2], { opacity: 1, duration: 0.3 });
    gsap.to(sections[2].querySelector(".text-block"), { opacity: 1, y: 0, duration: 0.3 });
    gsap.to(sections[2].querySelector(".image-block"), { opacity: 1, x: 0, duration: 0.3 });
    
    // Actualizar pasos activos
    steps.forEach((step, i) => {
      if (i <= 2) step.classList.add("active");
      else step.classList.remove("active");
    });
    
    // Actualizar tema
    applyTheme(2);
  }, 500);
  
  // Mostrar indicador de procesamiento
  processingIndicator.classList.remove('hidden');
  aiImprovements.classList.add('hidden');
  previewBtn.classList.add('hidden');
  
  // Llamar a la API de Gemini
  try {
    // Crear un prompt adecuado basado en los datos del formulario y el tipo de CV
    const prompt = crearPromptParaGemini(formData, selectedCVType);
    
    // Realizar la llamada a la API
    const respuestaIA = await llamarGeminiAPI(prompt);
    
    // Procesar la respuesta
    procesarRespuestaGemini(respuestaIA);
    
    // Mostrar los resultados
    processingIndicator.classList.add('hidden');
    aiImprovements.classList.remove('hidden');
    previewBtn.classList.remove('hidden');
    
  } catch (error) {
    console.error('Error al procesar con Gemini:', error);
    
    // Mostrar un mensaje de error al usuario
    processingIndicator.classList.add('hidden');
    document.getElementById('ai-summary').textContent = 
      'Hubo un error al procesar tu CV. Por favor, intenta nuevamente.';
    aiImprovements.classList.remove('hidden');
  }
});
  
  // Función para crear el prompt adecuado para Gemini
 // Función mejorada para crear el prompt para Gemini
function crearPromptParaGemini(datos, tipoCV) {
    // Convertir los datos del formulario en un texto para el prompt
    const educacionTexto = datos.education
      .map(edu => `${edu.degree} en ${edu.institution} (${edu.year})`)
      .join('. ');
    
    const experienciaTexto = datos.experience
      .map(exp => `${exp.position} en ${exp.company} (${exp.duration}): ${exp.description}`)
      .join('. ');
    
    const habilidadesTexto = datos.skills.join(', ');
    
    // Crear un prompt específico según el tipo de CV
    let instruccionesEspecificas = '';
    
    switch(tipoCV) {
      case 'tech':
        instruccionesEspecificas = 'Enfoca el perfil en habilidades técnicas y logros cuantificables. Utiliza términos técnicos relevantes y destaca proyectos tecnológicos.';
        break;
      case 'business':
        instruccionesEspecificas = 'Enfoca el perfil en habilidades de gestión, liderazgo y resultados de negocio. Utiliza lenguaje orientado a resultados y métricas de éxito.';
        break;
      case 'creative':
        instruccionesEspecificas = 'Enfoca el perfil en habilidades creativas, portfolio y capacidad de innovación. Utiliza lenguaje que destaque originalidad y pensamiento lateral.';
        break;
      case 'healthcare':
        instruccionesEspecificas = 'Enfoca el perfil en habilidades clínicas, empatía y atención al paciente. Utiliza terminología médica apropiada y destaca logros en el ámbito sanitario.';
        break;
      default:
        instruccionesEspecificas = 'Crea un perfil profesional genérico destacando las principales fortalezas y logros.';
    }
    
    // Construir el prompt completo con énfasis en el formato de respuesta
    return `Actúa como un experto en recursos humanos y redacción de currículum vitae.
    
  Datos del candidato:
  - Nombre: ${datos.name}
  - Educación: ${educacionTexto}
  - Experiencia: ${experienciaTexto}
  - Habilidades: ${habilidadesTexto}
  
  Instrucciones:
  ${instruccionesEspecificas}
  
  GENERA SÓLO UN OBJETO JSON VÁLIDO con la siguiente estructura exacta (sin texto adicional antes o después):
  
  {
    "resumen": "Escribe aquí un resumen profesional impactante de 3-4 líneas que destaque las fortalezas y experiencia del candidato",
    "experienciasMejoradas": [
      {
        "indice": 0,
        "descripcionMejorada": "Escribe aquí la primera experiencia mejorada"
      },
      {
        "indice": 1,
        "descripcionMejorada": "Escribe aquí la segunda experiencia mejorada"
      }
    ],
    "habilidadesOrdenadas": ["Habilidad1", "Habilidad2", "Habilidad3"]
  }
  
  IMPORTANTE: 
  1. Asegúrate de que tu respuesta sea SOLAMENTE el objeto JSON válido.
  2. No incluyas comillas triples, ni la palabra 'json' u otros marcadores antes o después del JSON.
  3. El JSON debe tener exactamente la estructura mostrada arriba.
  4. Incluye solo tantos objetos en "experienciasMejoradas" como existan en los datos originales.
  5. Usa sólo las habilidades originales en "habilidadesOrdenadas", ordenadas por relevancia.`;
  }
  
  // Función para llamar a la API de Gemini
  async function llamarGeminiAPI(prompt) {
    // Reemplaza 'TU_API_KEY' con tu clave API real de Gemini
    const API_KEY = 'AIzaSyD3LUr6ntBBvi54YpPeMjjnAz9pr94u0IM';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    const datos = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };
    
    const respuesta = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });
    
    if (!respuesta.ok) {
      throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`);
    }
    
    return await respuesta.json();
  }
  
  // Función para procesar la respuesta de Gemini
 // Función mejorada para procesar la respuesta de Gemini
function procesarRespuestaGemini(respuesta) {
    try {
      // Extraer el texto generado por la IA
      const textoGenerado = respuesta.candidates[0].content.parts[0].text;
      console.log("Respuesta de Gemini:", textoGenerado);
      
      let datosJSON;
      
      // Intentar encontrar y extraer un JSON válido de la respuesta
      // Buscar contenido entre llaves {} que podría ser JSON
      const jsonMatch = textoGenerado.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          // Intentar analizar el JSON encontrado
          datosJSON = JSON.parse(jsonMatch[0]);
          console.log("JSON extraído con éxito:", datosJSON);
        } catch (jsonError) {
          console.error("Error al analizar el JSON extraído:", jsonError);
          // Continuar con el flujo alternativo
          throw new Error("No se pudo analizar el JSON");
        }
      } else {
        // Si no se encuentra un formato JSON, extraer información mediante análisis de texto
        console.log("No se encontró formato JSON, procesando como texto plano");
        throw new Error("No se encontró formato JSON");
      }
      
      // Si llegamos aquí, tenemos un JSON válido
      // Actualizar el resumen en la interfaz
      if (datosJSON.resumen) {
        document.getElementById('ai-summary').textContent = datosJSON.resumen;
        formData.aiSummary = datosJSON.resumen;
      } else {
        // Buscar otras posibles claves para el resumen
        const posiblesClaves = ['resumen', 'summary', 'profesionalSummary', 'perfil', 'profile'];
        for (const clave of posiblesClaves) {
          if (datosJSON[clave]) {
            document.getElementById('ai-summary').textContent = datosJSON[clave];
            formData.aiSummary = datosJSON[clave];
            break;
          }
        }
      }
      
      // Mejorar las descripciones de experiencia si están disponibles
      if (datosJSON.experienciasMejoradas) {
        datosJSON.experienciasMejoradas.forEach(mejora => {
          if (formData.experience[mejora.indice]) {
            formData.experience[mejora.indice].description = mejora.descripcionMejorada;
          }
        });
      }
      
      // Actualizar el orden de las habilidades si están disponibles
      if (datosJSON.habilidadesOrdenadas) {
        formData.skills = datosJSON.habilidadesOrdenadas;
      }
      
    } catch (error) {
      console.error('Error al procesar la respuesta de Gemini:', error);
      
      // Extracción manual de datos cuando falla el formato JSON
      try {
        const textoGenerado = respuesta.candidates[0].content.parts[0].text;
        
        // Extraer resumen (buscando patrones comunes)
        let resumen = "";
        const resumenMatch = textoGenerado.match(/(?:Resumen|Summary|Perfil)(?:\s*profesional)?:\s*([\s\S]*?)(?:\n\n|\n(?=[A-Z]))/i);
        if (resumenMatch && resumenMatch[1]) {
          resumen = resumenMatch[1].trim();
        } else {
          // Tomar los primeros párrafos como resumen
          const parrafos = textoGenerado.split('\n\n');
          if (parrafos.length > 0) {
            resumen = parrafos[0].trim();
          }
        }
        
        if (resumen) {
          document.getElementById('ai-summary').textContent = resumen;
          formData.aiSummary = resumen;
        } else {
          // Resumen de respaldo
          const fallbackSummary = `Profesional con experiencia en ${formData.skills.slice(0, 3).join(', ')}. Con formación en ${formData.education[0]?.degree || 'educación superior'} y trayectoria en ${formData.experience[0]?.position || 'roles profesionales'}.`;
          document.getElementById('ai-summary').textContent = fallbackSummary;
          formData.aiSummary = fallbackSummary;
        }
      } catch (extractionError) {
        console.error('Error en la extracción manual:', extractionError);
        
        // Utilizar un resumen genérico como último recurso
        const fallbackSummary = `Profesional con experiencia en ${formData.skills.slice(0, 3).join(', ')}. Con formación en ${formData.education[0]?.degree || 'educación superior'} y trayectoria en ${formData.experience[0]?.position || 'roles profesionales'}.`;
        document.getElementById('ai-summary').textContent = fallbackSummary;
        formData.aiSummary = fallbackSummary;
      }
    }
  }

// Previsualizar CV
previewBtn.addEventListener('click', () => {
  // Navegar a la sección de previsualización
  sections[3].scrollIntoView({ behavior: "smooth" });
  
  // Llenar la vista previa con los datos
  document.getElementById('preview-name').textContent = formData.name;
  document.getElementById('preview-email').textContent = formData.email;
  document.getElementById('preview-phone').textContent = formData.phone;
  document.getElementById('preview-summary').textContent = document.getElementById('ai-summary').textContent;
  
  // Experiencia
  const experienceContainer = document.getElementById('preview-experience');
  experienceContainer.innerHTML = '';
  formData.experience.forEach(exp => {
    const expItem = document.createElement('div');
    expItem.classList.add('experience-item');
    expItem.innerHTML = `
      <div class="exp-header">
        <h5>${exp.position}</h5>
        <p>${exp.company} | ${exp.duration}</p>
      </div>
      <p>${exp.description}</p>
    `;
    experienceContainer.appendChild(expItem);
  });
  
  // Educación
  const educationContainer = document.getElementById('preview-education');
  educationContainer.innerHTML = '';
  formData.education.forEach(edu => {
    const eduItem = document.createElement('div');
    eduItem.classList.add('education-item');
    eduItem.innerHTML = `
      <h5>${edu.degree}</h5>
      <p>${edu.institution} | ${edu.year}</p>
    `;
    educationContainer.appendChild(eduItem);
  });
  
  // Habilidades
  const skillsContainer = document.getElementById('preview-skills');
  skillsContainer.innerHTML = '';
  formData.skills.forEach(skill => {
    const skillTag = document.createElement('span');
    skillTag.classList.add('skill-tag');
    skillTag.textContent = skill;
    skillsContainer.appendChild(skillTag);
  });
});

// Simulación de descarga del CV
// Reemplaza tu función de generación de PDF con esta versión que incluye múltiples estilos

downloadPDFBtn.addEventListener('click', () => {
    // Mostrar mensaje de carga
    const mensaje = document.createElement('div');
    mensaje.textContent = 'Generando PDF...';
    mensaje.style.position = 'fixed';
    mensaje.style.top = '50%';
    mensaje.style.left = '50%';
    mensaje.style.transform = 'translate(-50%, -50%)';
    mensaje.style.padding = '15px 25px';
    mensaje.style.backgroundColor = '#333';
    mensaje.style.color = 'white';
    mensaje.style.borderRadius = '8px';
    mensaje.style.zIndex = '9999';
    document.body.appendChild(mensaje);
    
    try {
      // Crear un nuevo documento PDF, A4 = 210 x 297 mm
      const doc = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
        
      // Configurar el estilo según la selección
      const style = getStyleConfig(selectedStyle);
      
      // Aplicar fondo
      if (style.background) {
        doc.setFillColor(style.background.r, style.background.g, style.background.b);
        doc.rect(0, 0, 210, 297, 'F');
      }
      
      // Aplicar elementos de diseño específicos según el estilo
      applyStyleElements(doc, style);
      
      // Añadir nombre
      doc.setFont(style.titleFont.name, style.titleFont.style);
      doc.setFontSize(style.titleFont.size);
      doc.setTextColor(style.titleFont.color.r, style.titleFont.color.g, style.titleFont.color.b);
      
      const nameWidth = doc.getStringUnitWidth(formData.name) * style.titleFont.size / doc.internal.scaleFactor;
      const nameX = style.centered ? (210 - nameWidth) / 2 : style.margin;
      doc.text(formData.name, nameX, style.namePositionY);
      
      // Añadir información de contacto
      doc.setFont(style.textFont.name, style.textFont.style);
      doc.setFontSize(style.contactFont.size);
      doc.setTextColor(style.contactFont.color.r, style.contactFont.color.g, style.contactFont.color.b);
      const contactInfo = `${formData.email} | ${formData.phone}`;
      const contactWidth = doc.getStringUnitWidth(contactInfo) * style.contactFont.size / doc.internal.scaleFactor;
      const contactX = style.centered ? (210 - contactWidth) / 2 : style.margin;
      doc.text(contactInfo, contactX, style.contactPositionY);
      
      // Variable para la posición Y actual
      let currentY = style.firstSectionY;
      
      // Función para añadir secciones
      function addSection(title, y) {
        doc.setFont(style.sectionFont.name, style.sectionFont.style);
        doc.setFontSize(style.sectionFont.size);
        doc.setTextColor(style.sectionFont.color.r, style.sectionFont.color.g, style.sectionFont.color.b);
        doc.text(title, style.margin, y);
        
        if (style.sectionLine) {
          doc.setDrawColor(style.sectionLine.color.r, style.sectionLine.color.g, style.sectionLine.color.b);
          doc.setLineWidth(style.sectionLine.width);
          doc.line(style.margin, y + style.sectionLine.offsetY, 210 - style.margin, y + style.sectionLine.offsetY);
        }
        
        return y + style.sectionSpacing;
      }
      
      // Función para añadir párrafos con posible salto de página
      function addParagraph(text, x, y, fontSize = style.textFont.size, maxWidth = 210 - (style.margin * 2)) {
        doc.setFont(style.textFont.name, style.textFont.style);
        doc.setFontSize(fontSize);
        doc.setTextColor(style.textFont.color.r, style.textFont.color.g, style.textFont.color.b);
        
        // Dividir texto en líneas
        const lines = doc.splitTextToSize(text, maxWidth);
        
        // Verificar si necesitamos una nueva página
        if (y + lines.length * (fontSize * 0.35) > 280) {
          doc.addPage();
          y = 20; // Reiniciar Y en la nueva página
          
          // Replicar el fondo en la nueva página si el estilo lo tiene
          if (style.background) {
            doc.setFillColor(style.background.r, style.background.g, style.background.b);
            doc.rect(0, 0, 210, 297, 'F');
          }
        }
        
        // Añadir texto
        doc.text(lines, x, y);
        
        // Devolver nueva posición Y
        return y + lines.length * (fontSize * 0.35) + style.paragraphSpacing;
      }
      
      // Añadir resumen profesional
      currentY = addSection('RESUMEN PROFESIONAL', currentY);
      currentY = addParagraph(
        formData.aiSummary || 'Profesional con experiencia en el sector',
        style.margin,
        currentY
      );
      
      // Añadir experiencia profesional
      currentY = addSection('EXPERIENCIA PROFESIONAL', currentY);
      
      // Añadir cada experiencia
      formData.experience.forEach(exp => {
        doc.setFont(style.subtitleFont.name, style.subtitleFont.style);
        doc.setFontSize(style.subtitleFont.size);
        doc.setTextColor(style.subtitleFont.color.r, style.subtitleFont.color.g, style.subtitleFont.color.b);
        currentY += style.itemSpacing;
        doc.text(exp.position, style.margin, currentY);
        currentY += style.itemDetailSpacing;
        
        doc.setFont(style.highlightFont.name, style.highlightFont.style);
        doc.setFontSize(style.highlightFont.size);
        doc.setTextColor(style.highlightFont.color.r, style.highlightFont.color.g, style.highlightFont.color.b);
        doc.text(`${exp.company} | ${exp.duration}`, style.margin, currentY);
        currentY += style.itemDetailSpacing;
        
        currentY = addParagraph(exp.description, style.margin, currentY);
        currentY += style.itemSpacing;
      });
      
      // Añadir educación
      currentY = addSection('EDUCACIÓN', currentY);
      
      // Añadir cada formación
      formData.education.forEach(edu => {
        doc.setFont(style.subtitleFont.name, style.subtitleFont.style);
        doc.setFontSize(style.subtitleFont.size);
        doc.setTextColor(style.subtitleFont.color.r, style.subtitleFont.color.g, style.subtitleFont.color.b);
        currentY += style.itemSpacing;
        doc.text(edu.degree, style.margin, currentY);
        currentY += style.itemDetailSpacing;
        
        doc.setFont(style.highlightFont.name, style.highlightFont.style);
        doc.setFontSize(style.highlightFont.size);
        doc.setTextColor(style.highlightFont.color.r, style.highlightFont.color.g, style.highlightFont.color.b);
        doc.text(`${edu.institution} | ${edu.year}`, style.margin, currentY);
        currentY += style.itemSpacing;
      });
      
      // Añadir habilidades
      currentY = addSection('HABILIDADES', currentY);
      currentY += style.itemSpacing;
      
      // Implementar lista de habilidades según el estilo
      if (style.skillsStyle === 'bullets') {
        // Estilo con viñetas
        formData.skills.forEach(skill => {
          const bulletY = currentY;
          
          // Dibujar viñeta
          if (style.bullet.type === 'circle') {
            doc.setDrawColor(style.bullet.color.r, style.bullet.color.g, style.bullet.color.b);
            doc.setFillColor(style.bullet.color.r, style.bullet.color.g, style.bullet.color.b);
            doc.circle(style.margin + 2, bulletY - 1.5, 1.5, 'F');
          } else if (style.bullet.type === 'square') {
            doc.setDrawColor(style.bullet.color.r, style.bullet.color.g, style.bullet.color.b);
            doc.setFillColor(style.bullet.color.r, style.bullet.color.g, style.bullet.color.b);
            doc.rect(style.margin, bulletY - 3, 3, 3, 'F');
          } else {
            // Viñeta de texto
            doc.setFont(style.textFont.name, style.textFont.style);
            doc.setFontSize(style.textFont.size);
            doc.setTextColor(style.bullet.color.r, style.bullet.color.g, style.bullet.color.b);
            doc.text('•', style.margin, bulletY);
          }
          
          // Añadir texto de la habilidad
          doc.setFont(style.textFont.name, style.textFont.style);
          doc.setFontSize(style.textFont.size);
          doc.setTextColor(style.textFont.color.r, style.textFont.color.g, style.textFont.color.b);
          doc.text(skill, style.margin + style.bullet.spacing, bulletY);
          
          currentY += style.bullet.lineHeight;
        });
      } else {
        // Estilo en línea
        const habilidadesText = formData.skills.join(', ');
        currentY = addParagraph(habilidadesText, style.margin, currentY);
      }
      
      // Guardar y descargar el PDF
      doc.save(`${formData.name.replace(/\s+/g, '_')}_CV.pdf`);
      
      // Eliminar mensaje de carga
      document.body.removeChild(mensaje);
      
      // Mensaje de éxito
      const mensajeExito = document.createElement('div');
      mensajeExito.textContent = '¡PDF descargado con éxito!';
      mensajeExito.style.position = 'fixed';
      mensajeExito.style.top = '50%';
      mensajeExito.style.left = '50%';
      mensajeExito.style.transform = 'translate(-50%, -50%)';
      mensajeExito.style.padding = '15px 25px';
      mensajeExito.style.backgroundColor = '#4CAF50';
      mensajeExito.style.color = 'white';
      mensajeExito.style.borderRadius = '8px';
      mensajeExito.style.zIndex = '9999';
      document.body.appendChild(mensajeExito);
      
      // Eliminar mensaje de éxito después de 2 segundos
      setTimeout(() => {
        document.body.removeChild(mensajeExito);
      }, 2000);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      
      // Eliminar mensaje de carga
      document.body.removeChild(mensaje);
      
      // Mensaje de error
      const mensajeError = document.createElement('div');
      mensajeError.textContent = 'Error al generar el PDF. Intenta nuevamente.';
      mensajeError.style.position = 'fixed';
      mensajeError.style.top = '50%';
      mensajeError.style.left = '50%';
      mensajeError.style.transform = 'translate(-50%, -50%)';
      mensajeError.style.padding = '15px 25px';
      mensajeError.style.backgroundColor = '#F44336';
      mensajeError.style.color = 'white';
      mensajeError.style.borderRadius = '8px';
      mensajeError.style.zIndex = '9999';
      document.body.appendChild(mensajeError);
      
      // Eliminar mensaje de error después de 3 segundos
      setTimeout(() => {
        document.body.removeChild(mensajeError);
      }, 3000);
    }
  });
  
  // Función para aplicar elementos de diseño específicos según el estilo
  function applyStyleElements(doc, style) {
    if (!style.elements) return;
    
    style.elements.forEach(element => {
      switch (element.type) {
        case 'rectangle':
          doc.setFillColor(element.color.r, element.color.g, element.color.b);
          doc.rect(element.x, element.y, element.width, element.height, 'F');
          break;
        case 'line':
          doc.setDrawColor(element.color.r, element.color.g, element.color.b);
          doc.setLineWidth(element.width);
          doc.line(element.startX, element.startY, element.endX, element.endY);
          break;
        case 'circle':
          doc.setFillColor(element.color.r, element.color.g, element.color.b);
          doc.circle(element.x, element.y, element.radius, 'F');
          break;
      }
    });
  }
  
  // Función para obtener la configuración de estilo según la selección
  function getStyleConfig(styleName) {
    const styles = {
      // Estilo profesional (azul oscuro con dorado) - el original
      profesional: {
        background: { r: 44, g: 62, b: 80 }, // #2c3e50
        margin: 20,
        centered: true,
        namePositionY: 20,
        contactPositionY: 30,
        firstSectionY: 45,
        sectionSpacing: 10,
        paragraphSpacing: 5,
        itemSpacing: 5,
        itemDetailSpacing: 5,
        titleFont: {
          name: 'helvetica',
          style: 'bold',
          size: 24,
          color: { r: 241, g: 196, b: 15 } // #f1c40f
        },
        contactFont: {
          name: 'helvetica',
          style: 'normal',
          size: 12,
          color: { r: 255, g: 255, b: 255 } // blanco
        },
        sectionFont: {
          name: 'helvetica',
          style: 'bold',
          size: 16,
          color: { r: 241, g: 196, b: 15 } // #f1c40f
        },
        subtitleFont: {
          name: 'helvetica',
          style: 'bold',
          size: 14,
          color: { r: 255, g: 255, b: 255 } // blanco
        },
        highlightFont: {
          name: 'helvetica',
          style: 'italic',
          size: 12,
          color: { r: 255, g: 255, b: 255 } // blanco
        },
        textFont: {
          name: 'helvetica',
          style: 'normal',
          size: 12,
          color: { r: 255, g: 255, b: 255 } // blanco
        },
        sectionLine: {
          color: { r: 241, g: 196, b: 15 }, // #f1c40f
          width: 0.5,
          offsetY: 2
        },
        skillsStyle: 'bullets',
        bullet: {
          type: 'circle',
          color: { r: 241, g: 196, b: 15 }, // #f1c40f
          spacing: 8,
          lineHeight: 8
        }
      },
      
      // Estilo minimalista (blanco y negro)
      minimalista: {
        background: { r: 255, g: 255, b: 255 }, // blanco
        margin: 20,
        centered: false,
        namePositionY: 30,
        contactPositionY: 40,
        firstSectionY: 60,
        sectionSpacing: 12,
        paragraphSpacing: 6,
        itemSpacing: 6,
        itemDetailSpacing: 6,
        titleFont: {
          name: 'helvetica',
          style: 'bold',
          size: 26,
          color: { r: 40, g: 40, b: 40 } // casi negro
        },
        contactFont: {
          name: 'helvetica',
          style: 'normal',
          size: 11,
          color: { r: 100, g: 100, b: 100 } // gris
        },
        sectionFont: {
          name: 'helvetica',
          style: 'bold',
          size: 14,
          color: { r: 0, g: 0, b: 0 } // negro
        },
        subtitleFont: {
          name: 'helvetica',
          style: 'bold',
          size: 12,
          color: { r: 50, g: 50, b: 50 } // gris oscuro
        },
        highlightFont: {
          name: 'helvetica',
          style: 'italic',
          size: 11,
          color: { r: 100, g: 100, b: 100 } // gris
        },
        textFont: {
          name: 'helvetica',
          style: 'normal',
          size: 11,
          color: { r: 50, g: 50, b: 50 } // gris oscuro
        },
        sectionLine: {
          color: { r: 200, g: 200, b: 200 }, // gris claro
          width: 0.5,
          offsetY: 2
        },
        skillsStyle: 'inline',
        elements: [
          {
            type: 'line',
            color: { r: 50, g: 50, b: 50 },
            width: 2,
            startX: 20,
            startY: 50,
            endX: 190,
            endY: 50
          }
        ]
      },
      
      // Estilo creativo (púrpura y amarillo)
      creativo: {
        background: { r: 106, g: 17, b: 203 }, // #6a11cb
        margin: 20,
        centered: true,
        namePositionY: 25,
        contactPositionY: 35,
        firstSectionY: 65,
        sectionSpacing: 15,
        paragraphSpacing: 6,
        itemSpacing: 8,
        itemDetailSpacing: 6,
        titleFont: {
          name: 'helvetica',
          style: 'bold',
          size: 30,
          color: { r: 255, g: 204, b: 0 } // #ffcc00
        },
        contactFont: {
            name: 'helvetica',
            style: 'normal',
            size: 12,
            color: { r: 255, g: 255, b: 255 } // blanco
          },
          sectionFont: {
            name: 'helvetica',
            style: 'bold',
            size: 18,
            color: { r: 255, g: 204, b: 0 } // #ffcc00
          },
          subtitleFont: {
            name: 'helvetica',
            style: 'bold',
            size: 14,
            color: { r: 255, g: 255, b: 255 } // blanco
          },
          highlightFont: {
            name: 'helvetica',
            style: 'italic',
            size: 12,
            color: { r: 255, g: 204, b: 0 } // #ffcc00
          },
          textFont: {
            name: 'helvetica',
            style: 'normal',
            size: 12,
            color: { r: 255, g: 255, b: 255 } // blanco
          },
          sectionLine: {
            color: { r: 255, g: 204, b: 0 }, // #ffcc00
            width: 1,
            offsetY: 3
          },
          skillsStyle: 'bullets',
          bullet: {
            type: 'square',
            color: { r: 255, g: 204, b: 0 }, // #ffcc00
            spacing: 8,
            lineHeight: 8
          },
          elements: [
            {
              type: 'circle',
              color: { r: 255, g: 255, b: 255, a: 0.1 },
              x: 150,
              y: 100,
              radius: 50
            },
            {
              type: 'circle',
              color: { r: 255, g: 255, b: 255, a: 0.1 },
              x: 50,
              y: 200,
              radius: 30
            }
          ]
        },
        
        // Estilo ejecutivo (gris y azul)
        ejecutivo: {
          background: { r: 255, g: 255, b: 255 }, // blanco
          margin: 20,
          centered: false,
          namePositionY: 40,
          contactPositionY: 50,
          firstSectionY: 80,
          sectionSpacing: 12,
          paragraphSpacing: 6,
          itemSpacing: 6,
          itemDetailSpacing: 6,
          titleFont: {
            name: 'helvetica',
            style: 'bold',
            size: 24,
            color: { r: 52, g: 73, b: 94 } // #34495e
          },
          contactFont: {
            name: 'helvetica',
            style: 'normal',
            size: 11,
            color: { r: 52, g: 73, b: 94 } // #34495e
          },
          sectionFont: {
            name: 'helvetica',
            style: 'bold',
            size: 14,
            color: { r: 52, g: 73, b: 94 } // #34495e
          },
          subtitleFont: {
            name: 'helvetica',
            style: 'bold',
            size: 12,
            color: { r: 52, g: 73, b: 94 } // #34495e
          },
          highlightFont: {
            name: 'helvetica',
            style: 'italic',
            size: 11,
            color: { r: 52, g: 152, b: 219 } // #3498db
          },
          textFont: {
            name: 'helvetica',
            style: 'normal',
            size: 11,
            color: { r: 50, g: 50, b: 50 } // gris oscuro
          },
          sectionLine: {
            color: { r: 52, g: 152, b: 219 }, // #3498db
            width: 1,
            offsetY: 2
          },
          skillsStyle: 'bullets',
          bullet: {
            type: 'circle',
            color: { r: 52, g: 152, b: 219 }, // #3498db
            spacing: 8,
            lineHeight: 7
          },
          elements: [
            {
              type: 'rectangle',
              color: { r: 52, g: 73, b: 94 }, // #34495e
              x: 0,
              y: 0,
              width: 210,
              height: 30
            }
          ]
        },
        
        // Estilo tecnológico (negro con verde neón)
        tecnologico: {
          background: { r: 26, g: 26, b: 46 }, // #1a1a2e
          margin: 20,
          centered: false,
          namePositionY: 30,
          contactPositionY: 40,
          firstSectionY: 65,
          sectionSpacing: 15,
          paragraphSpacing: 6,
          itemSpacing: 8,
          itemDetailSpacing: 6,
          titleFont: {
            name: 'helvetica',
            style: 'bold',
            size: 24,
            color: { r: 0, g: 255, b: 157 } // #00ff9d
          },
          contactFont: {
            name: 'helvetica',
            style: 'normal',
            size: 12,
            color: { r: 255, g: 255, b: 255 } // blanco
          },
          sectionFont: {
            name: 'helvetica',
            style: 'bold',
            size: 16,
            color: { r: 0, g: 255, b: 157 } // #00ff9d
          },
          subtitleFont: {
            name: 'helvetica',
            style: 'bold',
            size: 14,
            color: { r: 255, g: 255, b: 255 } // blanco
          },
          highlightFont: {
            name: 'helvetica',
            style: 'italic',
            size: 12,
            color: { r: 0, g: 255, b: 157 } // #00ff9d
          },
          textFont: {
            name: 'helvetica',
            style: 'normal',
            size: 12,
            color: { r: 200, g: 200, b: 200 } // gris claro
          },
          sectionLine: null, // Sin línea
          skillsStyle: 'bullets',
          bullet: {
            type: 'square',
            color: { r: 0, g: 255, b: 157 }, // #00ff9d
            spacing: 8,
            lineHeight: 8
          },
          elements: [
            {
              type: 'rectangle',
              color: { r: 0, g: 255, b: 157, a: 0.1 },
              x: 0,
              y: 50,
              width: 210,
              height: 2
            },
            {
              type: 'line',
              color: { r: 0, g: 255, b: 157 },
              width: 0.5,
              startX: 20,
              startY: 55,
              endX: 190,
              endY: 55
            }
          ]
        },
        
        // Estilo académico (morado)
        academico: {
          background: { r: 255, g: 255, b: 255 }, // blanco
          margin: 70,
          centered: true,
          namePositionY: 40,
          contactPositionY: 50,
          firstSectionY: 80,
          sectionSpacing: 15,
          paragraphSpacing: 8,
          itemSpacing: 8,
          itemDetailSpacing: 6,
          titleFont: {
            name: 'helvetica',
            style: 'bold',
            size: 22,
            color: { r: 0, g: 0, b: 0 } // negro
          },
          contactFont: {
            name: 'helvetica',
            style: 'normal',
            size: 11,
            color: { r: 100, g: 100, b: 100 } // gris
          },
          sectionFont: {
            name: 'helvetica',
            style: 'bold',
            size: 14,
            color: { r: 142, g: 68, b: 173 } // #8e44ad
          },
          subtitleFont: {
            name: 'helvetica',
            style: 'bold',
            size: 12,
            color: { r: 0, g: 0, b: 0 } // negro
          },
          highlightFont: {
            name: 'helvetica',
            style: 'italic',
            size: 11,
            color: { r: 100, g: 100, b: 100 } // gris
          },
          textFont: {
            name: 'helvetica',
            style: 'normal',
            size: 11,
            color: { r: 50, g: 50, b: 50 } // gris oscuro
          },
          sectionLine: {
            color: { r: 142, g: 68, b: 173 }, // #8e44ad
            width: 0.5,
            offsetY: 2
          },
          skillsStyle: 'inline',
          elements: [
            {
              type: 'rectangle',
              color: { r: 142, g: 68, b: 173 }, // #8e44ad
              x: 0,
              y: 0,
              width: 60,
              height: 297
            }
          ]
        }
      };
      
      // Devolver el estilo solicitado o el predeterminado si no existe
      return styles[styleName] || styles.profesional;
    }

    // Reemplaza tu función de generación de DOCX con esta versión que incluye múltiples estilos

downloadDOCXBtn.addEventListener('click', () => {
    // Mostrar mensaje de carga
    const mensaje = document.createElement('div');
    mensaje.textContent = 'Generando DOCX...';
    mensaje.style.position = 'fixed';
    mensaje.style.top = '50%';
    mensaje.style.left = '50%';
    mensaje.style.transform = 'translate(-50%, -50%)';
    mensaje.style.padding = '15px 25px';
    mensaje.style.backgroundColor = '#333';
    mensaje.style.color = 'white';
    mensaje.style.borderRadius = '8px';
    mensaje.style.zIndex = '9999';
    document.body.appendChild(mensaje);
    
    try {
      // Obtener la configuración de estilo para DOCX
      const styleConfig = getDOCXStyleConfig(selectedStyle);
   
      // Array para almacenar todos los elementos del documento
      const documentElements = [];
      
      // Añadir elementos específicos al principio según el estilo
      if (styleConfig.headerElements) {
        documentElements.push(...styleConfig.headerElements);
      }
      
      // 1. Encabezado con nombre y datos de contacto
      documentElements.push(
        new docx.Paragraph({
          text: formData.name,
          heading: docx.HeadingLevel.HEADING_1,
          alignment: styleConfig.nameAlignment,
          spacing: { after: styleConfig.nameSpacingAfter },
          color: styleConfig.nameColor
        })
      );
      
      documentElements.push(
        new docx.Paragraph({
          text: `${formData.email} | ${formData.phone}`,
          alignment: styleConfig.contactAlignment,
          spacing: { after: styleConfig.contactSpacingAfter },
          color: styleConfig.contactColor,
          ...styleConfig.contactStyle
        })
      );
      
      // 2. Línea separadora si el estilo lo requiere
      if (styleConfig.divider) {
        documentElements.push(
          new docx.Paragraph({
            text: "",
            border: {
              bottom: { 
                color: styleConfig.dividerColor, 
                space: 1, 
                value: "single", 
                size: styleConfig.dividerSize
              }
            },
            spacing: { after: styleConfig.dividerSpacingAfter }
          })
        );
      }
      
      // 3. Resumen Profesional
      documentElements.push(
        new docx.Paragraph({
          text: styleConfig.sectionTitles.resume || "RESUMEN PROFESIONAL",
          heading: docx.HeadingLevel.HEADING_2,
          color: styleConfig.sectionTitleColor,
          bold: true,
          spacing: { after: styleConfig.sectionTitleSpacingAfter },
          ...styleConfig.sectionTitleStyle
        })
      );
      
      documentElements.push(
        new docx.Paragraph({
          text: formData.aiSummary || "Profesional con experiencia destacada en el sector.",
          spacing: { after: styleConfig.paragraphSpacingAfter },
          ...styleConfig.paragraphStyle
        })
      );
      
      // 4. Experiencia Profesional
      documentElements.push(
        new docx.Paragraph({
          text: styleConfig.sectionTitles.experience || "EXPERIENCIA PROFESIONAL",
          heading: docx.HeadingLevel.HEADING_2,
          color: styleConfig.sectionTitleColor,
          bold: true,
          spacing: { after: styleConfig.sectionTitleSpacingAfter },
          ...styleConfig.sectionTitleStyle
        })
      );
      
      // Añadir cada experiencia
      formData.experience.forEach(exp => {
        documentElements.push(
          new docx.Paragraph({
            text: exp.position,
            heading: docx.HeadingLevel.HEADING_3,
            bold: true,
            spacing: { after: styleConfig.itemTitleSpacingAfter },
            ...styleConfig.itemTitleStyle
          })
        );
        
        documentElements.push(
          new docx.Paragraph({
            text: `${exp.company} | ${exp.duration}`,
            italics: styleConfig.itemDetailIsItalic,
            spacing: { after: styleConfig.itemDetailSpacingAfter },
            ...styleConfig.itemDetailStyle
          })
        );
        
        documentElements.push(
          new docx.Paragraph({
            text: exp.description,
            spacing: { after: styleConfig.paragraphSpacingAfter },
            ...styleConfig.paragraphStyle
          })
        );
      });
      
      // 5. Educación
      documentElements.push(
        new docx.Paragraph({
          text: styleConfig.sectionTitles.education || "EDUCACIÓN",
          heading: docx.HeadingLevel.HEADING_2,
          color: styleConfig.sectionTitleColor,
          bold: true,
          spacing: { after: styleConfig.sectionTitleSpacingAfter },
          ...styleConfig.sectionTitleStyle
        })
      );
      
      // Añadir cada educación
      formData.education.forEach(edu => {
        documentElements.push(
          new docx.Paragraph({
            text: edu.degree,
            heading: docx.HeadingLevel.HEADING_3,
            bold: true,
            spacing: { after: styleConfig.itemTitleSpacingAfter },
            ...styleConfig.itemTitleStyle
          })
        );
        
        documentElements.push(
          new docx.Paragraph({
            text: `${edu.institution} | ${edu.year}`,
            italics: styleConfig.itemDetailIsItalic,
            spacing: { after: styleConfig.paragraphSpacingAfter },
            ...styleConfig.itemDetailStyle
          })
        );
      });
      
      // 6. Habilidades
      documentElements.push(
        new docx.Paragraph({
          text: styleConfig.sectionTitles.skills || "HABILIDADES",
          heading: docx.HeadingLevel.HEADING_2,
          color: styleConfig.sectionTitleColor,
          bold: true,
          spacing: { after: styleConfig.sectionTitleSpacingAfter },
          ...styleConfig.sectionTitleStyle
        })
      );
      
      // Crear elementos para habilidades según el estilo
      const skillElements = [];
      
      if (styleConfig.skillsAsList) {
        // Lista con viñetas para las habilidades
        formData.skills.forEach(skill => {
          skillElements.push(
            new docx.Paragraph({
              text: skill,
              bullet: {
                level: 0
              },
              ...styleConfig.skillItemStyle
            })
          );
        });
      } else {
        // Texto en línea para las habilidades
        skillElements.push(
          new docx.Paragraph({
            text: formData.skills.join(', '),
            spacing: { after: styleConfig.paragraphSpacingAfter },
            ...styleConfig.paragraphStyle
          })
        );
      }
      
      documentElements.push(...skillElements);
      
      // Añadir elementos específicos al final según el estilo
      if (styleConfig.footerElements) {
        documentElements.push(...styleConfig.footerElements);
      }
      
      // Crear el documento con todos los elementos y estilos
      const doc = new docx.Document({
        styles: {
          paragraphStyles: styleConfig.paragraphStyles
        },
        sections: [{
          properties: {
            page: {
              margin: {
                top: styleConfig.margins.top,
                right: styleConfig.margins.right,
                bottom: styleConfig.margins.bottom,
                left: styleConfig.margins.left
              }
            }
          },
          children: documentElements
        }]
      });
      
      // Generar y descargar el documento
      docx.Packer.toBlob(doc).then(blob => {
        saveAs(blob, `${formData.name.replace(/\s+/g, '_')}_CV.docx`);
        
        // Eliminar mensaje de carga
        document.body.removeChild(mensaje);
        
        // Mensaje de éxito
        const mensajeExito = document.createElement('div');
        mensajeExito.textContent = '¡DOCX descargado con éxito!';
        mensajeExito.style.position = 'fixed';
        mensajeExito.style.top = '50%';
        mensajeExito.style.left = '50%';
        mensajeExito.style.transform = 'translate(-50%, -50%)';
        mensajeExito.style.padding = '15px 25px';
        mensajeExito.style.backgroundColor = '#4CAF50';
        mensajeExito.style.color = 'white';
        mensajeExito.style.borderRadius = '8px';
        mensajeExito.style.zIndex = '9999';
        document.body.appendChild(mensajeExito);
        
        // Eliminar mensaje de éxito después de 2 segundos
        setTimeout(() => {
          document.body.removeChild(mensajeExito);
        }, 2000);
      });
    } catch (error) {
      console.error('Error al generar DOCX:', error);
      
      // Eliminar mensaje de carga
      document.body.removeChild(mensaje);
      
      // Mensaje de error
      const mensajeError = document.createElement('div');
      mensajeError.textContent = 'Error al generar el DOCX. Intenta nuevamente.';
      mensajeError.style.position = 'fixed';
      mensajeError.style.top = '50%';
      mensajeError.style.left = '50%';
      mensajeError.style.transform = 'translate(-50%, -50%)';
      mensajeError.style.padding = '15px 25px';
      mensajeError.style.backgroundColor = '#F44336';
      mensajeError.style.color = 'white';
      mensajeError.style.borderRadius = '8px';
      mensajeError.style.zIndex = '9999';
      document.body.appendChild(mensajeError);
      
      // Eliminar mensaje de error después de 3 segundos
      setTimeout(() => {
        document.body.removeChild(mensajeError);
      }, 3000);
    }
  });
  
  // Función para obtener la configuración de estilo DOCX según la selección
  function getDOCXStyleConfig(styleName) {
    const styles = {
      // Estilo profesional (azul oscuro con dorado) - el original
      profesional: {
        margins: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
        nameAlignment: docx.AlignmentType.CENTER,
        nameSpacingAfter: 200,
        nameColor: "f1c40f", // dorado
        contactAlignment: docx.AlignmentType.CENTER,
        contactSpacingAfter: 400,
        contactColor: "ffffff", // blanco
        contactStyle: { italics: false },
        divider: true,
        dividerColor: "f1c40f", // dorado
        dividerSize: 10,
        dividerSpacingAfter: 200,
        sectionTitleColor: "f1c40f", // dorado
        sectionTitleSpacingAfter: 200,
        sectionTitleStyle: { bold: true },
        itemTitleSpacingAfter: 100,
        itemTitleStyle: { bold: true, color: "ffffff" }, // blanco
        itemDetailIsItalic: true,
        itemDetailSpacingAfter: 100,
        itemDetailStyle: { color: "ffffff" }, // blanco
        paragraphSpacingAfter: 300,
        paragraphStyle: { color: "ffffff" }, // blanco
        skillsAsList: true,
        skillItemStyle: { color: "ffffff" }, // blanco
        sectionTitles: {
          resume: "RESUMEN PROFESIONAL",
          experience: "EXPERIENCIA PROFESIONAL",
          education: "EDUCACIÓN",
          skills: "HABILIDADES"
        },
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            run: {
              size: 36,
              bold: true,
              color: "f1c40f" // dorado
            }
          },
          {
            id: "Heading2",
            name: "Heading 2",
            run: {
              size: 28,
              bold: true,
              color: "f1c40f" // dorado
            }
          },
          {
            id: "Heading3",
            name: "Heading 3",
            run: {
              size: 24,
              bold: true,
              color: "ffffff" // blanco
            }
          }
        ],
        headerElements: [
          new docx.Paragraph({
            text: "",
            shading: {
              type: docx.ShadingType.SOLID,
              color: "2c3e50" // azul oscuro
            },
            spacing: { before: 0, after: 0 }
          })
        ]
      },
      
      // Estilo minimalista (blanco y negro)
      minimalista: {
        margins: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
        nameAlignment: docx.AlignmentType.LEFT,
        nameSpacingAfter: 200,
        nameColor: "000000", // negro
        contactAlignment: docx.AlignmentType.LEFT,
        contactSpacingAfter: 300,
        contactColor: "666666", // gris
        contactStyle: { italics: false },
        divider: true,
        dividerColor: "cccccc", // gris claro
        dividerSize: 6,
        dividerSpacingAfter: 200,
        sectionTitleColor: "000000", // negro
        sectionTitleSpacingAfter: 150,
        sectionTitleStyle: { bold: true, underline: { type: docx.UnderlineType.SINGLE } },
        itemTitleSpacingAfter: 100,
        itemTitleStyle: { bold: true, color: "000000" }, // negro
        itemDetailIsItalic: true,
        itemDetailSpacingAfter: 100,
        itemDetailStyle: { color: "666666" }, // gris
        paragraphSpacingAfter: 200,
        paragraphStyle: { color: "333333" }, // gris oscuro
        skillsAsList: false,
        skillItemStyle: { color: "333333" }, // gris oscuro
        sectionTitles: {
          resume: "PERFIL PROFESIONAL",
          experience: "EXPERIENCIA LABORAL",
          education: "FORMACIÓN ACADÉMICA",
          skills: "COMPETENCIAS"
        },
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            run: {
              size: 32,
              bold: true,
              color: "000000" // negro
            }
          },
          {
            id: "Heading2",
            name: "Heading 2",
            run: {
              size: 24,
              bold: true,
              color: "000000" // negro
            }
          },
          {
            id: "Heading3",
            name: "Heading 3",
            run: {
              size: 20,
              bold: true,
              color: "000000" // negro
            }
          }
        ]
      },
      
      // Estilo creativo (púrpura y amarillo)
      creativo: {
        margins: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
        nameAlignment: docx.AlignmentType.CENTER,
        nameSpacingAfter: 200,
        nameColor: "ffcc00", // amarillo
        contactAlignment: docx.AlignmentType.CENTER,
        contactSpacingAfter: 400,
        contactColor: "ffffff", // blanco
        contactStyle: { italics: true },
        divider: false,
        sectionTitleColor: "ffcc00", // amarillo
        sectionTitleSpacingAfter: 200,
        sectionTitleStyle: { bold: true },
        itemTitleSpacingAfter: 100,
        itemTitleStyle: { bold: true, color: "ffffff" }, // blanco
        itemDetailIsItalic: true,
        itemDetailSpacingAfter: 100,
        itemDetailStyle: { color: "ffcc00" }, // amarillo
        paragraphSpacingAfter: 300,
        paragraphStyle: { color: "ffffff" }, // blanco
        skillsAsList: true,
        skillItemStyle: { color: "ffffff" }, // blanco
        sectionTitles: {
          resume: "PERFIL CREATIVO",
          experience: "TRAYECTORIA PROFESIONAL",
          education: "FORMACIÓN",
          skills: "HABILIDADES Y TALENTOS"
        },
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            run: {
              size: 40,
              bold: true,
              color: "ffcc00" // amarillo
            }
          },
          {
            id: "Heading2",
            name: "Heading 2",
            run: {
              size: 32,
              bold: true,
              color: "ffcc00" // amarillo
            }
          },
          {
            id: "Heading3",
            name: "Heading 3",
            run: {
              size: 24,
              bold: true,
              color: "ffffff" // blanco
            }
          }
        ],
        headerElements: [
          new docx.Paragraph({
            text: "",
            shading: {
              type: docx.ShadingType.SOLID,
              color: "6a11cb" // púrpura
            },
            spacing: { before: 0, after: 0 }
          })
        ]
      },
      
      // Estilo ejecutivo (gris y azul)
      ejecutivo: {
        margins: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
        nameAlignment: docx.AlignmentType.LEFT,
        nameSpacingAfter: 200,
        nameColor: "34495e", // azul oscuro
        contactAlignment: docx.AlignmentType.LEFT,
        contactSpacingAfter: 400,
        contactColor: "34495e", // azul oscuro
        contactStyle: { italics: false },
        divider: true,
        dividerColor: "3498db", // azul
        dividerSize: 8,
        dividerSpacingAfter: 200,
        sectionTitleColor: "34495e", // azul oscuro
        sectionTitleSpacingAfter: 150,
        sectionTitleStyle: { bold: true },
        itemTitleSpacingAfter: 100,
        itemTitleStyle: { bold: true, color: "34495e" }, // azul oscuro
        itemDetailIsItalic: true,
        itemDetailSpacingAfter: 100,
        itemDetailStyle: { color: "3498db" }, // azul
        paragraphSpacingAfter: 200,
        paragraphStyle: { color: "333333" }, // gris oscuro
        skillsAsList: true,
        skillItemStyle: { color: "333333" }, // gris oscuro
        sectionTitles: {
          resume: "PERFIL EJECUTIVO",
          experience: "EXPERIENCIA PROFESIONAL",
          education: "FORMACIÓN ACADÉMICA",
          skills: "COMPETENCIAS CLAVE"
        },
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            run: {
              size: 32,
              bold: true,
              color: "34495e" // azul oscuro
            }
          },
          {
            id: "Heading2",
          name: "Heading 2",
          run: {
            size: 24,
            bold: true,
            color: "34495e" // azul oscuro
          }
        },
        {
          id: "Heading3",
          name: "Heading 3",
          run: {
            size: 20,
            bold: true,
            color: "34495e" // azul oscuro
          }
        }
      ],
      headerElements: [
        new docx.Paragraph({
          text: "",
          border: {
            top: { 
              color: "3498db", 
              space: 1, 
              value: "single", 
              size: 12
            }
          },
          spacing: { before: 0, after: 200 }
        })
      ]
    },
    
    // Estilo tecnológico (negro con verde neón)
    tecnologico: {
      margins: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
      nameAlignment: docx.AlignmentType.LEFT,
      nameSpacingAfter: 200,
      nameColor: "00ff9d", // verde neón
      contactAlignment: docx.AlignmentType.LEFT,
      contactSpacingAfter: 300,
      contactColor: "ffffff", // blanco
      contactStyle: { italics: false },
      divider: false,
      sectionTitleColor: "00ff9d", // verde neón
      sectionTitleSpacingAfter: 150,
      sectionTitleStyle: { bold: true },
      itemTitleSpacingAfter: 100,
      itemTitleStyle: { bold: true, color: "ffffff" }, // blanco
      itemDetailIsItalic: false,
      itemDetailSpacingAfter: 100,
      itemDetailStyle: { color: "00ff9d" }, // verde neón
      paragraphSpacingAfter: 200,
      paragraphStyle: { color: "cccccc" }, // gris claro
      skillsAsList: true,
      skillItemStyle: { color: "cccccc" }, // gris claro
      sectionTitles: {
        resume: "PERFIL_TÉCNICO",
        experience: "DESARROLLO_PROFESIONAL",
        education: "FORMACIÓN_TÉCNICA",
        skills: "COMPETENCIAS_TÉCNICAS"
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          run: {
            size: 32,
            bold: true,
            color: "00ff9d" // verde neón
          }
        },
        {
          id: "Heading2",
          name: "Heading 2",
          run: {
            size: 24,
            bold: true,
            color: "00ff9d" // verde neón
          }
        },
        {
          id: "Heading3",
          name: "Heading 3",
          run: {
            size: 20,
            bold: true,
            color: "ffffff" // blanco
          }
        }
      ],
      headerElements: [
        new docx.Paragraph({
          text: "",
          shading: {
            type: docx.ShadingType.SOLID,
            color: "1a1a2e" // azul muy oscuro
          },
          spacing: { before: 0, after: 0 }
        })
      ]
    },
    
    // Estilo académico (morado)
    academico: {
      margins: { top: 1500, right: 1500, bottom: 1500, left: 1500 },
      nameAlignment: docx.AlignmentType.CENTER,
      nameSpacingAfter: 200,
      nameColor: "000000", // negro
      contactAlignment: docx.AlignmentType.CENTER,
      contactSpacingAfter: 300,
      contactColor: "666666", // gris
      contactStyle: { italics: false },
      divider: false,
      sectionTitleColor: "8e44ad", // morado
      sectionTitleSpacingAfter: 150,
      sectionTitleStyle: { bold: true, underline: { type: docx.UnderlineType.SINGLE } },
      itemTitleSpacingAfter: 100,
      itemTitleStyle: { bold: true, color: "000000" }, // negro
      itemDetailIsItalic: true,
      itemDetailSpacingAfter: 100,
      itemDetailStyle: { color: "666666" }, // gris
      paragraphSpacingAfter: 200,
      paragraphStyle: { color: "333333" }, // gris oscuro
      skillsAsList: false,
      skillItemStyle: { color: "333333" }, // gris oscuro
      sectionTitles: {
        resume: "PERFIL ACADÉMICO",
        experience: "EXPERIENCIA DOCENTE E INVESTIGADORA",
        education: "FORMACIÓN ACADÉMICA",
        skills: "ÁREAS DE ESPECIALIZACIÓN"
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          run: {
            size: 28,
            bold: true,
            color: "000000" // negro
          }
        },
        {
          id: "Heading2",
          name: "Heading 2",
          run: {
            size: 22,
            bold: true,
            color: "8e44ad" // morado
          }
        },
        {
          id: "Heading3",
          name: "Heading 3",
          run: {
            size: 18,
            bold: true,
            color: "000000" // negro
          }
        }
      ],
      headerElements: [
        new docx.Paragraph({
          text: "CURRICULUM VITAE",
          alignment: docx.AlignmentType.CENTER,
          bold: true,
          spacing: { before: 0, after: 200 },
          color: "8e44ad" // morado
        })
      ],
      footerElements: [
        new docx.Paragraph({
          text: "",
          border: {
            top: {
              color: "8e44ad",
              space: 1,
              value: "single",
              size: 6
            }
          },
          spacing: { before: 200, after: 100 }
        }),
        new docx.Paragraph({
          text: `Generado el ${new Date().toLocaleDateString()}`,
          alignment: docx.AlignmentType.CENTER,
          spacing: { before: 0, after: 0 },
          color: "666666"
        })
      ]
    }
  };
  
  // Devolver el estilo solicitado o el predeterminado si no existe
  return styles[styleName] || styles.profesional;
}
// Añade estas variables y funciones a tu archivo script.js

// Variable global para almacenar el estilo seleccionado
let selectedStyle = 'profesional'; // Estilo por defecto

// Función para seleccionar un estilo
function selectStyle(style) {
  selectedStyle = style;
  
  // Actualizar las clases de las tarjetas
  document.querySelectorAll('.cv-style-card').forEach(card => {
    if (card.getAttribute('data-style') === style) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
  
  console.log('Estilo seleccionado:', selectedStyle);
}

// Marcar el estilo predeterminado como seleccionado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  const defaultStyleCard = document.querySelector('.cv-style-card[data-style="profesional"]');
  if (defaultStyleCard) {
    defaultStyleCard.classList.add('selected');
  }
});
// Añade este código a tu archivo script.js

// Crear el botón de toggle para modo oscuro/claro
function createThemeToggle() {
  const themeToggle = document.createElement('div');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = '<i class="fa fa-moon-o"></i>';
  document.body.appendChild(themeToggle);
  
  // Comprobar si hay preferencia guardada
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fa fa-sun-o"></i>';
  }
  
  // Añadir evento click
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    // Cambiar icono según el modo
    themeToggle.innerHTML = isDark ? '<i class="fa fa-sun-o"></i>' : '<i class="fa fa-moon-o"></i>';
    
    // Animar cambio
    document.querySelectorAll('.text-block, .cv-type-card, .cv-style-card').forEach(el => {
      el.style.transition = 'all 0.8s ease';
    });
  });
}

// Llamar a la función cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  createThemeToggle();
  
  // Mejorar interactividad de tarjetas
  document.querySelectorAll('.cv-type-card, .cv-style-card').forEach(card => {
    card.addEventListener('click', () => {
      // Añadir una pequeña animación al hacer clic
      card.classList.add('animate-click');
      setTimeout(() => {
        card.classList.remove('animate-click');
      }, 300);
    });
  });
  
  // Añadir animación al botón "next"
  document.querySelectorAll('.next-section-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-3px)';
      btn.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.boxShadow = '';
    });
  });
});

// Añadir detectores de entrada para animar formularios
function setupFormAnimations() {
  const formInputs = document.querySelectorAll('input, textarea');
  
  formInputs.forEach(input => {
    // Efecto al enfocar
    input.addEventListener('focus', () => {
      input.style.transform = 'scale(1.01)';
      input.style.boxShadow = '0 0 0 2px rgba(243, 156, 18, 0.3)';
      input.style.transition = 'all 0.3s ease';
    });
    
    // Restablecer al perder el foco
    input.addEventListener('blur', () => {
      input.style.transform = '';
      input.style.boxShadow = '';
    });
  });
}

// Inicializar animaciones después de que la página esté cargada
window.addEventListener('load', () => {
  setupFormAnimations();
});
// Añade estas funciones a tu archivo script.js

// Función para guardar datos automáticamente
function autoSaveFormData() {
  let timeoutId;
  
  // Detectar cambios en todos los inputs
  document.addEventListener('input', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      // Limpiar el timeout previo
      clearTimeout(timeoutId);
      
      // Establecer un nuevo timeout para guardar después de dejar de escribir
      timeoutId = setTimeout(() => {
        const formData = collectFormData();
        localStorage.setItem('cvFormData', JSON.stringify(formData));
        localStorage.setItem('selectedCVType', selectedCVType);
        localStorage.setItem('selectedStyle', selectedStyle);
        
        // Mostrar indicador de guardado
        showSaveIndicator();
      }, 1000);
    }
  });
}

// Función para mostrar indicador de guardado
function showSaveIndicator() {
  // Crear el indicador si no existe
  let saveIndicator = document.getElementById('save-indicator');
  
  if (!saveIndicator) {
    saveIndicator = document.createElement('div');
    saveIndicator.id = 'save-indicator';
    saveIndicator.style.position = 'fixed';
    saveIndicator.style.bottom = '20px';
    saveIndicator.style.right = '20px';
    saveIndicator.style.background = 'rgba(0, 0, 0, 0.7)';
    saveIndicator.style.color = 'white';
    saveIndicator.style.padding = '10px 15px';
    saveIndicator.style.borderRadius = '5px';
    saveIndicator.style.fontSize = '14px';
    saveIndicator.style.zIndex = '1000';
    saveIndicator.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(saveIndicator);
  }
  
  // Mostrar mensaje
  saveIndicator.textContent = 'Guardado automático ✓';
  saveIndicator.style.opacity = '1';
  
  // Ocultar después de 2 segundos
  setTimeout(() => {
    saveIndicator.style.opacity = '0';
  }, 2000);
}

// Función para cargar datos guardados
function loadSavedFormData() {
  const savedData = localStorage.getItem('cvFormData');
  const savedCVType = localStorage.getItem('selectedCVType');
  const savedStyle = localStorage.getItem('selectedStyle');
  
  if (savedData) {
    // Crear banner de recuperación
    const recoveryBanner = document.createElement('div');
    recoveryBanner.className = 'recovery-banner';
    recoveryBanner.innerHTML = `
      <div class="recovery-message">
        <i class="fa fa-history"></i> Se encontró un borrador guardado. ¿Deseas restaurarlo?
      </div>
      <div class="recovery-buttons">
        <button id="restore-btn">Restaurar</button>
        <button id="discard-btn">Descartar</button>
      </div>
    `;
    
    recoveryBanner.style.position = 'fixed';
    recoveryBanner.style.top = '0';
    recoveryBanner.style.left = '0';
    recoveryBanner.style.width = '100%';
    recoveryBanner.style.padding = '15px';
    recoveryBanner.style.background = '#3498db';
    recoveryBanner.style.color = 'white';
    recoveryBanner.style.zIndex = '2000';
    recoveryBanner.style.display = 'flex';
    recoveryBanner.style.justifyContent = 'space-between';
    recoveryBanner.style.alignItems = 'center';
    
    document.body.insertBefore(recoveryBanner, document.body.firstChild);
    
    // Añadir eventos a los botones
    document.getElementById('restore-btn').addEventListener('click', () => {
      // Restaurar datos
      formData = JSON.parse(savedData);
      
      if (savedCVType) {
        selectedCVType = savedCVType;
        document.querySelectorAll('.cv-type-card').forEach(card => {
          if (card.getAttribute('data-type') === savedCVType) {
            card.classList.add('selected');
          }
        });
      }
      
      if (savedStyle) {
        selectedStyle = savedStyle;
        document.querySelectorAll('.cv-style-card').forEach(card => {
          if (card.getAttribute('data-style') === savedStyle) {
            card.classList.add('selected');
          }
        });
      }
      
      // Llenar el formulario con los datos guardados
      fillFormWithData(formData);
      
      // Eliminar el banner
      document.body.removeChild(recoveryBanner);
      
      // Mostrar mensaje de éxito
      const successMessage = document.createElement('div');
      successMessage.textContent = 'Datos restaurados correctamente';
      successMessage.style.position = 'fixed';
      successMessage.style.bottom = '20px';
      successMessage.style.right = '20px';
      successMessage.style.background = '#2ecc71';
      successMessage.style.color = 'white';
      successMessage.style.padding = '10px 15px';
      successMessage.style.borderRadius = '5px';
      successMessage.style.zIndex = '1000';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
    });
    
    document.getElementById('discard-btn').addEventListener('click', () => {
      // Eliminar datos guardados
      localStorage.removeItem('cvFormData');
      localStorage.removeItem('selectedCVType');
      localStorage.removeItem('selectedStyle');
      
      // Eliminar el banner
      document.body.removeChild(recoveryBanner);
    });
  }
}

// Función para llenar el formulario con datos guardados
function fillFormWithData(data) {
  // Rellenar campos básicos
  document.querySelector('input[name="name"]').value = data.name || '';
  document.querySelector('input[name="email"]').value = data.email || '';
  document.querySelector('input[name="phone"]').value = data.phone || '';
  
  // Rellenar educación
  const educationContainer = document.getElementById('education-container');
  educationContainer.innerHTML = ''; // Limpiar contenedor
  
  if (data.education && data.education.length > 0) {
    data.education.forEach(edu => {
      const newEntry = document.createElement('div');
      newEntry.classList.add('form-subgroup', 'education-entry');
      newEntry.innerHTML = `
        <input type="text" name="institution" value="${edu.institution || ''}" placeholder="Nombre de la Institución">
        <input type="text" name="degree" value="${edu.degree || ''}" placeholder="Título/Certificado">
        <input type="text" name="year" value="${edu.year || ''}" placeholder="Año">
        <button type="button" class="remove-btn">Eliminar</button>
      `;
      educationContainer.appendChild(newEntry);
      
      // Añadir funcionalidad al botón de eliminar
      const removeBtn = newEntry.querySelector('.remove-btn');
      removeBtn.addEventListener('click', () => {
        educationContainer.removeChild(newEntry);
      });
    });
  } else {
    // Añadir al menos una entrada vacía
    addEducationEntry();
  }
  
  // Rellenar experiencia
  const experienceContainer = document.getElementById('experience-container');
  experienceContainer.innerHTML = ''; // Limpiar contenedor
  
  if (data.experience && data.experience.length > 0) {
    data.experience.forEach(exp => {
      const newEntry = document.createElement('div');
      newEntry.classList.add('form-subgroup', 'experience-entry');
      newEntry.innerHTML = `
        <input type="text" name="company" value="${exp.company || ''}" placeholder="Empresa">
        <input type="text" name="position" value="${exp.position || ''}" placeholder="Puesto">
        <input type="text" name="duration" value="${exp.duration || ''}" placeholder="Duración (ej. 2019-2022)">
        <textarea name="description" placeholder="Descripción del trabajo" rows="3">${exp.description || ''}</textarea>
        <button type="button" class="remove-btn">Eliminar</button>
      `;
      experienceContainer.appendChild(newEntry);
      
      // Añadir funcionalidad al botón de eliminar
      const removeBtn = newEntry.querySelector('.remove-btn');
      removeBtn.addEventListener('click', () => {
        experienceContainer.removeChild(newEntry);
      });
    });
  } else {
    // Añadir al menos una entrada vacía
    addExperienceEntry();
  }
  
  // Rellenar habilidades
  if (data.skills && data.skills.length > 0) {
    document.querySelector('textarea[name="skills"]').value = data.skills.join(', ');
  }
}

// Función helper para añadir una entrada de educación vacía
function addEducationEntry() {
  const educationContainer = document.getElementById('education-container');
  const newEntry = document.createElement('div');
  newEntry.classList.add('form-subgroup', 'education-entry');
  newEntry.innerHTML = `
    <input type="text" name="institution" placeholder="Nombre de la Institución">
    <input type="text" name="degree" placeholder="Título/Certificado">
    <input type="text" name="year" placeholder="Año">
    <button type="button" class="remove-btn">Eliminar</button>
  `;
  educationContainer.appendChild(newEntry);
  
  // Añadir funcionalidad al botón de eliminar
  const removeBtn = newEntry.querySelector('.remove-btn');
  removeBtn.addEventListener('click', () => {
    educationContainer.removeChild(newEntry);
  });
  
  return newEntry;
}

// Función helper para añadir una entrada de experiencia vacía
function addExperienceEntry() {
  const experienceContainer = document.getElementById('experience-container');
  const newEntry = document.createElement('div');
  newEntry.classList.add('form-subgroup', 'experience-entry');
  newEntry.innerHTML = `
    <input type="text" name="company" placeholder="Empresa">
    <input type="text" name="position" placeholder="Puesto">
    <input type="text" name="duration" placeholder="Duración (ej. 2019-2022)">
    <textarea name="description" placeholder="Descripción del trabajo" rows="3"></textarea>
    <button type="button" class="remove-btn">Eliminar</button>
  `;
  experienceContainer.appendChild(newEntry);
  
  // Añadir funcionalidad al botón de eliminar
  const removeBtn = newEntry.querySelector('.remove-btn');
  removeBtn.addEventListener('click', () => {
    experienceContainer.removeChild(newEntry);
  });
  
  return newEntry;
}

// Inicializar funciones de guardado cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  loadSavedFormData();
  autoSaveFormData();
});
// Añade esta función a tu script.js

// Crear botones de compartir
function addSharingButtons() {
  // Verificar si los botones ya existen para evitar duplicación
  const existingSharing = document.querySelector('.sharing-options');
  if (existingSharing) {
    return; // Si ya existen, no hacer nada
  }
  
  // Crear contenedor para botones de compartir
  const sharingContainer = document.createElement('div');
  sharingContainer.className = 'sharing-options';
  sharingContainer.innerHTML = `
    <h3>Compartir tu CV</h3>
    <div class="sharing-buttons">
      <button class="share-btn linkedin" title="Compartir en LinkedIn">
        <i class="fa fa-linkedin"></i> LinkedIn
      </button>
      <button class="share-btn email" title="Compartir por email">
        <i class="fa fa-envelope"></i> Email
      </button>
      <button class="share-btn copy-link" title="Copiar enlace">
        <i class="fa fa-link"></i> Copiar Enlace
      </button>
    </div>
  `;
  
  // Estilos para contenedor
  sharingContainer.style.margin = '20px 0';
  sharingContainer.style.padding = '15px';
  sharingContainer.style.background = 'rgba(255, 255, 255, 0.1)';
  sharingContainer.style.borderRadius = '10px';
  
  // Estilos para botones
  const buttonsContainer = sharingContainer.querySelector('.sharing-buttons');
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.gap = '10px';
  buttonsContainer.style.marginTop = '10px';
  
  // Estilo común para botones de compartir
  const shareButtons = sharingContainer.querySelectorAll('.share-btn');
  shareButtons.forEach(btn => {
    btn.style.padding = '8px 15px';
    btn.style.borderRadius = '5px';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.gap = '5px';
    btn.style.transition = 'all 0.3s ease';
  });
  
  // Colores específicos para cada botón
  sharingContainer.querySelector('.linkedin').style.backgroundColor = '#0077b5';
  sharingContainer.querySelector('.email').style.backgroundColor = '#ea4335';
  sharingContainer.querySelector('.copy-link').style.backgroundColor = '#333';
  
  // Añadir efectos hover
  shareButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-3px)';
      btn.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.boxShadow = '';
    });
  });
  
  // Añadir al documento en la sección de previsualización
  const previewSection = document.getElementById('section4');
  if (previewSection) {
    const textBlock = previewSection.querySelector('.text-block');
    textBlock.appendChild(sharingContainer);
    
    // Añadir funcionalidad a los botones
    setupSharingFunctionality(sharingContainer);
  }
}

// Configurar la funcionalidad de compartir
function setupSharingFunctionality(container) {
  // LinkedIn
  container.querySelector('.linkedin').addEventListener('click', () => {
    // Crear URL para compartir en LinkedIn
    const text = encodeURIComponent(`Mira mi CV profesional creado con IA: ${formData.name}`);
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}&summary=${text}`;
    window.open(url, '_blank');
  });
  
  // Email
  container.querySelector('.email').addEventListener('click', () => {
    const subject = encodeURIComponent(`CV de ${formData.name}`);
    const body = encodeURIComponent(`Hola,\n\nQuería compartir mi currículum creado con ayuda de IA. Puedes verlo en el siguiente enlace:\n\n${window.location.href}\n\nSaludos,\n${formData.name}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  });
  
  // Copiar enlace
  container.querySelector('.copy-link').addEventListener('click', () => {
    // Crear un enlace temporal con los datos
    const tempData = {
      formData: formData,
      cvType: selectedCVType,
      style: selectedStyle
    };
    
    // En una aplicación real, esto generaría un enlace único o una ID para compartir
    // Para esta demo, simplemente copiamos la URL actual
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        // Mostrar confirmación
        const btn = container.querySelector('.copy-link');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa fa-check"></i> ¡Copiado!';
        btn.style.backgroundColor = '#2ecc71';
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.backgroundColor = '#333';
        }, 2000);
      })
      .catch(err => {
        console.error('Error al copiar enlace:', err);
      });
  });
}

// Crear función para exportar a HTML
function addExportToHTMLButton() {
  const downloadOptions = document.querySelector('.download-options .download-buttons');
  
  // Verificar si el botón ya existe para evitar duplicación
  if (downloadOptions && !downloadOptions.querySelector('.html')) {
    const htmlButton = document.createElement('button');
    htmlButton.className = 'download-btn html';
    htmlButton.textContent = 'Exportar HTML';
    htmlButton.style.backgroundColor = '#2980b9';
    
    downloadOptions.appendChild(htmlButton);
    
    // Añadir funcionalidad para exportar a HTML
    htmlButton.addEventListener('click', exportToHTML);
  }
}

// Modifica previewBtn para que limpie los botones anteriores si es necesario
previewBtn.addEventListener('click', () => {
  // Navegar a la sección de previsualización
  sections[3].scrollIntoView({ behavior: "smooth" });
  
  // Llenar la vista previa con los datos
  document.getElementById('preview-name').textContent = formData.name;
  document.getElementById('preview-email').textContent = formData.email;
  document.getElementById('preview-phone').textContent = formData.phone;
  document.getElementById('preview-summary').textContent = document.getElementById('ai-summary').textContent;
  
  // Experiencia
  const experienceContainer = document.getElementById('preview-experience');
  experienceContainer.innerHTML = '';
  formData.experience.forEach(exp => {
    const expItem = document.createElement('div');
    expItem.classList.add('experience-item');
    expItem.innerHTML = `
      <div class="exp-header">
        <h5>${exp.position}</h5>
        <p>${exp.company} | ${exp.duration}</p>
      </div>
      <p>${exp.description}</p>
    `;
    experienceContainer.appendChild(expItem);
  });
  
  // Educación
  const educationContainer = document.getElementById('preview-education');
  educationContainer.innerHTML = '';
  formData.education.forEach(edu => {
    const eduItem = document.createElement('div');
    eduItem.classList.add('education-item');
    eduItem.innerHTML = `
      <h5>${edu.degree}</h5>
      <p>${edu.institution} | ${edu.year}</p>
    `;
    educationContainer.appendChild(eduItem);
  });
  
  // Habilidades
  const skillsContainer = document.getElementById('preview-skills');
  skillsContainer.innerHTML = '';
  formData.skills.forEach(skill => {
    const skillTag = document.createElement('span');
    skillTag.classList.add('skill-tag');
    skillTag.textContent = skill;
    skillsContainer.appendChild(skillTag);
  });
  
  // Esperar a que se cargue la vista previa antes de añadir los botones
  setTimeout(() => {
    // Agregar botones de compartir y exportar HTML
    addSharingButtons();
    addExportToHTMLButton();
  }, 500);
});


// Añade estas funciones a tu script.js para implementar mejoras de IA

// 1. Implementación de sistema de palabras clave por sector
const keywordsBySector = {
  tecnologia: [
    "desarrollo", "programación", "software", "aplicaciones", "web", "móvil", 
    "cloud", "datos", "seguridad", "redes", "sistemas", "arquitectura", 
    "frontend", "backend", "fullstack", "devops", "agile", "scrum", 
    "JavaScript", "Python", "Java", "C#", "React", "Angular", "Node.js", 
    "AWS", "Azure", "Docker", "Kubernetes", "CI/CD", "GitHub", "GitLab"
  ],
  negocios: [
    "estrategia", "gestión", "liderazgo", "negociación", "ventas", "marketing", 
    "finanzas", "contabilidad", "presupuesto", "análisis", "planificación", 
    "KPI", "objetivos", "resultados", "cliente", "proveedor", "mercado", 
    "competencia", "rentabilidad", "crecimiento", "innovación", "dirección", 
    "proyecto", "equipo", "coordinación", "optimización", "eficiencia"
  ],
  creatividad: [
    "diseño", "creativo", "concepto", "estética", "visual", "gráfico", 
    "editorial", "multimedia", "UX", "UI", "usabilidad", "experiencia", 
    "comunicación", "marca", "identidad", "color", "tipografía", "composición", 
    "ilustración", "fotografía", "vídeo", "animación", "storytelling", 
    "contenido", "copywriting", "edición", "producción", "dirección de arte"
  ],
  salud: [
    "asistencia", "cuidado", "paciente", "diagnóstico", "tratamiento", 
    "clínico", "terapéutico", "rehabilitación", "prevención", "medicamento", 
    "farmacología", "sanitario", "bienestar", "salud", "patología", 
    "enfermedad", "recuperación", "historia clínica", "seguimiento", 
    "protocolo", "análisis", "laboratorio", "radiología", "especialidad"
  ]
};

// 2. Función para analizar el texto en busca de palabras clave
function analyzeKeywords(text, sector) {
  if (!sector || !keywordsBySector[sector]) return { score: 0, missing: [] };
  
  const relevantKeywords = keywordsBySector[sector];
  const textLower = text.toLowerCase();
  
  // Palabras clave encontradas
  const found = relevantKeywords.filter(keyword => 
    textLower.includes(keyword.toLowerCase())
  );
  
  // Palabras clave faltantes (máximo 5 sugerencias)
  const missing = relevantKeywords
    .filter(keyword => !textLower.includes(keyword.toLowerCase()))
    .sort(() => 0.5 - Math.random()) // Mezclar aleatoriamente
    .slice(0, 5);
  
  // Calcular puntuación (0-100)
  const score = Math.min(100, Math.round((found.length / relevantKeywords.length) * 100));
  
  return { score, found, missing };
}

// 3. Función para proporcionar retroalimentación en tiempo real
function setupRealtimeFeedback() {
  // Monitorear los campos de texto principales
  const textareas = document.querySelectorAll('textarea[name="description"], textarea[name="skills"]');
  
  textareas.forEach(textarea => {
    // Crear contenedor para retroalimentación
    const feedbackContainer = document.createElement('div');
    feedbackContainer.className = 'ai-feedback';
    feedbackContainer.style.marginTop = '10px';
    feedbackContainer.style.padding = '10px';
    feedbackContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
    feedbackContainer.style.borderRadius = '5px';
    feedbackContainer.style.display = 'none';
    
    // Insertar después del textarea
    textarea.parentNode.insertBefore(feedbackContainer, textarea.nextSibling);
    
    // Monitorear cambios con un temporizador para evitar demasiadas actualizaciones
    let typingTimer;
    textarea.addEventListener('input', () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        // Analizar el texto según el sector seleccionado
        const analysis = analyzeKeywords(textarea.value, selectedCVType);
        
        // Si hay palabras clave específicas del sector, mostrar retroalimentación
        if (analysis.score > 0 || analysis.missing.length > 0) {
          feedbackContainer.style.display = 'block';
          
          // Crear contenido de retroalimentación
          let feedbackContent = '';
          
          // Mostrar puntuación
          feedbackContent += `<div class="keyword-score">
            <span class="score-label">Relevancia para el sector: </span>
            <span class="score-value ${analysis.score < 40 ? 'low' : analysis.score < 70 ? 'medium' : 'high'}">
              ${analysis.score}%
            </span>
          </div>`;
          
          // Sugerencias de palabras clave
          if (analysis.missing.length > 0) {
            feedbackContent += `<div class="keyword-suggestions">
              <span class="suggestions-label">Considera incluir alguna de estas palabras clave: </span>
              <div class="suggested-keywords">
                ${analysis.missing.map(kw => `<span class="keyword">${kw}</span>`).join('')}
              </div>
            </div>`;
          }
          
          feedbackContainer.innerHTML = feedbackContent;
          
          // Añadir estilos para el contenido
          const style = document.createElement('style');
          style.textContent = `
            .keyword-score { margin-bottom: 10px; }
            .score-value { font-weight: bold; }
            .score-value.low { color: #e74c3c; }
            .score-value.medium { color: #f39c12; }
            .score-value.high { color: #2ecc71; }
            .keyword-suggestions { margin-top: 5px; }
            .suggested-keywords { margin-top: 5px; display: flex; flex-wrap: wrap; gap: 5px; }
            .keyword { 
              background-color: rgba(52, 152, 219, 0.2); 
              padding: 3px 8px; 
              border-radius: 12px; 
              font-size: 12px;
              cursor: pointer;
            }
            .keyword:hover {
              background-color: rgba(52, 152, 219, 0.4);
            }
          `;
          document.head.appendChild(style);
          
          // Añadir funcionalidad para insertar palabras clave al hacer clic
          feedbackContainer.querySelectorAll('.keyword').forEach(keywordEl => {
            keywordEl.addEventListener('click', () => {
              // Insertar la palabra clave en el texto actual
              textarea.value += (textarea.value.endsWith(' ') || textarea.value === '' ? '' : ' ') + 
                                keywordEl.textContent + ' ';
              
              // Disparar evento input para actualizar el análisis
              textarea.dispatchEvent(new Event('input'));
              
              // Enfocar el textarea
              textarea.focus();
            });
          });
        } else {
          feedbackContainer.style.display = 'none';
        }
      }, 500);
    });
  });
}

// 4. Función para añadir corrector gramatical básico
function setupGrammarChecker() {
  const textareas = document.querySelectorAll('textarea');
  
  // Lista básica de errores comunes
  const commonErrors = [
    { pattern: /\b([mst]e) ([aeiou])/gi, replacement: "$1 $2" }, // me e → me he
    { pattern: /\ba\s+([aeiouáéíóú])/gi, replacement: "a $1" }, // a el → al
    { pattern: /\bde\s+el\b/gi, replacement: "del" }, // de el → del
    { pattern: /[\.,;:]\s*[\.,;:]+/g, replacement: "." }, // doble puntuación
    { pattern: /\b[A-Za-zÁÉÍÓÚáéíóúÑñ]+\s+\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]+\b/g, replacement: match => match.replace(/\s+/g, ' ') }, // espacios dobles
    { pattern: /\b[A-Za-zÁÉÍÓÚáéíóúÑñ]+,,+[A-Za-zÁÉÍÓÚáéíóúÑñ]+\b/g, replacement: match => match.replace(/,,+/g, ',') }, // comas dobles
    { pattern: /\s+\./g, replacement: "." }, // espacio antes del punto
    { pattern: /\s+,/g, replacement: "," }, // espacio antes de la coma
  ];
  
  textareas.forEach(textarea => {
    // Crear contenedor para las correcciones
    const correctionsContainer = document.createElement('div');
    correctionsContainer.className = 'grammar-corrections';
    correctionsContainer.style.marginTop = '10px';
    correctionsContainer.style.display = 'none';
    
    // Insertar después del textarea
    textarea.parentNode.insertBefore(correctionsContainer, textarea.nextSibling);
    
    // Monitorear cambios
    let grammarTimer;
    textarea.addEventListener('input', () => {
      clearTimeout(grammarTimer);
      grammarTimer = setTimeout(() => {
        // Buscar errores
        let text = textarea.value;
        let hasCorrections = false;
        let corrections = [];
        
        commonErrors.forEach(({ pattern, replacement }) => {
          // Buscar coincidencias
          let match;
          while ((match = pattern.exec(text)) !== null) {
            // Reemplazar
            const corrected = match[0].replace(pattern, replacement);
            
            // Si hay un cambio, añadirlo a la lista de correcciones
            if (corrected !== match[0]) {
              hasCorrections = true;
              corrections.push({
                original: match[0],
                corrected: corrected,
                index: match.index
              });
            }
          }
        });
        
        // Mostrar correcciones si las hay
        if (hasCorrections) {
          correctionsContainer.style.display = 'block';
          correctionsContainer.innerHTML = `
            <div class="grammar-heading">
              <i class="fa fa-check-circle"></i> Sugerencias gramaticales:
            </div>
            <ul class="corrections-list">
              ${corrections.map(correction => `
                <li class="correction-item">
                  <span class="original">"${correction.original}"</span> →
                  <span class="corrected">"${correction.corrected}"</span>
                  <button class="apply-correction" data-original="${correction.original}" data-corrected="${correction.corrected}">
                    Aplicar
                  </button>
                </li>
              `).join('')}
            </ul>
          `;
          
          // Estilos para las correcciones
          correctionsContainer.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
          correctionsContainer.style.padding = '10px';
          correctionsContainer.style.borderRadius = '5px';
          
          const style = document.createElement('style');
          style.textContent = `
            .grammar-heading { 
              font-weight: bold; 
              margin-bottom: 10px; 
              color: #2ecc71;
            }
            .corrections-list { 
              list-style: none; 
              padding: 0; 
              margin: 0; 
            }
            .correction-item { 
              margin-bottom: 5px; 
              display: flex; 
              align-items: center;
              gap: 10px;
            }
            .original { 
              color: #e74c3c; 
              text-decoration: line-through; 
            }
            .corrected { 
              color: #2ecc71; 
              font-weight: bold; 
            }
            .apply-correction {
              background-color: #2ecc71;
              color: white;
              border: none;
              border-radius: 3px;
              padding: 2px 5px;
              font-size: 12px;
              cursor: pointer;
              margin-left: auto;
            }
            .apply-correction:hover {
              background-color: #27ae60;
            }
          `;
          document.head.appendChild(style);
          
          // Añadir funcionalidad a los botones de aplicar
          correctionsContainer.querySelectorAll('.apply-correction').forEach(button => {
            button.addEventListener('click', () => {
              const original = button.getAttribute('data-original');
              const corrected = button.getAttribute('data-corrected');
              
              // Reemplazar en el texto
              textarea.value = textarea.value.replace(original, corrected);
              
              // Disparar evento input para actualizar
              textarea.dispatchEvent(new Event('input'));
            });
          });
        } else {
          correctionsContainer.style.display = 'none';
        }
      }, 1000); // Verificar después de 1 segundo de inactividad
    });
  });
}

// 5. Función para añadir adaptación a ofertas de trabajo
function setupJobOfferAdaptation() {
  // Crear contenedor principal
  const adaptContainer = document.createElement('div');
  adaptContainer.className = 'job-adapt-container';
  adaptContainer.innerHTML = `
    <h3>Adaptar CV a Oferta de Trabajo</h3>
    <p>Pega aquí el texto de una oferta de trabajo para adaptar tu CV automáticamente:</p>
    <textarea id="job-offer-text" rows="5" placeholder="Pega aquí el texto de la oferta..."></textarea>
    <button id="analyze-job-btn" class="next-section-btn" style="margin-top: 10px;">
      <i class="fa fa-magic"></i> Analizar y Adaptar
    </button>
    <div id="job-analysis-result" style="display: none;"></div>
  `;
  
  // Estilizar el contenedor
  adaptContainer.style.padding = '20px';
  adaptContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  adaptContainer.style.borderRadius = '15px';
  adaptContainer.style.marginTop = '30px';
  adaptContainer.style.marginBottom = '30px';
  
  // Añadir al formulario (al final)
  const formSection = document.getElementById('section2');
  if (formSection) {
    const textBlock = formSection.querySelector('.text-block');
    textBlock.appendChild(adaptContainer);
    
    // Configurar eventos
    setupJobOfferAnalysis();
  }
}

// Función para configurar el análisis de ofertas de trabajo
function setupJobOfferAnalysis() {
  const analyzeBtn = document.getElementById('analyze-job-btn');
  const jobTextarea = document.getElementById('job-offer-text');
  const resultsContainer = document.getElementById('job-analysis-result');
  
  if (analyzeBtn && jobTextarea && resultsContainer) {
    analyzeBtn.addEventListener('click', () => {
      const jobText = jobTextarea.value.trim();
      
      if (jobText.length < 50) {
        alert('Por favor, introduce un texto de oferta de trabajo más detallado para analizarlo correctamente.');
        return;
      }
      
      // Mostrar indicador de carga
      resultsContainer.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Analizando oferta de trabajo...</p>
        </div>
      `;
      resultsContainer.style.display = 'block';
      
      // Simular procesamiento (en una aplicación real, aquí llamarías a la API de IA)
      setTimeout(() => {
        // Extraer palabras clave del texto de la oferta
        const jobKeywords = extractKeywords(jobText);
        
        // Generar recomendaciones
        const recommendations = generateRecommendations(jobKeywords);
        
        // Mostrar resultados
        resultsContainer.innerHTML = `
          <div class="job-analysis">
            <h4>Análisis Completado</h4>
            <div class="job-keywords">
              <p><strong>Palabras clave detectadas:</strong></p>
              <div class="keyword-tags">
                ${jobKeywords.map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
              </div>
            </div>
            <div class="recommendations">
              <p><strong>Recomendaciones para optimizar tu CV:</strong></p>
              <ul class="recommendations-list">
                ${recommendations.map(rec => `
                  <li class="recommendation-item">
                    <p>${rec.text}</p>
                    ${rec.action ? `<button class="apply-recommendation" data-action="${rec.action}" data-target="${rec.target}" data-content="${rec.content}">Aplicar</button>` : ''}
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        `;
        
        // Añadir estilos
        const style = document.createElement('style');
        style.textContent = `
          .job-analysis {
            margin-top: 20px;
          }
          .keyword-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin: 10px 0;
          }
          .keyword-tag {
            background-color: rgba(52, 152, 219, 0.2);
            color: #2980b9;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 13px;
          }
          .recommendations-list {
            margin-top: 10px;
            padding-left: 20px;
          }
          .recommendation-item {
            margin-bottom: 15px;
            position: relative;
          }
          .apply-recommendation {
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            margin-top: 5px;
          }
          .apply-recommendation:hover {
            background-color: #2980b9;
          }
          .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
          }
        `;
        document.head.appendChild(style);
        
        // Configurar eventos para los botones de recomendación
        const applyButtons = document.querySelectorAll('.apply-recommendation');
        applyButtons.forEach(button => {
          button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            const target = button.getAttribute('data-target');
            const content = button.getAttribute('data-content');
            
            // Aplicar la recomendación
            applyRecommendation(action, target, content);
            
            // Actualizar botón
            button.textContent = '✓ Aplicado';
            button.disabled = true;
            button.style.backgroundColor = '#2ecc71';
          });
        });
      }, 2000); // Simular 2 segundos de procesamiento
    });
  }
}

// Función para extraer palabras clave de una oferta de trabajo
function extractKeywords(jobText) {
  // En una aplicación real, esto utilizaría NLP o la API de IA
  // Aquí simulamos un análisis básico
  
  // Normalizar el texto
  const text = jobText.toLowerCase();
  
  // Palabras clave relevantes para CVs (simuladas)
  const allKeywords = [
    "experiencia", "años", "conocimientos", "habilidades", "competencias",
    "requisitos", "formación", "estudios", "grado", "licenciatura", "máster",
    "técnico", "especialista", "desarrollador", "analista", "gerente", "líder",
    "coordinador", "gestión", "dirección", "proyecto", "equipo", "cliente",
    "producto", "servicio", "ventas", "marketing", "diseño", "programación",
    "software", "hardware", "datos", "análisis", "comunicación", "creativo",
    "innovador", "proactivo", "organizado", "responsable", "autónomo",
    "trabajar en equipo", "bajo presión", "objetivos", "resultados", "orientado a",
    "microsoft", "office", "excel", "word", "powerpoint", "outlook", 
    "python", "java", "javascript", "html", "css", "react", "angular", "node",
    "sql", "nosql", "mongodb", "aws", "azure", "cloud", "docker", "kubernetes",
    "agile", "scrum", "kanban", "jira", "confluence", "git", "github", "gitlab",
    "inglés", "francés", "alemán", "idiomas", "b2", "c1", "nivel alto",
    "responsabilidades", "funciones", "tareas", "ofrecemos", "beneficios",
    "salario", "remuneración", "contrato", "jornada", "remoto", "presencial", "híbrido"
  ];
  
  // Encontrar coincidencias
  const foundKeywords = allKeywords.filter(keyword => 
    text.includes(keyword) || text.includes(keyword.replace(" ", ""))
  );
  
  // Limitar a máximo 10 palabras clave
  return foundKeywords.slice(0, 10);
}

// Función para generar recomendaciones basadas en palabras clave
function generateRecommendations(keywords) {
  const recommendations = [];
  
  // Recomendaciones basadas en palabras clave específicas
  if (keywords.includes("experiencia") || keywords.includes("años")) {
    recommendations.push({
      text: "Destaca tus años de experiencia relevante al principio de cada descripción de trabajo.",
      action: "modify",
      target: "experience",
      content: "Añadir años de experiencia"
    });
  }
  
  if (keywords.includes("inglés") || keywords.includes("idiomas")) {
    recommendations.push({
      text: "Añade tu nivel de idiomas a las habilidades.",
      action: "add",
      target: "skills",
      content: "Inglés (Nivel B2)"
    });
  }
  
  if (keywords.includes("equipo") || keywords.includes("trabajar en equipo")) {
    recommendations.push({
      text: "Menciona tus habilidades de trabajo en equipo en el resumen profesional.",
      action: "modify",
      target: "summary",
      content: "trabajo en equipo"
    });
  }
  
  // Agrega recomendaciones basadas en tecnologías/herramientas
  const techKeywords = ["python", "java", "javascript", "html", "css", "react", "angular", "node", 
                        "sql", "nosql", "mongodb", "aws", "azure", "excel", "word", "powerpoint"];
  
  const foundTech = techKeywords.filter(tech => keywords.includes(tech));
  if (foundTech.length > 0) {
    recommendations.push({
      text: `Asegúrate de incluir explícitamente estas tecnologías en tus habilidades: ${foundTech.join(", ")}.`,
      action: "add",
      target: "skills",
      content: foundTech.join(", ")
    });
  }
  
  // Recomendaciones generales
  recommendations.push({
    text: "Adapta tu resumen profesional para que haga eco a las responsabilidades mencionadas en la oferta.",
    action: null
  });
  
  recommendations.push({
    text: "Reordena tus habilidades poniendo primero las más relevantes para esta oferta.",
    action: null
  });
  
  return recommendations;
}

// Función para aplicar recomendaciones
function applyRecommendation(action, target, content) {
  switch (action) {
    case "add":
      if (target === "skills") {
        // Añadir a las habilidades
        const skillsTextarea = document.querySelector('textarea[name="skills"]');
        if (skillsTextarea) {
          const currentSkills = skillsTextarea.value.trim();
          skillsTextarea.value = currentSkills ? `${currentSkills}, ${content}` : content;
          skillsTextarea.dispatchEvent(new Event('input')); // Disparar evento input
        }
      }
      break;
      
    case "modify":
      if (target === "summary") {
        // Modificar el resumen (simulado - en una app real esto modificaría el prompt de IA)
        document.getElementById('ai-summary').dataset.keywords = 
          (document.getElementById('ai-summary').dataset.keywords || '') + ',' + content;
        
        // Avisar al usuario
        alert(`La palabra clave "${content}" se usará en la generación del resumen profesional.`);
      }
      else if (target === "experience") {
        // Modificar experiencia
        document.querySelectorAll('.experience-entry textarea').forEach(textarea => {
          if (!textarea.value.toLowerCase().includes('años de experiencia')) {
            const text = textarea.value;
            textarea.value = text.replace(/^\s*/, match => 
              `Con amplios años de experiencia. ${match}`
            );
            textarea.dispatchEvent(new Event('input')); // Disparar evento input
          }
        });
      }
      break;
  }
}

// 6. Función para implementar sugerencias personalizadas mientras se escribe
function setupSuggestions() {
  const textareas = document.querySelectorAll('textarea[name="description"]');
  
  textareas.forEach(textarea => {
    // Crear el contenedor de sugerencias
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'suggestions-container';
    suggestionsContainer.style.display = 'none';
    suggestionsContainer.style.position = 'absolute';
    suggestionsContainer.style.width = '100%';
    suggestionsContainer.style.marginTop = '5px';
    suggestionsContainer.style.backgroundColor = 'white';
    suggestionsContainer.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    suggestionsContainer.style.borderRadius = '5px';
    suggestionsContainer.style.zIndex = '100';
    suggestionsContainer.style.padding = '5px 0';
    
    // Añadir al DOM
    textarea.parentNode.style.position = 'relative';
    textarea.parentNode.appendChild(suggestionsContainer);
    
    // Sugerencias preconfiguradas basadas en tipos comunes de experiencia
    const suggestionsByPrefix = {
      "Respons": [
        "Responsable de la gestión y coordinación del equipo de trabajo.",
        "Responsable del análisis y optimización de procesos internos.",
        "Responsable de la implementación y seguimiento de proyectos."
      ],
      "Desarroll": [
        "Desarrollo e implementación de soluciones técnicas para mejorar la eficiencia.",
        "Desarrollo de nuevas funcionalidades y mantenimiento de las existentes.",
        "Desarrollo de estrategias para optimizar el rendimiento y la calidad."
      ],
      "Gestión": [
        "Gestión de proyectos desde la fase de planificación hasta la entrega final.",
        "Gestión de recursos y presupuestos para garantizar la rentabilidad.",
        "Gestión de relaciones con clientes clave y proveedores estratégicos."
      ],
      "Colabor": [
        "Colaboración con equipos multidisciplinares para alcanzar objetivos comunes.",
        "Colaboración en la definición e implementación de mejoras continuas.",
        "Colaboración estrecha con el departamento de calidad para garantizar estándares."
      ],
      "Implement": [
        "Implementación de metodologías ágiles para mejorar la eficiencia del equipo.",
        "Implementación de soluciones innovadoras que aumentaron la productividad en un 20%.",
        "Implementación y mantenimiento de sistemas críticos para el negocio."
      ],
      "Análisis": [
        "Análisis de datos para identificar oportunidades de mejora y optimización.",
        "Análisis y resolución de incidencias técnicas de forma eficiente.",
        "Análisis de requisitos y diseño de soluciones adaptadas a las necesidades."
      ],
      "Logr": [
        "Logré reducir los tiempos de entrega en un 15% mediante la optimización de procesos.",
        "Logré aumentar la satisfacción del cliente en un 25% a través de mejoras en el servicio.",
        "Logré implementar con éxito un nuevo sistema que mejoró la eficiencia operativa."
      ]
    };
    
    // Monitorear lo que escribe el usuario para mostrar sugerencias
    let typingTimer;
    textarea.addEventListener('input', () => {
      clearTimeout(typingTimer);
      
      typingTimer = setTimeout(() => {
        const text = textarea.value;
        const cursorPosition = textarea.selectionStart;
        
        // Obtener la palabra actual (desde el último espacio hasta el cursor)
        const textBeforeCursor = text.substring(0, cursorPosition);
        const words = textBeforeCursor.split(/\s+/);
        const currentWord = words[words.length - 1];
        
        // Buscar sugerencias que coincidan con el prefijo actual
        let matchingSuggestions = [];
        
        for (const [prefix, suggestions] of Object.entries(suggestionsByPrefix)) {
          if (currentWord.length >= 5 && prefix.toLowerCase().startsWith(currentWord.toLowerCase())) {
            matchingSuggestions = suggestions;
            break;
          }
        }
        
        // Mostrar sugerencias si las hay
        if (matchingSuggestions.length > 0) {
          suggestionsContainer.innerHTML = '';
          suggestionsContainer.style.display = 'block';
          
          matchingSuggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = suggestion;
            suggestionItem.style.padding = '8px 15px';
            suggestionItem.style.cursor = 'pointer';
            suggestionItem.style.transition = 'background-color 0.3s';
            
            suggestionItem.addEventListener('mouseenter', () => {
              suggestionItem.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
            });
            
            suggestionItem.addEventListener('mouseleave', () => {
              suggestionItem.style.backgroundColor = 'transparent';
            });
            
            suggestionItem.addEventListener('click', () => {
              // Reemplazar la palabra actual con la sugerencia completa
              const beforeWord = text.substring(0, cursorPosition - currentWord.length);
              const afterWord = text.substring(cursorPosition);
              textarea.value = beforeWord + suggestion + afterWord;
              
              // Actualizar la posición del cursor
              const newPosition = beforeWord.length + suggestion.length;
              textarea.setSelectionRange(newPosition, newPosition);
              
              // Ocultar sugerencias
              suggestionsContainer.style.display = 'none';
              
              // Dar foco al textarea
              textarea.focus();
            });
            
            suggestionsContainer.appendChild(suggestionItem);
          });
        } else {
          suggestionsContainer.style.display = 'none';
        }
      }, 300);
    });
    
    // Ocultar sugerencias al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!textarea.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.style.display = 'none';
      }
    });
  });
}

// Inicializar todas las mejoras de IA cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  setupRealtimeFeedback();
  setupGrammarChecker();
  setupJobOfferAdaptation();
  setupSuggestions();
});
// Función para forzar un repaint en elementos fijos cuando se desplaza
function forceRepaintOnScroll() {
  let lastScrollPosition = 0;
  const fixedElements = document.querySelectorAll('.progress-bar, .theme-toggle');
  
  window.addEventListener('scroll', function() {
    // Verificar si ha habido un desplazamiento significativo
    if (Math.abs(window.scrollY - lastScrollPosition) > 50) {
      lastScrollPosition = window.scrollY;
      
      // Forzar repaint en elementos fijos
      fixedElements.forEach(element => {
        // Técnica para forzar repaint: modificar temporalmente el estilo
        const originalDisplay = element.style.display;
        element.style.display = 'none';
        // Este pequeño retraso es necesario para que el navegador procese el cambio
        setTimeout(() => {
          element.style.display = originalDisplay;
        }, 1);
      });
    }
  });
}

// Inicializar la función cuando se carga el documento
document.addEventListener('DOMContentLoaded', forceRepaintOnScroll);

// Añade esta función al final de tu archivo script.js

// Función para asegurar que las secciones permanezcan visibles después de la navegación
function ensureSectionsVisibility() {
  // Crear observador de intersección para detectar qué sección está en viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Si la sección está visible
      if (entry.isIntersecting) {
        const section = entry.target;
        const sectionIndex = Array.from(sections).indexOf(section);
        
        // Asegurar que la sección sea visible (forzar opacity 1)
        gsap.to(section, { opacity: 1, duration: 0.3 });
        gsap.to(section.querySelector(".text-block"), { opacity: 1, y: 0, duration: 0.3 });
        gsap.to(section.querySelector(".image-block"), { opacity: 1, x: 0, duration: 0.3 });
        
        // Actualizar tema basado en la sección actual
        applyTheme(sectionIndex);
        
        // Actualizar pasos activos en la barra de progreso
        steps.forEach((step, i) => {
          if (i <= sectionIndex) {
            step.classList.add("active");
          } else {
            step.classList.remove("active");
          }
        });
      }
    });
  }, { threshold: 0.3 }); // Modificar este valor según sea necesario
  
  // Observar todas las secciones
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Ejecutar la función cuando la página se haya cargado completamente
window.addEventListener('load', ensureSectionsVisibility);

// Mejorar evento de clic para la navegación entre secciones
steps.forEach((step, index) => {
  step.addEventListener("click", () => {
    // Desplazamiento suave a la sección
    sections[index].scrollIntoView({ behavior: "smooth" });
    
    // Forzar la visibilidad de la sección target después de un breve retraso
    setTimeout(() => {
      gsap.to(sections[index], { opacity: 1, duration: 0.3 });
      gsap.to(sections[index].querySelector(".text-block"), { opacity: 1, y: 0, duration: 0.3 });
      gsap.to(sections[index].querySelector(".image-block"), { opacity: 1, x: 0, duration: 0.3 });
    }, 500);
    
    // Actualizar el tema
    applyTheme(index);
    
    // Actualizar pasos activos
    steps.forEach((s, i) => {
      if (i <= index) s.classList.add("active");
      else s.classList.remove("active");
    });
  });
});