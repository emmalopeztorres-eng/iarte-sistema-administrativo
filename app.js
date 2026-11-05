const STORAGE_KEY = "iarte_demo_v1";
const initialData = {
  alumnos: [
    {id:"IA-0001",nombre:"Alumna de demostración",disciplina:"Teatro musical",nivel:"Intermedio",comision:"TM-01",estado:"Activo"},
    {id:"IA-0002",nombre:"Alumno de demostración",disciplina:"Danza",nivel:"Inicial",comision:"DZ-02",estado:"Activo"}
  ],
  docentes: [{id:"DOC-001",nombre:"Docente de demostración",area:"Teatro",materia:"Actuación",estado:"Activo"}],
  actividades: [
    {icon:"＋",title:"Sistema inicial creado",detail:"Se preparó el espacio de trabajo de iArte.",time:"Hoy"},
    {icon:"♧",title:"Módulos principales",detail:"Secciones académicas y administrativas disponibles.",time:"Hoy"},
    {icon:"✓",title:"Datos de ejemplo",detail:"Los registros visibles son ficticios y editables.",time:"Hoy"}
  ]
};
let data = loadData();
const root = document.getElementById("viewRoot");
const sectionNames = {inicio:"Inicio",alumnos:"Alumnos",docentes:"Docentes",academico:"Organización académica",asistencia:"Asistencia",horarios:"Horarios y aulas",produccion:"Producción artística",finanzas:"Administración",becas:"Becas",informes:"Informes"};
let activeView = "inicio";
function loadData(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(initialData)}catch{return structuredClone(initialData)}}
function saveData(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}
function escapeHTML(value){return String(value ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function toast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)}
function heading(kicker,title,description,button=""){return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${description}</p></div>${button}</div>`}
function stat(label,value,note,icon,cls){return `<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon ${cls}">${icon}</span></div><div class="stat-value">${value}</div><div class="stat-note">${note}</div></article>`}
function renderHome(){root.innerHTML=heading("PANEL GENERAL","Buen día. Bienvenida a iArte.","Una mirada general de la actividad académica y administrativa de la institución.")+
  `<div class="stats-grid">${stat("Alumnos registrados",data.alumnos.length,"Registros en este entorno","♧","lav")}${stat("Docentes registrados",data.docentes.length,"Equipo docente cargado","♙","mint")}${stat("Áreas de gestión","8","Módulos institucionales","▤","peach")}${stat("Estado del sistema","Inicial","Entorno de demostración","✧","sky")}</div>
  <div class="dashboard-grid"><section class="panel"><div class="panel-head"><div><h2>Actividad reciente</h2><div class="panel-sub">Movimientos del espacio de trabajo</div></div><button class="text-link" data-go="informes">Ver informes →</button></div>${data.actividades.map(a=>`<div class="activity"><div class="activity-dot">${escapeHTML(a.icon)}</div><div><strong>${escapeHTML(a.title)}</strong><p>${escapeHTML(a.detail)}</p></div><time>${escapeHTML(a.time)}</time></div>`).join("")}</section>
  <section class="panel"><div class="panel-head"><div><h2>Accesos rápidos</h2><div class="panel-sub">Tareas frecuentes</div></div></div><div class="quick-grid"><button class="quick-action" data-action="alumno"><span>＋</span><b>Nuevo alumno</b><small>Crear ficha institucional</small></button><button class="quick-action" data-action="docente"><span>＋</span><b>Nuevo docente</b><small>Registrar integrante</small></button><button class="quick-action" data-go="asistencia"><span>✓</span><b>Asistencia</b><small>Consultar y organizar</small></button><button class="quick-action" data-go="horarios"><span>◷</span><b>Horarios y aulas</b><small>Planificación académica</small></button></div></section></div>
  <div style="height:17px"></div><div class="notice"><strong>Importante:</strong> esta primera versión funciona como prototipo de interfaz y guarda los cambios en el navegador de este dispositivo. Todavía no tiene usuarios, permisos, base de datos central ni copias de seguridad. No cargues información personal real hasta implementar esas capas.</div>
  <div class="panel"><div class="panel-head"><div><h2>Áreas del sistema</h2><div class="panel-sub">Ingresá a cada módulo para comenzar a organizar la institución</div></div></div><div class="section-grid">${moduleCards()}</div></div>`}
function moduleCards(){const items=[["alumnos","♧","Alumnos","Fichas, inscripciones, niveles, comisiones y trayectoria."],["docentes","♙","Docentes","Legajos, áreas, materias y disponibilidad."],["academico","▤","Organización académica","Departamentos, disciplinas, niveles y comisiones."],["asistencia","✓","Asistencia","Registro de presentes, ausentes y llegadas tarde."],["horarios","◷","Horarios y aulas","Grilla de clases, espacios y asignaciones."],["produccion","✧","Producción artística","Montajes, muestras, elencos y calendario."],["finanzas","＄","Administración","Aranceles, pagos, gastos y reportes."],["becas","♡","Becas","Solicitudes, seguimiento y asignaciones."],["informes","▥","Informes","Indicadores institucionales y exportaciones."]];return items.map(i=>`<button class="module-card" data-go="${i[0]}"><span class="module-icon">${i[1]}</span><h3>${i[2]}</h3><p>${i[3]}</p></button>`).join("")}
const configs={alumnos:{title:"Alumnos",kicker:"GESTIÓN ACADÉMICA",desc:"Directorio y fichas de estudiantes.",add:"Agregar alumno",fields:[["nombre","Nombre y apellido"],["disciplina","Disciplina principal"],["nivel","Nivel"],["comision","Comisión"]],cols:["ID","Nombre","Disciplina","Nivel","Comisión","Estado"]},docentes:{title:"Docentes",kicker:"EQUIPO INSTITUCIONAL",desc:"Directorio del equipo docente.",add:"Agregar docente",fields:[["nombre","Nombre y apellido"],["area","Área"],["materia","Materia"],["estado","Estado"]],cols:["ID","Nombre","Área","Materia","Estado"]}};
function renderDirectory(type){const c=configs[type],rows=data[type];root.innerHTML=heading(c.kicker,c.title,c.desc,`<button class="primary-btn" data-action="${type==="alumnos"?"alumno":"docente"}">＋ ${c.add}</button>`)+`<div class="toolbar"><input class="search-input" id="tableSearch" placeholder="Buscar por nombre, área o comisión..."><button class="secondary-btn" id="clearSearch">Limpiar búsqueda</button></div><div class="data-table-wrap"><table class="data-table"><thead><tr>${c.cols.map(x=>`<th>${x}</th>`).join("")}<th>Acción</th></tr></thead><tbody id="tableBody">${directoryRows(type,rows)}</tbody></table></div><p class="panel-sub" style="margin:12px 2px">Total de registros: <strong>${rows.length}</strong> · Los datos se guardan localmente en este navegador.</p>`;
document.getElementById("tableSearch").addEventListener("input",e=>{const q=e.target.value.toLowerCase();document.getElementById("tableBody").innerHTML=directoryRows(type,rows.filter(r=>Object.values(r).join(" ").toLowerCase().includes(q)))});
document.getElementById("clearSearch").onclick=()=>{document.getElementById("tableSearch").value="";document.getElementById("tableBody").innerHTML=directoryRows(type,rows)}}
function directoryRows(type,rows){if(!rows.length)return `<tr><td colspan="8" class="empty-note">No hay registros para mostrar.</td></tr>`;return rows.map((r,i)=>{const values=type==="alumnos"?[r.id,r.nombre,r.disciplina,r.nivel,r.comision,r.estado]:[r.id,r.nombre,r.area,r.materia,r.estado];return `<tr>${values.map((v,j)=>`<td>${j===values.length-1?`<span class="status">${escapeHTML(v)}</span>`:escapeHTML(v)}</td>`).join("")}<td><button class="text-link" data-delete="${type}" data-index="${data[type].indexOf(r)}">Eliminar</button></td></tr>`}).join("")}
function renderGeneric(type){const descriptions={academico:["ESTRUCTURA ACADÉMICA","Organización académica","Configurá departamentos, disciplinas, materias, niveles y comisiones."],asistencia:["SEGUIMIENTO","Asistencia","Prepará el registro de asistencia por clase, comisión y docente."],horarios:["PLANIFICACIÓN","Horarios y aulas","Organizá turnos, aulas, capacidad y disponibilidad."],produccion:["ÁREA ARTÍSTICA","Producción artística","Administrá talleres de montaje, muestras, obras, elencos y funciones."],finanzas:["GESTIÓN ECONÓMICA","Administración","Centralizá aranceles, pagos, gastos, presupuestos y rendiciones."],becas:["ACOMPAÑAMIENTO","Becas","Registrá solicitudes, criterios, documentación y seguimiento de becas."],informes:["INFORMACIÓN INSTITUCIONAL","Informes","Consolidá indicadores para la toma de decisiones."]};const [k,t,d]=descriptions[type];const content={academico:[["Departamentos","Agrupación institucional de las áreas formativas."],["Disciplinas","Teatro, danza, música y otras especialidades."],["Materias","Asignaturas por disciplina y nivel."],["Niveles","Trayectos, edades y progresiones."],["Comisiones","Grupos concretos con días y horarios."]],asistencia:[["Por comisión","Registro diario de presentes, ausentes y llegadas tarde."],["Por alumno","Historial individual de asistencia."],["Por docente","Seguimiento de clases dictadas y cobertura."]],horarios:[["Grilla semanal","Días, turnos, franjas horarias y materias."],["Aulas","Inventario, capacidad y equipamiento."],["Disponibilidad","Cruce de docentes, estudiantes y espacios."]],produccion:[["Talleres de montaje","Procesos, grupos, responsables y cronogramas."],["Obras y muestras","Ficha artística, técnica y de producción."],["Funciones y eventos","Fechas, salas, elencos y necesidades técnicas."]],finanzas:[["Aranceles","Planes, cuotas, vencimientos y descuentos."],["Pagos","Registro y conciliación de cobros."],["Gastos y presupuestos","Proveedores, órdenes y rendiciones."]],becas:[["Solicitudes","Ingreso y documentación de postulaciones."],["Evaluación","Criterios, comité y resolución."],["Seguimiento","Porcentaje, vigencia y renovación."]],informes:[["Matrícula","Altas, bajas, distribución y evolución."],["Actividad académica","Asistencia, comisiones y carga horaria."],["Gestión","Indicadores económicos y operativos."]]};root.innerHTML=heading(k,t,d)+`<div class="notice">Este módulo está definido en la arquitectura inicial. El siguiente paso será construir sus formularios, reglas de validación, permisos y reportes específicos.</div><div class="section-grid">${content[type].map((x,i)=>`<article class="module-card" style="cursor:default"><span class="module-icon">${["◈","▦","◎"][i%3]}</span><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join("")}</div>`}
function render(){document.getElementById("currentSection").textContent=sectionNames[activeView];document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===activeView));if(activeView==="inicio")renderHome();else if(configs[activeView])renderDirectory(activeView);else renderGeneric(activeView);document.getElementById("sidebar").classList.remove("open")}
function go(view){activeView=view;render()}
function openForm(type){const isStudent=type==="alumno",fields=configs[isStudent?"alumnos":"docentes"].fields;const backdrop=document.createElement("div");backdrop.className="modal-backdrop";backdrop.innerHTML=`<form class="modal" id="recordForm"><h2>${isStudent?"Nuevo alumno":"Nuevo docente"}</h2><p>Completá los datos básicos. Podrás ampliar la ficha en próximas versiones.</p><div class="form-row">${fields.map(f=>`<div class="form-field"><label for="f-${f[0]}">${f[1]}</label><input class="field-input" id="f-${f[0]}" name="${f[0]}" required placeholder="${f[1]}"></div>`).join("")}</div><div class="modal-actions"><button type="button" class="secondary-btn" id="cancelModal">Cancelar</button><button class="primary-btn" type="submit">Guardar registro</button></div></form>`;document.body.appendChild(backdrop);document.getElementById("cancelModal").onclick=()=>backdrop.remove();backdrop.addEventListener("click",e=>{if(e.target===backdrop)backdrop.remove()});document.getElementById("recordForm").onsubmit=e=>{e.preventDefault();const form=new FormData(e.target),record=Object.fromEntries(form.entries());record.id=(isStudent?"IA-":"DOC-")+String(data[isStudent?"alumnos":"docentes"].length+1).padStart(4,"0");if(!isStudent&&!record.estado)record.estado="Activo";data[isStudent?"alumnos":"docentes"].push(record);data.actividades.unshift({icon:"＋",title:isStudent?"Nuevo alumno registrado":"Nuevo docente registrado",detail:record.nombre,time:"Ahora"});saveData();backdrop.remove();render();toast("Registro guardado en este navegador")}}
document.addEventListener("click",e=>{const nav=e.target.closest("[data-view]");if(nav){go(nav.dataset.view);return}const link=e.target.closest("[data-go]");if(link){go(link.dataset.go);return}const action=e.target.closest("[data-action]");if(action){openForm(action.dataset.action);return}const del=e.target.closest("[data-delete]");if(del){if(confirm("¿Eliminar este registro de demostración?")){data[del.dataset.delete].splice(Number(del.dataset.index),1);saveData();render();toast("Registro eliminado")}}});
document.getElementById("menuButton").onclick=()=>document.getElementById("sidebar").classList.toggle("open");

// ===== MÓDULO DE ALUMNOS: FICHAS INTEGRALES =====
const studentFields = [
  {key:"nombre",label:"Nombre",type:"text",required:true,group:"Identificación"},
  {key:"apellido",label:"Apellido",type:"text",required:true,group:"Identificación"},
  {key:"fechaNacimiento",label:"Fecha de nacimiento",type:"date",group:"Identificación"},
  {key:"documento",label:"Documento (solo demostración)",type:"text",group:"Identificación"},
  {key:"email",label:"Correo electrónico",type:"email",group:"Contacto"},
  {key:"telefono",label:"Teléfono",type:"tel",group:"Contacto"},
  {key:"responsable",label:"Adulto responsable / contacto",type:"text",group:"Contacto"},
  {key:"vinculo",label:"Vínculo",type:"text",group:"Contacto"},
  {key:"telefonoResponsable",label:"Teléfono del responsable",type:"tel",group:"Contacto"},
  {key:"disciplina",label:"Disciplina",type:"text",required:true,group:"Trayectoria académica"},
  {key:"nivel",label:"Nivel",type:"text",group:"Trayectoria académica"},
  {key:"comision",label:"Comisión",type:"text",group:"Trayectoria académica"},
  {key:"turno",label:"Turno",type:"text",group:"Trayectoria académica"},
  {key:"fechaIngreso",label:"Fecha de ingreso",type:"date",group:"Trayectoria académica"},
  {key:"estado",label:"Estado",type:"select",options:["Activo","Preinscripto","En pausa","Egresado","Baja"],group:"Trayectoria académica"},
  {key:"observaciones",label:"Observaciones administrativas",type:"textarea",group:"Seguimiento"}
];
function studentFullName(s){return [s.nombre,s.apellido].filter(Boolean).join(" ") || s.nombre || "Sin nombre"}
function normalizeStudents(){data.alumnos=data.alumnos.map(s=>({...s,apellido:s.apellido||"",estado:s.estado||"Activo"}))}
normalizeStudents();
function renderDirectory(type){
  if(type!=="alumnos"){return renderLegacyDirectory(type)}
  const rows=data.alumnos;
  root.innerHTML=heading("GESTIÓN ACADÉMICA","Alumnos","Directorio institucional, legajos y seguimiento de trayectoria.",'<button class="primary-btn" data-action="alumno">＋ Nueva ficha</button>')+
  '<div class="stats-grid">'+stat("Total de fichas",rows.length,"Registros del directorio","♧","lav")+stat("Activos",rows.filter(s=>(s.estado||"Activo")==="Activo").length,"Alumnos con cursada activa","✓","mint")+stat("Preinscriptos",rows.filter(s=>s.estado==="Preinscripto").length,"Pendientes de incorporación","＋","peach")+stat("En pausa",rows.filter(s=>s.estado==="En pausa").length,"Trayectorias pausadas","◷","sky")+'</div>'+
  '<div class="notice"><strong>Legajo integral:</strong> cada alumno puede tener datos de identificación, contactos responsables, disciplina, nivel, comisión, turno, fecha de ingreso y observaciones administrativas. Esta versión usa almacenamiento local de demostración; no ingreses datos reales todavía.</div>'+
  '<div class="toolbar"><input class="search-input" id="tableSearch" placeholder="Buscar por nombre, legajo, disciplina o comisión..."><select class="field-select" id="statusFilter"><option value="">Todos los estados</option><option>Activo</option><option>Preinscripto</option><option>En pausa</option><option>Egresado</option><option>Baja</option></select><button class="secondary-btn" id="exportStudents">Exportar CSV</button></div>'+
  '<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Legajo</th><th>Alumno/a</th><th>Disciplina</th><th>Nivel</th><th>Comisión</th><th>Estado</th><th>Ficha</th></tr></thead><tbody id="tableBody">'+studentRows(rows)+'</tbody></table></div>'+
  '<p class="panel-sub" style="margin:12px 2px">Total de alumnos: <strong>'+rows.length+'</strong> · Seleccioná “Ver ficha” para consultar o editar el legajo.</p>';
  const apply=()=>{const q=document.getElementById("tableSearch").value.toLowerCase(),st=document.getElementById("statusFilter").value;const filtered=data.alumnos.filter(s=>(!st||s.estado===st)&&JSON.stringify(s).toLowerCase().includes(q));document.getElementById("tableBody").innerHTML=studentRows(filtered)};
  document.getElementById("tableSearch").addEventListener("input",apply);
  document.getElementById("statusFilter").addEventListener("change",apply);
  document.getElementById("exportStudents").onclick=exportStudentsCSV;
}
function renderLegacyDirectory(type){
  const c=configs[type],rows=data[type];
  root.innerHTML=heading(c.kicker,c.title,c.desc,`<button class="primary-btn" data-action="docente">＋ ${c.add}</button>`)+`<div class="toolbar"><input class="search-input" id="tableSearch" placeholder="Buscar por nombre, área o comisión..."><button class="secondary-btn" id="clearSearch">Limpiar búsqueda</button></div><div class="data-table-wrap"><table class="data-table"><thead><tr>${c.cols.map(x=>`<th>${x}</th>`).join("")}<th>Acción</th></tr></thead><tbody id="tableBody">${directoryRows(type,rows)}</tbody></table></div><p class="panel-sub" style="margin:12px 2px">Total de registros: <strong>${rows.length}</strong></p>`;
  document.getElementById("tableSearch").addEventListener("input",e=>{const q=e.target.value.toLowerCase();document.getElementById("tableBody").innerHTML=directoryRows(type,rows.filter(r=>Object.values(r).join(" ").toLowerCase().includes(q)))});
  document.getElementById("clearSearch").onclick=()=>{document.getElementById("tableSearch").value="";document.getElementById("tableBody").innerHTML=directoryRows(type,rows)};
}
function studentRows(rows){
  if(!rows.length)return '<tr><td colspan="7" class="empty-note">No hay alumnos que coincidan con la búsqueda.</td></tr>';
  return rows.map(s=>'<tr><td>'+escapeHTML(s.id)+'</td><td>'+escapeHTML(studentFullName(s))+'</td><td>'+escapeHTML(s.disciplina||"—")+'</td><td>'+escapeHTML(s.nivel||"—")+'</td><td>'+escapeHTML(s.comision||"—")+'</td><td><span class="status '+(s.estado==="Preinscripto"||s.estado==="En pausa"?"pending":"")+'">'+escapeHTML(s.estado||"Activo")+'</span></td><td><button class="text-link" data-profile="'+escapeHTML(s.id)+'">Ver ficha →</button></td></tr>').join("");
}
function openForm(type,studentId=null){
  if(type!=="alumno")return openLegacyForm(type);
  const existing=studentId?data.alumnos.find(s=>s.id===studentId):null;
  const groups=[...new Set(studentFields.map(f=>f.group))];
  const fieldsHTML=groups.map(group=>'<div class="form-section-title">'+group+'</div><div class="form-row">'+studentFields.filter(f=>f.group===group).map(f=>{
    const value=existing?.[f.key]||"";
    if(f.type==="textarea")return '<div class="form-field full-field"><label for="f-'+f.key+'">'+f.label+'</label><textarea class="field-input" id="f-'+f.key+'" name="'+f.key+'" rows="3">'+escapeHTML(value)+'</textarea></div>';
    if(f.type==="select")return '<div class="form-field"><label for="f-'+f.key+'">'+f.label+'</label><select class="field-input" id="f-'+f.key+'" name="'+f.key+'">'+f.options.map(o=>'<option '+(value===o?'selected':'')+'>'+o+'</option>').join("")+'</select></div>';
    return '<div class="form-field"><label for="f-'+f.key+'">'+f.label+'</label><input class="field-input" id="f-'+f.key+'" name="'+f.key+'" type="'+f.type+'" value="'+escapeHTML(value)+'" '+(f.required?'required':'')+'></div>';
  }).join("")+'</div>').join("");
  const backdrop=document.createElement("div");backdrop.className="modal-backdrop";
  backdrop.innerHTML='<form class="modal student-modal" id="recordForm"><h2>'+(existing?"Editar ficha de alumno/a":"Nueva ficha de alumno/a")+'</h2><p>Completá la información disponible. Los campos no obligatorios pueden quedar vacíos.</p>'+fieldsHTML+'<div class="modal-actions"><button type="button" class="secondary-btn" id="cancelModal">Cancelar</button><button class="primary-btn" type="submit">Guardar ficha</button></div></form>';
  document.body.appendChild(backdrop);
  document.getElementById("cancelModal").onclick=()=>backdrop.remove();
  backdrop.addEventListener("click",e=>{if(e.target===backdrop)backdrop.remove()});
  document.getElementById("recordForm").onsubmit=e=>{
    e.preventDefault();const form=new FormData(e.target),record=Object.fromEntries(form.entries());
    if(existing){Object.assign(existing,record)}else{record.id="IA-"+String(Date.now()).slice(-7);data.alumnos.push(record)}
    data.actividades.unshift({icon:existing?"✎":"＋",title:existing?"Ficha de alumno actualizada":"Nuevo alumno registrado",detail:studentFullName(record),time:"Ahora"});
    saveData();backdrop.remove();render();toast(existing?"Ficha actualizada":"Ficha creada correctamente");
  };
}
function openLegacyForm(type){
  const fields=configs.docentes.fields;const backdrop=document.createElement("div");backdrop.className="modal-backdrop";
  backdrop.innerHTML='<form class="modal" id="recordForm"><h2>Nuevo docente</h2><p>Completá los datos básicos del integrante.</p><div class="form-row">'+fields.map(f=>'<div class="form-field"><label>'+f[1]+'</label><input class="field-input" name="'+f[0]+'" required></div>').join("")+'</div><div class="modal-actions"><button type="button" class="secondary-btn" id="cancelModal">Cancelar</button><button class="primary-btn" type="submit">Guardar registro</button></div></form>';
  document.body.appendChild(backdrop);document.getElementById("cancelModal").onclick=()=>backdrop.remove();
  document.getElementById("recordForm").onsubmit=e=>{e.preventDefault();const record=Object.fromEntries(new FormData(e.target).entries());record.id="DOC-"+String(Date.now()).slice(-6);data.docentes.push(record);saveData();backdrop.remove();render();toast("Docente registrado")};
}
function showStudentProfile(id){
  const s=data.alumnos.find(x=>x.id===id);if(!s)return;
  const groups=[["Identificación",["nombre","apellido","fechaNacimiento","documento"]],["Contacto",["email","telefono","responsable","vinculo","telefonoResponsable"]],["Trayectoria académica",["disciplina","nivel","comision","turno","fechaIngreso","estado"]],["Seguimiento",["observaciones"]]];
  const labels=Object.fromEntries(studentFields.map(f=>[f.key,f.label]));
  const backdrop=document.createElement("div");backdrop.className="modal-backdrop";
  backdrop.innerHTML='<section class="modal student-modal"><div class="profile-heading"><div><div class="eyebrow">LEGAJO '+escapeHTML(s.id)+'</div><h2>'+escapeHTML(studentFullName(s))+'</h2><p>Ficha integral del alumno/a</p></div><span class="status">'+escapeHTML(s.estado||"Activo")+'</span></div>'+groups.map(([g,keys])=>'<div class="profile-group"><h3>'+g+'</h3><div class="profile-fields">'+keys.map(k=>'<div><small>'+labels[k]+'</small><strong>'+escapeHTML(s[k]||"Sin información")+'</strong></div>').join("")+'</div></div>').join("")+'<div class="modal-actions"><button type="button" class="secondary-btn" id="closeProfile">Cerrar</button><button type="button" class="primary-btn" id="editProfile">Editar ficha</button></div></section>';
  document.body.appendChild(backdrop);document.getElementById("closeProfile").onclick=()=>backdrop.remove();backdrop.addEventListener("click",e=>{if(e.target===backdrop)backdrop.remove()});document.getElementById("editProfile").onclick=()=>{backdrop.remove();openForm("alumno",id)};
}
function exportStudentsCSV(){
  const headers=["Legajo",...studentFields.map(f=>f.label)];
  const rows=data.alumnos.map(s=>[s.id,...studentFields.map(f=>s[f.key]||"")]);
  const csv=[headers,...rows].map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(";")).join("\n");
  const blob=new Blob(["\\ufeff"+csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="iarte-alumnos-demo.csv";a.click();URL.revokeObjectURL(url);toast("Archivo CSV preparado");
}
document.addEventListener("click",e=>{const profile=e.target.closest("[data-profile]");if(profile)showStudentProfile(profile.dataset.profile)});

render();

// ===== MÓDULO DE DOCENTES: LEGAJOS INTEGRALES =====
const teacherFields = [
  {key:"nombre",label:"Nombre",type:"text",required:true,group:"Identificación"},
  {key:"apellido",label:"Apellido",type:"text",required:true,group:"Identificación"},
  {key:"email",label:"Correo institucional",type:"email",group:"Contacto"},
  {key:"telefono",label:"Teléfono de contacto",type:"tel",group:"Contacto"},
  {key:"area",label:"Departamento / área",type:"text",required:true,group:"Perfil profesional"},
  {key:"especialidades",label:"Especialidades",type:"text",placeholder:"Ej.: danza clásica, jazz, contemporáneo",group:"Perfil profesional"},
  {key:"formacion",label:"Formación / antecedentes",type:"textarea",group:"Perfil profesional"},
  {key:"materias",label:"Materias que dicta",type:"textarea",placeholder:"Separar cada materia con coma",group:"Asignación académica"},
  {key:"niveles",label:"Niveles habilitados",type:"text",placeholder:"Ej.: inicial, intermedio, avanzado",group:"Asignación académica"},
  {key:"comisiones",label:"Comisiones asignadas",type:"textarea",placeholder:"Ej.: DAN-01, TM-03, CANTO-02",group:"Asignación académica"},
  {key:"turnos",label:"Turnos disponibles",type:"text",placeholder:"Mañana, tarde, noche",group:"Disponibilidad"},
  {key:"disponibilidad",label:"Días y franjas horarias",type:"textarea",placeholder:"Ej.: lunes 14 a 18; miércoles 9 a 13",group:"Disponibilidad"},
  {key:"cargaHoraria",label:"Carga horaria semanal (horas)",type:"number",group:"Disponibilidad"},
  {key:"fechaIngreso",label:"Fecha de ingreso",type:"date",group:"Vínculo institucional"},
  {key:"modalidad",label:"Modalidad de contratación / vínculo",type:"text",group:"Vínculo institucional"},
  {key:"estado",label:"Estado",type:"select",options:["Activo","Licencia","Inactivo","Baja"],group:"Vínculo institucional"},
  {key:"observaciones",label:"Observaciones internas",type:"textarea",group:"Seguimiento"}
];
const renderStudentDirectory = renderDirectory;
const openStudentOrTeacherForm = openForm;
function teacherFullName(t){return [t.nombre,t.apellido].filter(Boolean).join(" ")||t.nombre||"Sin nombre"}
function normalizeTeachers(){data.docentes=data.docentes.map(t=>({...t,apellido:t.apellido||"",estado:t.estado||"Activo"}))}
normalizeTeachers();
function renderDirectory(type){
  if(type==="alumnos")return renderStudentDirectory(type);
  if(type!=="docentes")return renderLegacyDirectory(type);
  const rows=data.docentes;
  root.innerHTML=heading("EQUIPO INSTITUCIONAL","Docentes","Legajos profesionales, asignaciones académicas, disponibilidad y seguimiento del equipo.",'<button class="primary-btn" data-action="docente">＋ Nuevo legajo</button>')+
  '<div class="stats-grid">'+stat("Total de legajos",rows.length,"Docentes registrados","♙","lav")+stat("Activos",rows.filter(t=>(t.estado||"Activo")==="Activo").length,"Integrantes en actividad","✓","mint")+stat("En licencia",rows.filter(t=>t.estado==="Licencia").length,"Licencias registradas","◷","peach")+stat("Carga horaria semanal",rows.reduce((n,t)=>n+(Number(t.cargaHoraria)||0),0),"Horas declaradas en total","▤","sky")+'</div>'+
  '<div class="notice"><strong>Legajo docente integral:</strong> permite registrar perfil profesional, formación, materias, niveles, comisiones, disponibilidad, carga horaria y vínculo institucional. Usá únicamente datos ficticios mientras el sistema siga funcionando en almacenamiento local.</div>'+
  '<div class="toolbar"><input class="search-input" id="teacherSearch" placeholder="Buscar por nombre, área, materia o comisión..."><select class="field-select" id="teacherStatus"><option value="">Todos los estados</option><option>Activo</option><option>Licencia</option><option>Inactivo</option><option>Baja</option></select><select class="field-select" id="teacherArea"><option value="">Todas las áreas</option>'+[...new Set(rows.map(t=>t.area).filter(Boolean))].sort().map(x=>'<option>'+escapeHTML(x)+'</option>').join("")+'</select><button class="secondary-btn" id="exportTeachers">Exportar CSV</button></div>'+
  '<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Legajo</th><th>Docente</th><th>Área</th><th>Materias</th><th>Comisiones</th><th>Horas/sem.</th><th>Estado</th><th>Ficha</th></tr></thead><tbody id="teacherBody">'+teacherRows(rows)+'</tbody></table></div>'+
  '<p class="panel-sub" style="margin:12px 2px">Total de docentes: <strong>'+rows.length+'</strong> · Abrí cada ficha para consultar o modificar su legajo.</p>';
  const apply=()=>{const q=document.getElementById("teacherSearch").value.toLowerCase(),st=document.getElementById("teacherStatus").value,area=document.getElementById("teacherArea").value;const filtered=data.docentes.filter(t=>(!st||t.estado===st)&&(!area||t.area===area)&&JSON.stringify(t).toLowerCase().includes(q));document.getElementById("teacherBody").innerHTML=teacherRows(filtered)};
  document.getElementById("teacherSearch").addEventListener("input",apply);
  document.getElementById("teacherStatus").addEventListener("change",apply);
  document.getElementById("teacherArea").addEventListener("change",apply);
  document.getElementById("exportTeachers").onclick=exportTeachersCSV;
}
function teacherRows(rows){
  if(!rows.length)return '<tr><td colspan="8" class="empty-note">No hay docentes que coincidan con los filtros.</td></tr>';
  return rows.map(t=>'<tr><td>'+escapeHTML(t.id)+'</td><td>'+escapeHTML(teacherFullName(t))+'</td><td>'+escapeHTML(t.area||"—")+'</td><td>'+escapeHTML(t.materias||t.materia||"—")+'</td><td>'+escapeHTML(t.comisiones||"—")+'</td><td>'+escapeHTML(t.cargaHoraria||"—")+'</td><td><span class="status '+(t.estado==="Licencia"||t.estado==="Inactivo"||t.estado==="Baja"?"pending":"")+'">'+escapeHTML(t.estado||"Activo")+'</span></td><td><button class="text-link" data-teacher-profile="'+escapeHTML(t.id)+'">Ver ficha →</button></td></tr>').join("");
}
function openForm(type,teacherId=null){
  if(type==="alumno")return openStudentOrTeacherForm(type,teacherId);
  if(type!=="docente")return openLegacyForm(type);
  const existing=teacherId?data.docentes.find(t=>t.id===teacherId):null;
  const groups=[...new Set(teacherFields.map(f=>f.group))];
  const fieldsHTML=groups.map(group=>'<div class="form-section-title">'+group+'</div><div class="form-row">'+teacherFields.filter(f=>f.group===group).map(f=>{
    const value=existing?.[f.key]||"";
    if(f.type==="textarea")return '<div class="form-field full-field"><label for="tf-'+f.key+'">'+f.label+'</label><textarea class="field-input" id="tf-'+f.key+'" name="'+f.key+'" rows="3" placeholder="'+escapeHTML(f.placeholder||"")+'">'+escapeHTML(value)+'</textarea></div>';
    if(f.type==="select")return '<div class="form-field"><label for="tf-'+f.key+'">'+f.label+'</label><select class="field-input" id="tf-'+f.key+'" name="'+f.key+'">'+f.options.map(o=>'<option '+((value||"Activo")===o?'selected':'')+'>'+o+'</option>').join("")+'</select></div>';
    return '<div class="form-field"><label for="tf-'+f.key+'">'+f.label+'</label><input class="field-input" id="tf-'+f.key+'" name="'+f.key+'" type="'+f.type+'" value="'+escapeHTML(value)+'" placeholder="'+escapeHTML(f.placeholder||"")+'" '+(f.required?'required':'')+'></div>';
  }).join("")+'</div>').join("");
  const backdrop=document.createElement("div");backdrop.className="modal-backdrop";
  backdrop.innerHTML='<form class="modal teacher-modal" id="teacherForm"><h2>'+(existing?"Editar legajo docente":"Nuevo legajo docente")+'</h2><p>La ficha reúne información profesional, académica, horaria y administrativa.</p>'+fieldsHTML+'<div class="modal-actions"><button type="button" class="secondary-btn" id="cancelTeacher">Cancelar</button><button class="primary-btn" type="submit">Guardar legajo</button></div></form>';
  document.body.appendChild(backdrop);
  document.getElementById("cancelTeacher").onclick=()=>backdrop.remove();
  backdrop.addEventListener("click",e=>{if(e.target===backdrop)backdrop.remove()});
  document.getElementById("teacherForm").onsubmit=e=>{
    e.preventDefault();const record=Object.fromEntries(new FormData(e.target).entries());
    record.cargaHoraria=record.cargaHoraria===""?"":Number(record.cargaHoraria);
    if(existing)Object.assign(existing,record);
    else{record.id="DOC-"+String(Date.now()).slice(-7);data.docentes.push(record)}
    data.actividades.unshift({icon:existing?"✎":"＋",title:existing?"Legajo docente actualizado":"Nuevo docente registrado",detail:teacherFullName(record),time:"Ahora"});
    saveData();backdrop.remove();render();toast(existing?"Legajo actualizado":"Docente registrado correctamente");
  };
}
function showTeacherProfile(id){
  const t=data.docentes.find(x=>x.id===id);if(!t)return;
  const groups=[["Identificación",["nombre","apellido"]],["Contacto",["email","telefono"]],["Perfil profesional",["area","especialidades","formacion"]],["Asignación académica",["materias","niveles","comisiones"]],["Disponibilidad",["turnos","disponibilidad","cargaHoraria"]],["Vínculo institucional",["fechaIngreso","modalidad","estado"]],["Seguimiento",["observaciones"]]];
  const labels=Object.fromEntries(teacherFields.map(f=>[f.key,f.label]));
  const backdrop=document.createElement("div");backdrop.className="modal-backdrop";
  backdrop.innerHTML='<section class="modal teacher-modal"><div class="profile-heading"><div><div class="eyebrow">LEGAJO '+escapeHTML(t.id)+'</div><h2>'+escapeHTML(teacherFullName(t))+'</h2><p>'+escapeHTML(t.area||"Área sin asignar")+' · Ficha profesional</p></div><span class="status">'+escapeHTML(t.estado||"Activo")+'</span></div>'+groups.map(([g,keys])=>'<div class="profile-group"><h3>'+g+'</h3><div class="profile-fields">'+keys.map(k=>'<div><small>'+labels[k]+'</small><strong>'+escapeHTML(t[k]===0?"0":t[k]||"Sin información")+'</strong></div>').join("")+'</div></div>').join("")+'<div class="modal-actions"><button type="button" class="secondary-btn" id="closeTeacher">Cerrar</button><button type="button" class="primary-btn" id="editTeacher">Editar legajo</button></div></section>';
  document.body.appendChild(backdrop);document.getElementById("closeTeacher").onclick=()=>backdrop.remove();backdrop.addEventListener("click",e=>{if(e.target===backdrop)backdrop.remove()});document.getElementById("editTeacher").onclick=()=>{backdrop.remove();openForm("docente",id)};
}
function exportTeachersCSV(){
  const headers=["Legajo",...teacherFields.map(f=>f.label)];
  const rows=data.docentes.map(t=>[t.id,...teacherFields.map(f=>t[f.key]??"")]);
  const csv=[headers,...rows].map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(";")).join("\n");
  const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="iarte-docentes-demo.csv";a.click();URL.revokeObjectURL(url);toast("Archivo CSV preparado");
}
document.addEventListener("click",e=>{const profile=e.target.closest("[data-teacher-profile]");if(profile)showTeacherProfile(profile.dataset.teacherProfile)});
