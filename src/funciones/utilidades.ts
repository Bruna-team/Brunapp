// @ts-ignore
import pdfMake from "pdfmake/build/pdfmake";
// @ts-ignore
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';

/**
 * Función de impresión con Quill
 * @param {object} header Objeto con el titulo y subtitulo del documento
 * @param {*} content contenido o body del documento
 * @param {object} configuration configuración de la hoja respecto a margenes, tamaño...
 * @param {boolean} quill contenido o body del documento
 */
function imprimirPdf (
  header: {title: String, subtitle: String},
  content: any,
  configuration: {
    orientation: String,
    margins: {
      mt: number,
      mr: number,
      mb: number,
      ml: number,
    },
    dimensions: {
      width: number,
      height: number,
    }
  },
  quill: Boolean) {
  const ret = htmlToPdfmake(content,
    {
      removeExtraBlanks: false,
      imagesByReference: true,
    });
  const docDefinition = {
    info: {
      title: `${header.title} - ${header.subtitle}`,
      author: "Bruna. E.T.C. 'Madre Rafols'"
    },
    content: quill ? JSON.parse(JSON.stringify(pdfmakeImgStack(ret.content))) : JSON.parse(JSON.stringify(content)),
    styles: {
      header1: {
        fontSize: 16,
        bold: true
      },
      header2: {
        fontSize: 15,
        bold: true
      },
      header3: {
        fontSize: 14
      },
      header4: {
        fontSize: 13
      },
      header5: {
        fontSize: 12,
        bold: true
      },
      tableTitle: {
        fontSize: 14,
        bold: true,
        alignment: 'center'
      },
      parrafo1: {
        fontSize: 9
      },
      'html-h1': {
        fontSize: 15,
        bold: true,
      },
      'html-h2': {
        fontSize: 14,
        bold: true,
      },
      'html-h3': {
        fontSize: 13,
      },
      'html-h4': {
        fontSize: 11,
      },
      'html-h5': {
        fontSize: 10,
        bold: true,
      },
      'html-h6': {
        fontSize: 9,
        bold: true,
        margin: 0,
      },
      'html-span': {
        fontSize: 9,
        margin: 0,
      },
      'html-p': {
        fontSize: 9,
        margin: 0,
      },
      'ql-align-left': {
        alignment: 'left',
      },
      'ql-align-center': {
        alignment: 'center',
      },
      'ql-align-right': {
        alignment: 'right',
      },
    },
    defaultStyle: {
      columnGap: 10,
      fontSize: 10
    },
    pageSize: configuration.dimensions.width || configuration.dimensions.height ? {
        width: conversorDeUnidad(configuration.dimensions.width),
        height: conversorDeUnidad(configuration.dimensions.height)
    } : 'LETTER',
    pageOrientation: configuration.orientation === 'landscape' || configuration.orientation === 'portrait'
        ? configuration.orientation : 'auto',
    pageMargins: [
      conversorDeUnidad(configuration.margins.ml),
      conversorDeUnidad(configuration.margins.mt),
      conversorDeUnidad(configuration.margins.mr),
      conversorDeUnidad(configuration.margins.mb)
    ],
    images: ret.images ? ret.images : [],
  }
  pdfMake.createPdf(docDefinition).open()
}

/**
 * Evita que las imágenes queden en un stack aparte y no junto al texto
 * @param {*} ret lista de items a evaluar
 * @return {*} items sin imágenes por url
 */
function pdfmakeImgStack(ret: any) {
  const contentWImageInStack: { nodeName: string; columns: any; }[] = [];
  ret.forEach((node: any) => {
    // @ts-ignore
    if(node.nodeName == 'P') {
      node.margin = [0, 0, 0, 0]
    }
    // @ts-ignore
    if(Object.hasOwn(node, 'stack')) {
      node.stack.forEach((span: any) => {
        // @ts-ignore
        if (Object.hasOwn(span, 'text')) {
          span.width = 'auto'
        }
      })
      contentWImageInStack.push({
       nodeName: 'column',
       columns:
         node.stack,
      })
    } else {
       contentWImageInStack.push(node);
    }
  });
  return contentWImageInStack;
}
/**
 * Convierte las unidades de cm a pt
 * @param {Number} mm Unidad en milímetros
 * @return {*} milímetros convertidos a puntos
 */
function conversorDeUnidad(mm: number) {
  const cm = mm / 10
  const pts = cm / 2.54 * 72
  return pts
}

export {imprimirPdf}