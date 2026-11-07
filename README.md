# ÉLORA — Tu estilo, tus reglas

Boutique de calzado femenino de demostración. HTML, CSS y JavaScript sin instalación de dependencias.

## Moda fresca, intro y atención

La segunda versión usa rosa, crema, verde lima y lila, con titulares gráficos y collages de producto. `fresh.css` aplica el nuevo diseño. Se mantienen las funciones del catálogo y carrito.

`assets/elora-intro.mp4`: intro animada de 16 segundos, H.264, 1280 × 720, 30 fps, sin audio. Presenta los seis modelos del catálogo. Proyecto editable de Remotion en la carpeta vecina `elora-intro`; ejecutar allí `npm run dev` para editar. Para regenerar el MP4: `npx remotion render EloraIntro ../elora/assets/elora-intro.mp4 --codec=h264 --crf=22 --pixel-format=yuv420p --concurrency=2`.

El asistente de `assistant.js` responde en el navegador con reglas y datos del catálogo sobre modelos, precios, talla, envíos, cambios, descuentos y cuidados. No usa un servicio externo de IA y no guarda conversaciones. No puede comprobar stock ni materiales reales. Permite abrir fichas, guía, promoción y carrito.

WhatsApp se configura en `contact-config.js`, campo `whatsapp`, con el número real y su código de país, solo dígitos. Hasta que se confirme el número, los botones muestran el estado pendiente y ofrecen el asistente; no se enlaza un número inventado. Una vez configurado, abren wa.me en una nueva pestaña con un mensaje editable, sin enviarlo automáticamente.

## Ver en local

Desde esta carpeta: `python -m http.server 4173 --bind 127.0.0.1`

Abrir http://127.0.0.1:4173. También puedes abrir index.html directamente; para almacenamiento local se recomienda el servidor. Las tipografías de Google necesitan internet; existen alternativas locales de respaldo.

## Incluye

Catálogo con seis modelos ilustrativos, filtros, búsqueda, orden por precio, favoritos, selección de tallas, carrito persistente con cantidades y eliminación, cupón ELORA15, popup a los 22 segundos, registro de correo con consentimiento en localStorage, simulación de compra con validación, historia de marca y páginas informativas en ventanas accesibles.

Los datos se guardan exclusivamente en el navegador: elora-cart, elora-favorites, elora-coupon y elora-subscribers. La sesión recuerda haber mostrado el popup. La política de privacidad incluye un botón para eliminar los datos de demo. La dirección del checkout no se persiste. No hay pagos, correos automáticos ni pedidos reales.

## Antes de vender

Confirmar la disponibilidad legal del nombre y dominio, datos del vendedor y contacto, productos y fotos reales, materiales, medidas, inventario, impuestos, logística y políticas según país. Añadir backend de pedidos e inventario, validación de precios/cupones en servidor, pasarela de pagos y proveedor de email con consentimiento y baja. Los precios, guías y condiciones actuales son ejemplos, no asesoramiento jurídico ni compromisos comerciales reales.

## Fotografías

Generadas con la herramienta integrada ImageGen y guardadas en assets/editorial.png y assets/collection.png. Las seis vistas de catálogo usan posiciones de fondo de la segunda imagen. No son fotografías de inventario real.

Prompts utilizados:

1. Editorial: luxury women's footwear boutique editorial campaign photograph, landscape 1536x1024; lower legs wearing dark chocolate leather pointed slingback kitten heels with gold buckle on cream travertine steps, linen skirt, soft afternoon sunlight, Mediterranean architectural shadows, empty taupe wall on left; no text, logos or watermark.
2. Colección: perfectly aligned 3 columns by 2 rows contact sheet, 1536x1024, six centered individual shoes on warm pale beige studio backgrounds: chocolate slingback, nude heeled sandal, ivory ballet flat, black horsebit loafer, burgundy pump, tan woven slide; consistent realistic ecommerce photography, no text, logos or people.

Identidad e historia propuestas para este concepto; no se atribuyen antigüedad, fabricación artesanal ni testimonios ficticios a un negocio real.
