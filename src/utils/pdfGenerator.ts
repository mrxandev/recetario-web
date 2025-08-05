import jsPDF from 'jspdf';
import type { PurchasedRecipe } from '../context/CartContext';

export function generateRecipePDF(recipe: PurchasedRecipe) {
  const doc = new jsPDF();
  
  // Configuración inicial
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let currentY = margin;
  
  // Función auxiliar para verificar si necesitamos una nueva página
  const checkNewPage = (spaceNeeded: number = 20) => {
    if (currentY + spaceNeeded > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };
  
  // Función auxiliar para agregar texto con salto de línea automático
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    const textLines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    const lineHeight = fontSize * 0.4;
    const totalHeight = textLines.length * lineHeight + 5;
    
    // Verificar si necesitamos nueva página
    checkNewPage(totalHeight);
    
    doc.text(textLines, margin, currentY);
    currentY += totalHeight;
  };
  
  // Función auxiliar para agregar línea
  const addLine = () => {
    checkNewPage(15);
    doc.setDrawColor(100, 100, 100);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;
  };
  
  // Función auxiliar para agregar espacio
  const addSpace = (space: number = 10) => {
    currentY += space;
  };
  
  // Título principal
  addText('RECETA PREMIUM', 24, true);
  addLine();
  
  // Nombre de la receta
  addText(recipe.title, 18, true);
  addSpace(10);
  
  // Información básica
  addText('INFORMACIÓN GENERAL', 14, true);
  addText(`Categoría: ${recipe.category}`, 12);
  addText(`Tiempo de cocción: ${recipe.cookingTime}`, 12);
  addText(`Dificultad: ${recipe.difficulty}`, 12);
  addText(`Precio: $${recipe.price.toFixed(2)}`, 12);
  addText(`Fecha de compra: ${new Date(recipe.purchaseDate).toLocaleDateString('es-ES')}`, 12);
  
  addSpace(15);
  addLine();
  
  // Ingredientes (datos simulados ya que no tenemos ingredientes reales)
  addText('INGREDIENTES', 16, true);
  addSpace(5);
  const ingredientes = getSimulatedIngredients(recipe.category);
  ingredientes.forEach(ingrediente => {
    addText(`• ${ingrediente}`, 11);
  });
  
  addSpace(15);
  addLine();
  
  // Instrucciones (datos simulados)
  addText('INSTRUCCIONES DE PREPARACIÓN', 16, true);
  addSpace(5);
  const instrucciones = getSimulatedInstructions(recipe.category);
  instrucciones.forEach((instruccion, index) => {
    addText(`${index + 1}. ${instruccion}`, 11);
    addSpace(5);
  });
  
  addSpace(15);
  addLine();
  
  // Consejos (datos simulados)
  addText('CONSEJOS DEL CHEF', 16, true);
  addSpace(5);
  const consejos = getSimulatedTips(recipe.category);
  consejos.forEach(consejo => {
    addText(`💡 ${consejo}`, 10);
    addSpace(5);
  });
  
  addSpace(20);
  addLine();
  
  // Mensaje final
  addText('¡Disfruta tu deliciosa receta!', 14, true);
  addText('Gracias por tu compra. Esta receta ha sido especialmente seleccionada para ti.', 10);
  
  // Información de la empresa - siempre al final de la última página
  const finalY = pageHeight - 40;
  if (currentY > finalY - 20) {
    doc.addPage();
  }
  
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Recetario Premium - https://mrxandev-recetario.vercel.app/', margin, pageHeight - 30);
  doc.text(`ID de compra: ${recipe.id}`, margin, pageHeight - 22);
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, margin, pageHeight - 14);
  
  // Descargar el PDF
  doc.save(`receta-${recipe.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.pdf`);
}

// Funciones auxiliares para generar contenido simulado basado en la categoría
function getSimulatedIngredients(category: string): string[] {
  const ingredientsByCategory: Record<string, string[]> = {
    'Platos principales': [
      '500g de pollo cortado en cubos',
      '2 cebollas medianas picadas',
      '3 dientes de ajo picados',
      '400ml de caldo de pollo',
      '200ml de crema de leche',
      '2 cucharadas de aceite de oliva',
      'Sal y pimienta al gusto',
      '1 cucharadita de orégano',
      '1 hoja de laurel'
    ],
    'Postres': [
      '200g de chocolate semi-amargo',
      '100g de mantequilla sin sal',
      '3 huevos grandes',
      '150g de azúcar',
      '80g de harina',
      '1 pizca de sal',
      '1 cucharadita de extracto de vainilla',
      'Azúcar glas para decorar'
    ],
    'Entradas': [
      '200g de queso crema',
      '1 aguacate maduro',
      '1 tomate grande',
      '1/2 cebolla roja',
      '2 cucharadas de limón',
      'Crackers o pan tostado',
      'Sal y pimienta',
      'Perejil fresco picado'
    ],
    'Bebidas': [
      '1 taza de frutas mixtas congeladas',
      '1 plátano maduro',
      '200ml de leche de almendras',
      '2 cucharadas de miel',
      '1 cucharada de semillas de chía',
      'Hielo al gusto',
      '1 cucharadita de extracto de vainilla'
    ]
  };
  
  return ingredientsByCategory[category] || ingredientsByCategory['Platos principales'];
}

