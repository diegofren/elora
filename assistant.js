(() => {
  const panel = document.querySelector('#chat-panel');
  const toggle = document.querySelector('#chat-toggle');
  const messages = document.querySelector('#chat-messages');
  const input = document.querySelector('#chat-input');
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const contains = (text, words) => words.some(word => text.includes(word));
  let lastProduct = null;
  let previousFocus = null;
  function setChat(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded',String(open));
    if(open) { previousFocus = document.activeElement; input.focus({preventScroll:true}); }
    else if(previousFocus instanceof HTMLElement) previousFocus.focus({preventScroll:true});
    const unread = document.querySelector('.chat-unread');
    if(open && unread) unread.hidden = true;
  }
  toggle.addEventListener('click',()=>setChat(panel.hidden));
  document.querySelector('#chat-close').addEventListener('click',()=>setChat(false));
  document.querySelectorAll('[data-open-chat]').forEach(b=>b.addEventListener('click',()=>setChat(true)));
  panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();setChat(false)}});
  function addMessage(text, type, action) {
    while(messages.children.length>=60) messages.firstElementChild.remove();
    const bubble = document.createElement('div');
    bubble.className = `chat-message ${type}`;
    bubble.textContent = text;
    if(action) {
      const link = document.createElement('button');
      link.className='chat-action';link.textContent=action.label;
      link.addEventListener('click',action.run);bubble.append(link);
    }
    messages.append(bubble);messages.scrollTop=messages.scrollHeight;
  }
  const productAction = p => ({label:`Ver ${p.name} y elegir talla ↗`,run:()=>{setChat(false);showProduct(p.id)}});
  const infoAction = key => ({label:'Ver todos los detalles ↗',run:()=>{setChat(false);showInfo(key)}});
  function answer(raw) {
    const q = normalize(raw);
    const named = products.find(p=>new RegExp(`\\b${normalize(p.name)}\\b`).test(q));
    if(named) lastProduct=named;
    const contextProduct = named || (contains(q,['ese modelo','ese par','su precio','su material','esa talla','ese zapato']) ? lastProduct : null);
    if(contains(q,['whatsapp','humano','persona','asesor','telefono','numero','contactar','contacto'])) {
      const phone = window.ELORA_CONTACT?.whatsapp || '';
      return {text:phone?`Puedes escribir a nuestro WhatsApp ${window.ELORA_CONTACT.display || '+'+phone}. El botón abre la conversación; tú decides cuándo enviar el mensaje.`:'El WhatsApp comercial está pendiente de configurar. No tenemos un número de atención confirmado todavía. Mientras tanto puedo ayudarte con los modelos, las tallas, el bono y las políticas de muestra.',action:phone?{label:'Abrir WhatsApp ↗',run:openWhatsApp}:undefined};
    }
    if(contains(q,['material','cuero','piel','sintetic','vegano','fabric','origen','impermeab','garantia','stock','disponib','agotad'])) {
      return {text:`${contextProduct?contextProduct.name+': ':''}Los productos son ilustrativos. Los materiales, fabricante, garantías y existencias reales todavía no están confirmados. No puedo garantizar que un modelo sea de cuero, vegano, impermeable o esté disponible para venta.`,action:infoAction('contacto')};
    }
    if(contains(q,['dolor','juanete','ortopedic','fascitis','lesion','embaraz'])) return {text:'Puedo orientarte sobre los estilos del catálogo, pero estos modelos de muestra no tienen características ortopédicas ni de ajuste verificadas. Si hay dolor o una condición del pie, consulta a un profesional para elegir un calzado adecuado.'};
    if(contains(q,['descuent','cupon','bono','promo','oferta','15%'])) return {text:'Tu código de muestra es ELORA15: descuenta el 15% del subtotal de los productos y no del envío. Puedes obtenerlo registrando tu correo y consentimiento en el popup. En esta versión el registro queda solo en el navegador; no se envían emails.',action:{label:'Quiero mi bono ↗',run:()=>{setChat(false);openDialog('#newsletter-dialog')}}};
    if(contains(q,['envio','entrega','llega','domicilio','transport','cobertura','pais','ciudad'])) return {text:'En la demo, el envío cuesta $5 y es sin costo desde $120 de productos antes del descuento. La referencia de 2 a 5 días laborables es ilustrativa; cobertura, transportista y plazos reales están pendientes. Aquí no se realizan envíos.',action:infoAction('envios')};
    if(contains(q,['cambio','devol','reembols','no me queda'])) return {text:'La propuesta de muestra contempla solicitar cambios o devoluciones en 15 días calendario desde la entrega, con el calzado sin uso exterior, su caja y accesorios. Los costos de transporte y plazos de reembolso están pendientes de definir.',action:infoAction('cambios')};
    if(contains(q,['talla','medir','centimetro','cm','numero de pie','ajuste'])) return {text:'La demo muestra tallas EU 35 a 40. Mide ambos pies del talón al dedo más largo y usa la medida mayor. Guía orientativa: 35 ≈ 22,5 cm; 36 ≈ 23 cm; 37 ≈ 23,5 cm; 38 ≈ 24 cm; 39 ≈ 24,5 cm; 40 ≈ 25 cm. Esta tabla debe confirmarse con el proveedor; no garantiza el ajuste.',action:infoAction('tallas')};
    if(contains(q,['pagar','pago','tarjeta','transferencia','comprar','compra','pedido','carrito','bolsa'])) return {text:'Elige tu modelo, selecciona la talla y añádelo a la bolsa. Puedes cambiar cantidades, aplicar ELORA15 y completar un pedido de prueba. La tienda funciona en local: no hay cobros, pedidos reales ni pasarela de pago conectada.',action:{label:'Abrir mi bolsa ↗',run:()=>{setChat(false);renderCart();openDialog('#cart-dialog')}}};
    if(contains(q,['cuid','limpi','lavar','guardar'])) return {text:'Retira el polvo con un paño suave y seco, evita la humedad y guarda cada par protegido. No uses productos de limpieza sin conocer el material. Las instrucciones del fabricante serán la referencia para cada modelo.'};
    if(contextProduct) return {text:`${contextProduct.name} · ${contextProduct.color} · ${money(contextProduct.price)}. ${contextProduct.description}\nTallas de muestra: EU 35 a 40. Los materiales y la disponibilidad real aún deben confirmarse.`,action:productAction(contextProduct)};
    if(contains(q,['barato','econom','presupuesto','precio','cuesta','valor','cost','dolar'])) return {text:'Estos son los precios de muestra en USD:\nSiena $55 · Celeste $59 · Aurora $69 · Alma $79 · Olivia $85 · Valentina $89.\nSi buscas el precio más bajo, Siena es una sandalia plana color caramelo. Puedes ordenar el catálogo por menor precio.',action:productAction(products[5])};
    if(contains(q,['oficina','trabaj','reunion','mocasin','negro'])) return {text:'Para un look de oficina, mira Olivia: un mocasín negro con detalle dorado ($85). Si prefieres un tacón bajo, Alma en chocolate ($79) tiene una silueta slingback.',action:productAction(products[3])};
    if(contains(q,['fiesta','boda','evento','noche','elegant','tacon','salon'])) return {text:'Para una ocasión especial puedes explorar Valentina, un salón borgoña ($89), o Aurora, una sandalia nude de tiras ($69). Si prefieres tacón bajo, Alma ($79) es otra opción. Las alturas exactas aún no están confirmadas.',action:productAction(products[4])};
    if(contains(q,['sandalia','verano','playa','vacacion'])) return {text:'Tenemos dos propuestas de sandalia: Aurora, nude de tiras con tacón ($69), y Siena, plana color caramelo con efecto trenzado ($55). ¿Prefieres tacón o plana?',action:productAction(products[5])};
    if(contains(q,['plano','plana','flat','comod','caminar','diario','bailarina','casual'])) return {text:'Para un estilo de diario sin tacón, explora Celeste, una bailarina marfil ($59), Olivia, mocasín negro ($85), o Siena, sandalia plana caramelo ($55). La comodidad depende de tu pie y del ajuste; pruébalos y confirma las medidas reales.',action:productAction(products[2])};
    if(contains(q,['color','combinar','look','ropa'])) return {text:'Chocolate: Alma. Nude: Aurora. Marfil: Celeste. Negro: Olivia. Borgoña: Valentina. Caramelo: Siena. Para un look neutro mira Celeste u Olivia; si quieres un acento de color, Valentina. ¿Cuál te gusta?',action:{label:'Explorar colores y modelos ↗',run:()=>{setChat(false);document.querySelector('#coleccion').scrollIntoView({behavior:'smooth'})}}};
    if(contains(q,['recom','elegir','modelo','catalogo','calzado','zapato','opcion'])) return {text:'¡Busquemos tu par! ♡ ¿Lo quieres para oficina, una fiesta o el día a día? Tenemos tacones, sandalias, bailarinas y mocasines. También puedes decirme un nombre: Alma, Aurora, Celeste, Olivia, Valentina o Siena.'};
    if(contains(q,['gracias','perfecto','genial'])) return {text:'¡A ti! ♡ Aquí estoy si quieres comparar modelos, revisar la guía de tallas o conocer tu bono.'};
    if(contains(q,['hola','buenos','buenas','hey'])) return {text:'¡Hey! ♡ ¿Buscas un par para el día a día, la oficina o una ocasión especial? También te cuento cómo elegir talla y usar tu 15%.'};
    return {text:'Puedo ayudarte con los seis modelos del catálogo, tallas, precios, descuentos, envíos, cambios y cuidados. Prueba con «sandalias para una fiesta» o «cuánto cuesta Alma». Si tu duda requiere información no confirmada, necesitaremos atención de la tienda.'};
  }
  function ask(question) { if(!question.trim())return;addMessage(question.trim(),'user');const response=answer(question);addMessage(response.text,'bot',response.action);input.value=''; }
  document.querySelector('#chat-form').addEventListener('submit',e=>{e.preventDefault();ask(input.value)});
  document.querySelectorAll('[data-question]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.question)));
  function openWhatsApp() {
    const phone=window.ELORA_CONTACT?.whatsapp || '';
    if(!/^\d{8,15}$/.test(phone)) {
      setChat(true);
      addMessage('El WhatsApp comercial todavía no está configurado. En cuanto se añada el número real, este botón abrirá directamente una conversación con la tienda. Mientras tanto, dime qué duda tienes sobre el calzado.','bot');
      return;
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent('¡Hola ÉLORA! Tengo una consulta sobre el calzado de la tienda.')}`,'_blank','noopener,noreferrer');
  }
  document.querySelectorAll('[data-whatsapp]').forEach(b=>b.addEventListener('click',openWhatsApp));
  if(window.ELORA_CONTACT?.whatsapp) {
    document.querySelectorAll('.whatsapp-number').forEach(el=>el.textContent=`WhatsApp ${window.ELORA_CONTACT.display || '+'+window.ELORA_CONTACT.whatsapp}`);
    policies.contacto.body = policies.contacto.body.replace('El correo de atención, número de WhatsApp y horario están pendientes de definir. Aquí aparecerán los canales reales de la boutique cuando los proporciones.', `Puedes escribirnos por WhatsApp al ${window.ELORA_CONTACT.display || '+'+window.ELORA_CONTACT.whatsapp}. Los botones de WhatsApp abren una conversación con la tienda. El correo y el horario de atención están pendientes de definir.`);
  }
})();
