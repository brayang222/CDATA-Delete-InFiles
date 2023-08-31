const fs = require('fs-extra');
const path = require('path');

const directorioProcesar = 'procesar';
const directorioFormateados = 'formateados';
const directorioProcesados = 'procesados';

async function procesarArchivos() {
  try {
    const archivos = await fs.readdir(directorioProcesar);

    for (const archivo of archivos) {
      if (archivo.endsWith('.xml')) {
        const rutaArchivo = path.join(directorioProcesar, archivo);
        const contenido = await fs.readFile(rutaArchivo, 'utf-8');
        const contenidoModificado = processXml(contenido);

        const nombreArchivoFormateado = `f_${archivo}`;
        const rutaArchivoFormateado = path.join(directorioFormateados, nombreArchivoFormateado);

        const rutaArchivoProcesado = path.join(directorioProcesados, archivo);

        await fs.writeFile(rutaArchivoFormateado, contenidoModificado);
        await fs.rename(rutaArchivo, rutaArchivoProcesado);
      }
    }

    console.log('Proceso completado.');
  } catch (error) {
    console.error('Ocurrió un error:', error);
  }
}

function processXml(xmlContent) {
  const cdataPattern = /<!\[CDATA\[(.*?)]]>/gs;
  const modifiedXml = xmlContent.replace(cdataPattern, function(match, cdataContent) {
    const modifiedCData = cdataContent.replace(/<\?xml[^?]*\?>/g, '');

    // Buscar y modificar las etiquetas según lo requerido
    const modifiedWithConcatenation = modifiedCData.replace(/<cac:InvoiceLine>.*?<cac:Item>(?=.*?<cbc:Description>.*?<\/cbc:Description>.*?<cbc:Description>.*?<\/cbc:Description>).*?<\/cac:Item>.*?<\/cac:InvoiceLine>/gs,
      function(match) {
        const concatenatedDescription = match.replace(/<cbc:Description>(.*?)<\/cbc:Description>.*?<cbc:Description>(.*?)<\/cbc:Description>/gs, '<cbc:Description>$1 | $2<\/cbc:Description>'); // Anidar texto de ambas etiquetas
        return concatenatedDescription;
      });

    return modifiedWithConcatenation;
  });
  return modifiedXml;
}

procesarArchivos();