function getSimulatedInstructions(category: string): string[] {
  const instructionsByCategory: Record<string, string[]> = {
    'Platos principales': [
      'Preparación inicial: Lava y corta todos los ingredientes antes de comenzar a cocinar. Esto te ayudará a mantener un flujo de trabajo eficiente.',
      'Calentar el aceite en una sartén grande a fuego medio-alto. Asegúrate de que la sartén esté bien caliente antes de agregar el pollo.',
      'Agregar el pollo cortado en cubos y cocinar durante 6-8 minutos, volteando ocasionalmente hasta que esté dorado por todos lados.',
      'Reducir el fuego a medio y añadir la cebolla picada y el ajo. Cocinar por 3-4 minutos hasta que estén transparentes y aromáticos.',
      'Verter el caldo de pollo caliente y agregar la hoja de laurel y el orégano. Mezclar bien para combinar todos los sabores.',
      'Llevar la mezcla a ebullición, luego reducir el fuego y cocinar a fuego lento por 20-25 minutos hasta que el pollo esté completamente tierno.',
      'Incorporar la crema de leche gradualmente, mezclando constantemente para evitar que se corte. Sazonar con sal y pimienta al gusto.',
      'Cocinar por 5-7 minutos más hasta que la salsa espese ligeramente y tenga una consistencia cremosa.',
      'Retirar la hoja de laurel antes de servir. Acompañar con arroz blanco, pasta o puré de papas al gusto.',
      'Decorar con perejil fresco picado y servir inmediatamente mientras esté caliente.'
    ],
    'Postres': [
      'Preparación del horno: Precalentar el horno a 180°C y engrasar bien un molde rectangular de 20x20cm con mantequilla.',
      'Derretir el chocolate semi-amargo junto con la mantequilla en baño maría, revolviendo constantemente hasta obtener una mezcla lisa y homogénea.',
      'En un tazón grande, batir los huevos con el azúcar durante 5-7 minutos hasta obtener una mezcla espumosa y de color claro.',
      'Incorporar el chocolate derretido a la mezcla de huevos de forma gradual, mezclando suavemente para no perder aire.',
      'Agregar el extracto de vainilla y mezclar bien para distribuir el sabor uniformemente.',
      'Tamizar la harina junto con la pizca de sal directamente sobre la mezcla y doblar suavemente con una espátula.',
      'Verter la mezcla en el molde preparado, nivelando la superficie con la espátula.',
      'Hornear durante 25-30 minutos. El centro debe estar ligeramente húmedo pero no líquido.',
      'Retirar del horno y dejar enfriar completamente en el molde antes de desmoldar (al menos 2 horas).',
      'Cortar en cuadrados y espolvorear con azúcar glas antes de servir. Se puede acompañar con helado de vainilla.'
    ],
    'Entradas': [
      'Selección de ingredientes: Elige aguacates que cedan ligeramente al presionar pero que no estén demasiado blandos.',
      'Cortar el aguacate por la mitad longitudinalmente, retirar el hueso y extraer toda la pulpa con una cuchara.',
      'En un tazón mediano, machacar la pulpa del aguacate con un tenedor hasta obtener la textura deseada (puede ser chunky o cremosa).',
      'Agregar el queso crema a temperatura ambiente y mezclar vigorosamente hasta obtener una textura completamente cremosa y uniforme.',
      'Preparar las verduras: picar finamente el tomate (sin semillas para evitar exceso de líquido) y la cebolla roja.',
      'Incorporar el tomate y la cebolla a la mezcla de aguacate, mezclando suavemente para distribuir uniformemente.',
      'Agregar el jugo de limón fresco inmediatamente para prevenir la oxidación y añadir frescura al sabor.',
      'Sazonar con sal y pimienta recién molida al gusto. Probar y ajustar los condimentos según preferencia.',
      'Refrigerar la mezcla durante al menos 30 minutos para que los sabores se integren y la textura se asiente.',
      'Servir en platos individuales o en un tazón grande, acompañado de crackers artesanales o pan tostado.',
      'Decorar con perejil fresco picado y una rodaja de limón antes de servir para presentación.'
    ],
    'Bebidas': [
      'Preparación de ingredientes: Si las frutas no están congeladas, colócalas en el congelador por al menos 2 horas antes de usar.',
      'Pelar el plátano y cortarlo en rodajas medianas para facilitar el licuado y evitar sobrecargar la licuadora.',
      'En la licuadora, colocar primero los líquidos: la leche de almendras y la miel para crear una base líquida.',
      'Agregar las frutas congeladas de manera gradual, comenzando con las más pequeñas y luego las más grandes.',
      'Añadir las rodajas de plátano, las semillas de chía previamente hidratadas y el extracto de vainilla.',
      'Licuar a velocidad baja inicialmente para romper las frutas congeladas, luego aumentar gradualmente la velocidad.',
      'Licuar durante 2-3 minutos a velocidad alta hasta obtener una consistencia completamente lisa y cremosa.',
      'Si la consistencia es muy espesa, agregar más leche de almendras gradualmente hasta alcanzar la textura deseada.',
      'Si deseas más dulzor, agregar miel adicional y licuar brevemente para incorporar.',
      'Agregar cubos de hielo si deseas una textura más fría y refrescante, licuar por 30 segundos más.',
      'Servir inmediatamente en vasos bien fríos, decorar con frutas frescas y semillas adicionales si se desea.'
    ]
  };
  
  return instructionsByCategory[category] || instructionsByCategory['Platos principales'];
}

