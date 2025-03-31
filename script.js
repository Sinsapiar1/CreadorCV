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

  // Animación de las secciones siguientes con ScrollTrigger
  sections.forEach((section, index) => {
    if (index > 0) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "bottom 40%",
            toggleActions: "play reverse play reverse"
          }
        })
        .fromTo(
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
    sections[1].scrollIntoView({ behavior: "smooth" });
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