function getSimulatedTips(category: string): string[] {
  const tipsByCategory: Record<string, string[]> = {
    'Platos principales': [
      'Para obtener un sabor más profundo e intenso, marina el pollo en una mezcla de yogur, ajo y especias durante al menos 30 minutos antes de cocinar.',
      'Si prefieres una versión más saludable, puedes sustituir la crema de leche por leche de coco o crema de anacardos para mantener la cremosidad.',
      'Este plato se conserva perfectamente en el refrigerador por hasta 3 días y mejora en sabor al reposar.',
      'Para una presentación más elegante, sirve en platos individuales y decora con hierbas frescas como cilantro o perejil.',
      'Si el plato queda muy líquido, mezcla una cucharada de maicena con agua fría y agrégala para espesar.',
      'Acompaña con arroz basmati, quinoa o pasta para convertirlo en un plato completo y nutritivo.'
    ],
    'Postres': [
      'El secreto de un brownie perfecto está en no sobrebatir la mezcla después de agregar la harina, esto evita que quede duro.',
      'Para verificar el punto de cocción, inserta un palillo en el centro: debe salir con algunas migajas húmedas pero no líquido.',
      'Puedes personalizar agregando nueces picadas, chips de chocolate blanco o frambuesas frescas antes de hornear.',
      'Se puede preparar con hasta un día de anticipación, de hecho mejora en sabor y textura al reposar.',
      'Para un toque gourmet, sirve tibio con una bola de helado de vainilla y un chorrito de salsa de caramelo.',
      'Guarda los brownies en un recipiente hermético a temperatura ambiente por hasta 5 días.',
      'Para brownies más fudgy, reduce el tiempo de horneado en 5 minutos; para más cake-like, aumenta 5 minutos.'
    ],
    'Entradas': [
      'La clave está en elegir aguacates que cedan ligeramente al presionar pero que no estén demasiado maduros.',
      'Agrega el limón inmediatamente después de machacar el aguacate para evitar la oxidación y mantener el color verde vibrante.',
      'Para un toque picante y mexicano, agrega jalapeños finamente picados o una pizca de chile en polvo.',
      'Si sobra, cubre directamente con film plástico pegado a la superficie para evitar que se oxide.',
      'Puedes variar agregando pepino picado para más frescura o tomates cherry para más color.',
      'Sirve en tostadas de pan integral, crackers artesanales o como dip para vegetales crudos.',
      'Para una versión más cremosa, agrega un poco más de queso crema; para más textura, deja el aguacate más chunky.'
    ],
    'Bebidas': [
      'Congela las frutas la noche anterior para obtener una textura naturalmente cremosa y fría sin necesidad de hielo.',
      'Las semillas de chía se pueden remojar en agua por 15 minutos antes de usar para facilitar la digestión y crear una textura más suave.',
      'Experimenta con diferentes combinaciones: mango-piña para tropical, berries mixtos para antioxidantes, o plátano-mantequilla de maní para proteína.',
      'Si queda muy espeso, agrega más líquido gradualmente; si muy líquido, agrega más fruta congelada o hielo.',
      'Para un boost nutricional extra, agrega una cucharada de proteína en polvo, espinaca baby o col rizada (no alterará el sabor).',
      'Sirve inmediatamente para mantener la textura cremosa, o guarda en el refrigerador por máximo 4 horas.',
      'Decora con granola casera, coco rallado, semillas de girasol o frutas frescas cortadas para una presentación atractiva.'
    ]
  };
  
  return tipsByCategory[category] || tipsByCategory['Platos principales'];
}
