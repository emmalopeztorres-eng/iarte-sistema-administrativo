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
function renderOriginalGeneric(type){const descriptions={academico:["ESTRUCTURA ACADÉMICA","Organización académica","Configurá departamentos, disciplinas, materias, niveles y comisiones."],asistencia:["SEGUIMIENTO","Asistencia","Prepará el registro de asistencia por clase, comisión y docente."],horarios:["PLANIFICACIÓN","Horarios y aulas","Organizá turnos, aulas, capacidad y disponibilidad."],produccion:["ÁREA ARTÍSTICA","Producción artística","Administrá talleres de montaje, muestras, obras, elencos y funciones."],finanzas:["GESTIÓN ECONÓMICA","Administración","Centralizá aranceles, pagos, gastos, presupuestos y rendiciones."],becas:["ACOMPAÑAMIENTO","Becas","Registrá solicitudes, criterios, documentación y seguimiento de becas."],informes:["INFORMACIÓN INSTITUCIONAL","Informes","Consolidá indicadores para la toma de decisiones."]};const [k,t,d]=descriptions[type];const content={academico:[["Departamentos","Agrupación institucional de las áreas formativas."],["Disciplinas","Teatro, danza, música y otras especialidades."],["Materias","Asignaturas por disciplina y nivel."],["Niveles","Trayectos, edades y progresiones."],["Comisiones","Grupos concretos con días y horarios."]],asistencia:[["Por comisión","Registro diario de presentes, ausentes y llegadas tarde."],["Por alumno","Historial individual de asistencia."],["Por docente","Seguimiento de clases dictadas y cobertura."]],horarios:[["Grilla semanal","Días, turnos, franjas horarias y materias."],["Aulas","Inventario, capacidad y equipamiento."],["Disponibilidad","Cruce de docentes, estudiantes y espacios."]],produccion:[["Talleres de montaje","Procesos, grupos, responsables y cronogramas."],["Obras y muestras","Ficha artística, técnica y de producción."],["Funciones y eventos","Fechas, salas, elencos y necesidades técnicas."]],finanzas:[["Aranceles","Planes, cuotas, vencimientos y descuentos."],["Pagos","Registro y conciliación de cobros."],["Gastos y presupuestos","Proveedores, órdenes y rendiciones."]],becas:[["Solicitudes","Ingreso y documentación de postulaciones."],["Evaluación","Criterios, comité y resolución."],["Seguimiento","Porcentaje, vigencia y renovación."]],informes:[["Matrícula","Altas, bajas, distribución y evolución."],["Actividad académica","Asistencia, comisiones y carga horaria."],["Gestión","Indicadores económicos y operativos."]]};root.innerHTML=heading(k,t,d)+`<div class="notice">Este módulo está definido en la arquitectura inicial. El siguiente paso será construir sus formularios, reglas de validación, permisos y reportes específicos.</div><div class="section-grid">${content[type].map((x,i)=>`<article class="module-card" style="cursor:default"><span class="module-icon">${["◈","▦","◎"][i%3]}</span><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join("")}</div>`}
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
function openStudentForm(type,studentId=null){
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
function teacherFullName(t){return [t.nombre,t.apellido].filter(Boolean).join(" ")||t.nombre||"Sin nombre"}
function normalizeTeachers(){data.docentes=data.docentes.map(t=>({...t,apellido:t.apellido||"",materias:t.materias||t.materia||"",estado:t.estado||"Activo"}))}
normalizeTeachers();
function renderDirectory(type){
  if(type==="alumnos"){
    const rows=data.alumnos;
    root.innerHTML=heading("GESTIÓN ACADÉMICA","Alumnos","Directorio institucional, legajos y seguimiento de trayectoria.",'<button class="primary-btn" data-action="alumno">＋ Nueva ficha</button>')+
    '<div class="stats-grid">'+stat("Total de fichas",rows.length,"Registros del directorio","♧","lav")+stat("Activos",rows.filter(s=>(s.estado||"Activo")==="Activo").length,"Alumnos con cursada activa","✓","mint")+stat("Preinscriptos",rows.filter(s=>s.estado==="Preinscripto").length,"Pendientes de incorporación","＋","peach")+stat("En pausa",rows.filter(s=>s.estado==="En pausa").length,"Trayectorias pausadas","◷","sky")+'</div>'+
    '<div class="notice"><strong>Legajo integral:</strong> cada alumno puede tener datos de identificación, contactos responsables, disciplina, nivel, comisión, turno, fecha de ingreso y observaciones administrativas. Esta versión usa almacenamiento local de demostración; no ingreses datos reales todavía.</div>'+
    '<div class="toolbar"><input class="search-input" id="tableSearch" placeholder="Buscar por nombre, legajo, disciplina o comisión..."><select class="field-select" id="statusFilter"><option value="">Todos los estados</option><option>Activo</option><option>Preinscripto</option><option>En pausa</option><option>Egresado</option><option>Baja</option></select><button class="secondary-btn" id="exportStudents">Exportar CSV</button></div>'+
    '<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Legajo</th><th>Alumno/a</th><th>Disciplina</th><th>Nivel</th><th>Comisión</th><th>Estado</th><th>Ficha</th></tr></thead><tbody id="tableBody">'+studentRows(rows)+'</tbody></table></div>'+
    '<p class="panel-sub" style="margin:12px 2px">Total de alumnos: <strong>'+rows.length+'</strong> · Seleccioná “Ver ficha” para consultar o editar el legajo.</p>';
    const apply=()=>{const q=document.getElementById("tableSearch").value.toLowerCase(),st=document.getElementById("statusFilter").value;const filtered=data.alumnos.filter(s=>(!st||s.estado===st)&&JSON.stringify(s).toLowerCase().includes(q));document.getElementById("tableBody").innerHTML=studentRows(filtered)};
    document.getElementById("tableSearch").addEventListener("input",apply);document.getElementById("statusFilter").addEventListener("change",apply);document.getElementById("exportStudents").onclick=exportStudentsCSV;return;
  }
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
  if(type==="alumno")return openStudentForm(type,teacherId);
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


// ===== MÓDULO DE ORGANIZACIÓN ACADÉMICA =====
const academicDefinitions={
 departamentos:{label:"Departamentos",singular:"departamento",fields:[["nombre","Nombre del departamento","text",true],["codigo","Código interno","text",false],["responsable","Responsable / coordinación","text",false],["descripcion","Descripción y alcance","textarea",false]]},
 disciplinas:{label:"Disciplinas",singular:"disciplina",fields:[["nombre","Nombre de la disciplina","text",true],["departamentoId","Departamento","relation:departamentos",false],["codigo","Código interno","text",false],["descripcion","Descripción","textarea",false]]},
 niveles:{label:"Niveles",singular:"nivel",fields:[["nombre","Nombre del nivel","text",true],["disciplinaId","Disciplina","relation:disciplinas",false],["edadDesde","Edad orientativa desde","number",false],["edadHasta","Edad orientativa hasta","number",false],["orden","Orden / progresión","number",false],["descripcion","Descripción y objetivos","textarea",false]]},
 materias:{label:"Materias",singular:"materia",fields:[["nombre","Nombre de la materia","text",true],["disciplinaId","Disciplina","relation:disciplinas",false],["nivelId","Nivel","relation:niveles",false],["correlativas","Correlatividades / requisitos","text",false],["cargaHoraria","Horas semanales","number",false],["descripcion","Contenidos y objetivos","textarea",false]]},
 planes:{label:"Planes de estudio",singular:"plan de estudio",fields:[["nombre","Nombre del plan","text",true],["disciplinaId","Disciplina","relation:disciplinas",false],["nivelId","Nivel","relation:niveles",false],["duracion","Duración estimada","text",false],["materias","Materias incluidas","textarea",false],["vigencia","Vigencia / ciclo lectivo","text",false],["descripcion","Fundamentación y objetivos","textarea",false]]},
 comisiones:{label:"Comisiones",singular:"comisión",fields:[["nombre","Nombre de la comisión","text",true],["codigo","Código de comisión","text",true],["disciplinaId","Disciplina","relation:disciplinas",false],["nivelId","Nivel","relation:niveles",false],["materiaId","Materia principal","relation:materias",false],["docenteId","Docente responsable","relation:docentes",false],["turno","Turno","select:Mañana|Tarde|Noche|Intensivo",false],["dias","Días de cursada","text",false],["horario","Horario","text",false],["aula","Aula asignada","text",false],["cupo","Cupo máximo","number",false],["ciclo","Ciclo lectivo","text",false],["estado","Estado","select:Activa|Completa|En preparación|Finalizada",false]]}
};
const academicKeys=Object.keys(academicDefinitions);
if(!data.academia)data.academia={};
academicKeys.forEach(k=>{if(!Array.isArray(data.academia[k]))data.academia[k]=[]});
let academicCategory="departamentos";
function academicName(type,id){const item=(data.academia[type]||[]).find(x=>x.id===id);return item?item.nombre:"Sin asignar"}
function academicTeacherName(id){const item=data.docentes.find(x=>x.id===id);return item?teacherFullName(item):"Sin asignar"}
function academicValue(type,item,field){
 const v=item[field];if(!v)return "—";
 if(field.endsWith("Id")){const rel=field.slice(0,-2);if(rel==="docente")return academicTeacherName(v);return academicName(rel+"s",v)}
 return v;
}
function renderGeneric(type){
 if(type==="produccion")return renderProductionModule();
 if(type==="finanzas")return renderFinanceModule();
 if(type==="becas")return renderScholarshipModule();
 if(type==="asistencia")return renderAttendanceModule();
 if(type==="horarios")return renderScheduleModule();
 if(type!=="academico")return renderOriginalGeneric(type);
 const total=academicKeys.reduce((n,k)=>n+data.academia[k].length,0);
 root.innerHTML=heading("ESTRUCTURA ACADÉMICA","Organización académica","Construí la estructura de iArte y vinculá departamentos, disciplinas, niveles, materias, planes y comisiones.",'<button class="primary-btn" data-academic-add="1">＋ Nuevo registro</button>')+
 '<div class="stats-grid">'+stat("Departamentos",data.academia.departamentos.length,"Áreas organizativas","▤","lav")+stat("Disciplinas",data.academia.disciplinas.length,"Campos de formación","✧","mint")+stat("Materias",data.academia.materias.length,"Asignaturas definidas","▦","peach")+stat("Comisiones",data.academia.comisiones.length,"Grupos de cursada","♧","sky")+'</div>'+
 '<div class="notice"><strong>Estructura relacionada:</strong> creá primero los departamentos y disciplinas; después los niveles y materias; por último, armá planes y comisiones. Los selectores permiten vincular registros ya creados. Los datos de docentes se toman del módulo Docentes.</div>'+
 '<div class="academic-layout"><aside class="academic-tabs">'+academicKeys.map(k=>'<button class="academic-tab '+(academicCategory===k?'active':'')+'" data-academic-tab="'+k+'"><span>'+academicDefinitions[k].label+'</span><b>'+data.academia[k].length+'</b></button>').join("")+'</aside><section class="panel academic-content"><div class="panel-head"><div><h2>'+academicDefinitions[academicCategory].label+'</h2><div class="panel-sub">Administración de '+academicDefinitions[academicCategory].label.toLowerCase()+' institucionales</div></div><button class="primary-btn" data-academic-add="1">＋ Agregar</button></div><div class="toolbar"><input class="search-input" id="academicSearch" placeholder="Buscar en '+academicDefinitions[academicCategory].label.toLowerCase()+'..."><button class="secondary-btn" id="academicExport">Exportar CSV</button></div><div class="data-table-wrap"><table class="data-table"><thead><tr>'+academicTableHeaders(academicCategory)+'</tr></thead><tbody id="academicRows">'+academicRows(academicCategory,data.academia[academicCategory])+'</tbody></table></div><p class="panel-sub">Registros en esta categoría: <strong>'+data.academia[academicCategory].length+'</strong> · Total de registros académicos: '+total+'</p></section></div>';
 document.getElementById("academicSearch").addEventListener("input",e=>{const q=e.target.value.toLowerCase();document.getElementById("academicRows").innerHTML=academicRows(academicCategory,data.academia[academicCategory].filter(x=>JSON.stringify(x).toLowerCase().includes(q)))});
 document.getElementById("academicExport").onclick=exportAcademicCSV;
}
function academicTableHeaders(type){const d=academicDefinitions[type];let fields=d.fields.filter(f=>["nombre","codigo","responsable","departamentoId","disciplinaId","nivelId","materiaId","docenteId","turno","dias","horario","cupo","estado","vigencia"].includes(f[0])).slice(0,5);return fields.map(f=>'<th>'+f[1]+'</th>').join("")+'<th>Acciones</th>'}
function academicRows(type,rows){
 const fields=academicDefinitions[type].fields.filter(f=>["nombre","codigo","responsable","departamentoId","disciplinaId","nivelId","materiaId","docenteId","turno","dias","horario","cupo","estado","vigencia"].includes(f[0])).slice(0,5);
 if(!rows.length)return '<tr><td colspan="7" class="empty-note">Todavía no hay registros en esta categoría. Usá “Agregar” para crear el primero.</td></tr>';
 return rows.map(x=>'<tr>'+fields.map(f=>'<td>'+escapeHTML(academicValue(type,x,f[0]))+'</td>').join("")+'<td><button class="text-link" data-academic-edit="'+escapeHTML(x.id)+'">Editar</button> <button class="text-link" data-academic-delete="'+escapeHTML(x.id)+'">Eliminar</button></td></tr>').join("");
}
function academicRelationOptions(target,selected){
 let options=[];
 if(target==="docentes")options=data.docentes.map(t=>({id:t.id,name:teacherFullName(t)}));
 else options=(data.academia[target]||[]).map(x=>({id:x.id,name:x.nombre}));
 return '<option value="">Sin asignar</option>'+options.map(o=>'<option value="'+escapeHTML(o.id)+'" '+(selected===o.id?'selected':'')+'>'+escapeHTML(o.name)+'</option>').join("");
}
function openAcademicForm(id=null){
 const type=academicCategory,definition=academicDefinitions[type],existing=id?data.academia[type].find(x=>x.id===id):null;
 const fields=definition.fields.map(f=>{
  const [key,label,kind,required]=f,value=existing?.[key]??"";
  let control="";
  if(kind.startsWith("relation:"))control='<select class="field-input" name="'+key+'">'+academicRelationOptions(kind.split(":")[1],value)+'</select>';
  else if(kind.startsWith("select:"))control='<select class="field-input" name="'+key+'">'+kind.slice(7).split("|").map(o=>'<option '+(value===o?'selected':'')+'>'+o+'</option>').join("")+'</select>';
  else if(kind==="textarea")control='<textarea class="field-input" name="'+key+'" rows="3">'+escapeHTML(value)+'</textarea>';
  else control='<input class="field-input" name="'+key+'" type="'+kind+'" value="'+escapeHTML(value)+'" '+(required?'required':'')+'>';
  return '<div class="form-field '+(kind==="textarea"?'full-field':'')+'"><label>'+label+'</label>'+control+'</div>';
 }).join("");
 const backdrop=document.createElement("div");backdrop.className="modal-backdrop";
 backdrop.innerHTML='<form class="modal academic-modal" id="academicForm"><h2>'+(existing?"Editar ":"Nuevo ")+definition.singular+'</h2><p>Completá los datos y vinculalos con los registros disponibles.</p><div class="form-row">'+fields+'</div><div class="modal-actions"><button type="button" class="secondary-btn" id="cancelAcademic">Cancelar</button><button class="primary-btn" type="submit">Guardar</button></div></form>';
 document.body.appendChild(backdrop);document.getElementById("cancelAcademic").onclick=()=>backdrop.remove();backdrop.addEventListener("click",e=>{if(e.target===backdrop)backdrop.remove()});
 document.getElementById("academicForm").onsubmit=e=>{e.preventDefault();const record=Object.fromEntries(new FormData(e.target).entries());if(existing)Object.assign(existing,record);else{record.id="AC-"+type.slice(0,3).toUpperCase()+"-"+String(Date.now()).slice(-7);data.academia[type].push(record)}data.actividades.unshift({icon:"▤",title:existing?"Estructura académica actualizada":"Nuevo registro académico",detail:record.nombre||definition.singular,time:"Ahora"});saveData();backdrop.remove();render();toast(existing?"Registro actualizado":"Registro académico creado")};
}
function exportAcademicCSV(){
 const type=academicCategory,fields=academicDefinitions[type].fields,rows=data.academia[type],headers=["ID",...fields.map(f=>f[1])];
 const csv=[headers,...rows.map(x=>[x.id,...fields.map(f=>academicValue(type,x,f[0])==="—"?"":academicValue(type,x,f[0]))])].map(row=>row.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(";")).join("\n");
 const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="iarte-"+type+".csv";a.click();URL.revokeObjectURL(url);toast("CSV preparado");
}
document.addEventListener("click",e=>{
 const tab=e.target.closest("[data-academic-tab]");if(tab){academicCategory=tab.dataset.academicTab;render();return}
 if(e.target.closest("[data-academic-add]")){openAcademicForm();return}
 const edit=e.target.closest("[data-academic-edit]");if(edit){openAcademicForm(edit.dataset.academicEdit);return}
 const del=e.target.closest("[data-academic-delete]");if(del&&confirm("¿Eliminar este registro? Las referencias vinculadas podrían quedar sin asignar.")){data.academia[academicCategory]=data.academia[academicCategory].filter(x=>x.id!==del.dataset.academicDelete);saveData();render();toast("Registro eliminado")}
});


// ===== MÓDULO DE HORARIOS Y AULAS =====
if(!data.espacios)data.espacios=[];
if(!data.clases)data.clases=[];
const scheduleDays=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
let scheduleTab="clases";
function scheduleRoomName(id){return data.espacios.find(x=>x.id===id)?.nombre||"Sin aula"}
function scheduleTeacherName(id){const t=data.docentes.find(x=>x.id===id);return t?teacherFullName(t):"Sin docente"}
function scheduleCommissionName(id){return data.academia.comisiones.find(x=>x.id===id)?.nombre||"Sin comisión"}
function scheduleSubjectName(id){return data.academia.materias.find(x=>x.id===id)?.nombre||"Sin materia"}
function scheduleTime(t){return t||"—"}
function renderScheduleModule(){
 const rooms=data.espacios,classes=data.clases;
 root.innerHTML=heading("PLANIFICACIÓN ACADÉMICA","Horarios y aulas","Organizá las clases de iArte, asigná espacios y docentes, y detectá superposiciones antes de guardar.",'<button class="primary-btn" data-schedule-add="'+(scheduleTab==="aulas"?"room":"class")+'">＋ '+(scheduleTab==="aulas"?"Nueva aula":"Nueva clase")+'</button>')+
 '<div class="stats-grid">'+stat("Aulas registradas",rooms.length,"Espacios disponibles","▤","lav")+stat("Clases programadas",classes.length,"Asignaciones semanales","◷","mint")+stat("Docentes asignados",new Set(classes.map(x=>x.docenteId).filter(Boolean)).size,"Con al menos una clase","♙","peach")+stat("Conflictos detectados",scheduleConflictCount(),"Cruces de horario actuales","!","sky")+'</div>'+
 '<div class="notice"><strong>Cómo organizarlo:</strong> primero cargá las aulas con su capacidad y equipamiento; después programá las clases vinculando comisión, materia, docente, día, horario y espacio. El sistema advierte cruces de aula, docente y comisión. Los horarios son una planificación semanal recurrente.</div>'+
 '<div class="academic-layout schedule-layout"><aside class="academic-tabs"><button class="academic-tab '+(scheduleTab==="clases"?"active":"")+'" data-schedule-tab="clases">Grilla de clases <b>'+classes.length+'</b></button><button class="academic-tab '+(scheduleTab==="aulas"?"active":"")+'" data-schedule-tab="aulas">Aulas y espacios <b>'+rooms.length+'</b></button></aside><section class="panel academic-content">'+
 (scheduleTab==="aulas"?renderRoomsContent():renderClassesContent())+'</section></div>';
}
function scheduleConflictCount(){let count=0;for(let i=0;i<data.clases.length;i++)for(let j=i+1;j<data.clases.length;j++){const a=data.clases[i],b=data.clases[j];if(a.dia===b.dia&&a.inicio<b.fin&&b.inicio<a.fin&&((a.aulaId&&a.aulaId===b.aulaId)||(a.docenteId&&a.docenteId===b.docenteId)||(a.comisionId&&a.comisionId===b.comisionId)))count++}return count}
function renderRoomsContent(){
 return '<div class="panel-head"><div><h2>Aulas y espacios</h2><div class="panel-sub">Inventario de salas, estudios y espacios de formación</div></div><button class="primary-btn" data-schedule-add="room">＋ Agregar aula</button></div><div class="toolbar"><input class="search-input" id="roomSearch" placeholder="Buscar aula, tipo o equipamiento..."><button class="secondary-btn" id="roomExport">Exportar CSV</button></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>Nombre</th><th>Código</th><th>Tipo</th><th>Capacidad</th><th>Equipamiento</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="roomRows">'+roomRows( data.espacios)+'</tbody></table></div><p class="panel-sub">Los espacios se pueden reutilizar en distintas clases siempre que no coincidan los horarios.</p>';
}
function roomRows(rows){if(!rows.length)return '<tr><td colspan="7" class="empty-note">Todavía no hay aulas cargadas. Agregá el primer espacio.</td></tr>';return rows.map(x=>'<tr><td>'+escapeHTML(x.nombre)+'</td><td>'+escapeHTML(x.codigo||"—")+'</td><td>'+escapeHTML(x.tipo||"—")+'</td><td>'+escapeHTML(x.capacidad||"—")+'</td><td>'+escapeHTML(x.equipamiento||"—")+'</td><td>'+escapeHTML(x.estado||"Disponible")+'</td><td><button class="text-link" data-room-edit="'+x.id+'">Editar</button> <button class="text-link" data-room-delete="'+x.id+'">Eliminar</button></td></tr>').join("")}
function renderClassesContent(){
 const days=["Todos",...scheduleDays];
 return '<div class="panel-head"><div><h2>Grilla semanal</h2><div class="panel-sub">Clases asignadas por día, docente, comisión y aula</div></div><button class="primary-btn" data-schedule-add="class">＋ Programar clase</button></div><div class="toolbar"><input class="search-input" id="classSearch" placeholder="Buscar materia, docente, comisión o aula..."><select class="field-select" id="dayFilter">'+days.map(d=>'<option>'+d+'</option>').join("")+'</select><button class="secondary-btn" id="classExport">Exportar CSV</button></div><div class="schedule-days">'+scheduleDays.map(day=>{const rows=data.clases.filter(x=>x.dia===day).sort((a,b)=>a.inicio.localeCompare(b.inicio));return '<section class="schedule-day"><h3>'+day+'</h3>'+(rows.length?rows.map(x=>'<article class="schedule-entry"><div class="schedule-time">'+escapeHTML(x.inicio)+'–'+escapeHTML(x.fin)+'</div><div class="schedule-entry-main"><strong>'+escapeHTML(scheduleSubjectName(x.materiaId))+'</strong><span>'+escapeHTML(scheduleCommissionName(x.comisionId))+' · '+escapeHTML(scheduleTeacherName(x.docenteId))+'</span><small>'+escapeHTML(scheduleRoomName(x.aulaId))+'</small></div><div class="schedule-actions"><button class="text-link" data-class-edit="'+x.id+'">Editar</button><button class="text-link" data-class-delete="'+x.id+'">Eliminar</button></div></article>').join(""):'<p class="empty-day">Sin clases programadas</p>')+'</section>'}).join("")+'</div><p class="panel-sub">Total de clases semanales: <strong>'+data.clases.length+'</strong>. La grilla muestra la planificación recurrente, no la asistencia efectivamente tomada.</p>';
}
function scheduleSelect(name,label,items,selected,display){return '<div class="form-field"><label>'+label+'</label><select class="field-input" name="'+name+'"><option value="">Sin asignar</option>'+items.map(x=>'<option value="'+escapeHTML(x.id)+'" '+(selected===x.id?'selected':'')+'>'+escapeHTML(display(x))+'</option>').join("")+'</select></div>'}
function openRoomForm(id){
 const old=id?data.espacios.find(x=>x.id===id):null,b=document.createElement("div");b.className="modal-backdrop";
 b.innerHTML='<form class="modal schedule-modal" id="roomForm"><h2>'+(old?"Editar aula":"Nueva aula o espacio")+'</h2><p>Registrá los datos físicos y operativos del espacio.</p><div class="form-row"><div class="form-field"><label>Nombre del aula *</label><input class="field-input" name="nombre" required value="'+escapeHTML(old?.nombre||"")+'"></div><div class="form-field"><label>Código</label><input class="field-input" name="codigo" value="'+escapeHTML(old?.codigo||"")+'"></div><div class="form-field"><label>Tipo de espacio</label><select class="field-input" name="tipo">'+["Aula","Estudio de danza","Sala de teatro","Sala de música","Auditorio","Espacio exterior","Otro"].map(v=>'<option '+(old?.tipo===v?"selected":"")+'>'+v+'</option>').join("")+'</select></div><div class="form-field"><label>Capacidad máxima</label><input class="field-input" type="number" min="1" name="capacidad" value="'+escapeHTML(old?.capacidad||"")+'"></div><div class="form-field full-field"><label>Equipamiento / características</label><textarea class="field-input" name="equipamiento" rows="3">'+escapeHTML(old?.equipamiento||"")+'</textarea></div><div class="form-field"><label>Estado</label><select class="field-input" name="estado">'+["Disponible","En mantenimiento","Fuera de servicio"].map(v=>'<option '+((old?.estado||"Disponible")===v?"selected":"")+'>'+v+'</option>').join("")+'</select></div></div><div class="modal-actions"><button type="button" class="secondary-btn" id="cancelSchedule">Cancelar</button><button class="primary-btn">Guardar aula</button></div></form>';
 document.body.appendChild(b);document.getElementById("cancelSchedule").onclick=()=>b.remove();b.addEventListener("click",e=>{if(e.target===b)b.remove()});
 document.getElementById("roomForm").onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.target));if(old)Object.assign(old,v);else data.espacios.push({...v,id:"AULA-"+String(Date.now()).slice(-7)});saveData();b.remove();render();toast("Aula guardada")};
}
function openClassForm(id){
 const old=id?data.clases.find(x=>x.id===id):null,b=document.createElement("div");b.className="modal-backdrop";
 const controls=scheduleSelect("comisionId","Comisión",data.academia.comisiones,old?.comisionId,x=>x.nombre)+scheduleSelect("materiaId","Materia",data.academia.materias,old?.materiaId,x=>x.nombre)+scheduleSelect("docenteId","Docente",data.docentes,old?.docenteId,x=>teacherFullName(x))+scheduleSelect("aulaId","Aula / espacio",data.espacios.filter(x=>(x.estado||"Disponible")==="Disponible"),old?.aulaId,x=>x.nombre);
 b.innerHTML='<form class="modal schedule-modal" id="classForm"><h2>'+(old?"Editar clase":"Programar clase")+'</h2><p>Asigná los recursos académicos y físicos. Los conflictos se revisan al guardar.</p><div class="form-row">'+controls+'<div class="form-field"><label>Día de cursada</label><select class="field-input" name="dia">'+scheduleDays.map(v=>'<option '+(old?.dia===v?"selected":"")+'>'+v+'</option>').join("")+'</select></div><div class="form-field"><label>Hora de inicio *</label><input class="field-input" type="time" name="inicio" required value="'+escapeHTML(old?.inicio||"")+'"></div><div class="form-field"><label>Hora de finalización *</label><input class="field-input" type="time" name="fin" required value="'+escapeHTML(old?.fin||"")+'"></div><div class="form-field"><label>Observaciones</label><input class="field-input" name="observaciones" value="'+escapeHTML(old?.observaciones||"")+'"></div></div><div class="modal-actions"><button type="button" class="secondary-btn" id="cancelSchedule">Cancelar</button><button class="primary-btn">Guardar clase</button></div></form>';
 document.body.appendChild(b);document.getElementById("cancelSchedule").onclick=()=>b.remove();b.addEventListener("click",e=>{if(e.target===b)b.remove()});
 document.getElementById("classForm").onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.target));if(v.fin<=v.inicio){toast("La hora de finalización debe ser posterior al inicio");return}const conflicts=data.clases.filter(x=>x.id!==old?.id&&x.dia===v.dia&&v.inicio<x.fin&&x.inicio<v.fin&&((v.aulaId&&x.aulaId===v.aulaId)||(v.docenteId&&x.docenteId===v.docenteId)||(v.comisionId&&x.comisionId===v.comisionId)));if(conflicts.length){const reasons=[];if(conflicts.some(x=>v.aulaId&&x.aulaId===v.aulaId))reasons.push("el aula");if(conflicts.some(x=>v.docenteId&&x.docenteId===v.docenteId))reasons.push("el docente");if(conflicts.some(x=>v.comisionId&&x.comisionId===v.comisionId))reasons.push("la comisión");toast("Superposición detectada: "+reasons.join(", ")+". Revisá la grilla.");return}if(old)Object.assign(old,v);else data.clases.push({...v,id:"CLASE-"+String(Date.now()).slice(-7)});saveData();b.remove();render();toast("Clase programada correctamente")};
}
document.addEventListener("click",e=>{
 const tab=e.target.closest("[data-schedule-tab]");if(tab){scheduleTab=tab.dataset.scheduleTab;render();return}
 const add=e.target.closest("[data-schedule-add]");if(add){if(add.dataset.scheduleAdd==="room")openRoomForm();else openClassForm();return}
 const re=e.target.closest("[data-room-edit]");if(re){openRoomForm(re.dataset.roomEdit);return}
 const rd=e.target.closest("[data-room-delete]");if(rd){const id=rd.dataset.roomDelete;if(data.clases.some(x=>x.aulaId===id)){toast("No se puede eliminar: el aula está asignada a una clase");return}if(confirm("¿Eliminar este espacio?")){data.espacios=data.espacios.filter(x=>x.id!==id);saveData();render();toast("Aula eliminada")}return}
 const ce=e.target.closest("[data-class-edit]");if(ce){openClassForm(ce.dataset.classEdit);return}
 const cd=e.target.closest("[data-class-delete]");if(cd&&confirm("¿Eliminar esta clase de la grilla?")){data.clases=data.clases.filter(x=>x.id!==cd.dataset.classDelete);saveData();render();toast("Clase eliminada")}
});
document.addEventListener("input",e=>{if(e.target.id==="roomSearch"){const q=e.target.value.toLowerCase();document.getElementById("roomRows").innerHTML=roomRows(data.espacios.filter(x=>JSON.stringify(x).toLowerCase().includes(q)))}if(e.target.id==="classSearch"){const q=e.target.value.toLowerCase();document.querySelectorAll(".schedule-entry").forEach(el=>el.style.display=el.textContent.toLowerCase().includes(q)?"":"none")}});
document.addEventListener("change",e=>{if(e.target.id==="dayFilter"){document.querySelectorAll(".schedule-day").forEach(el=>el.style.display=e.target.value==="Todos"||el.querySelector("h3").textContent===e.target.value?"":"none")}});
document.addEventListener("click",e=>{if(e.target.id==="roomExport")exportScheduleCSV("rooms");if(e.target.id==="classExport")exportScheduleCSV("classes")});
function exportScheduleCSV(kind){const rows=kind==="rooms"?data.espacios:data.clases;const headers=kind==="rooms"?["Nombre","Código","Tipo","Capacidad","Equipamiento","Estado"]:["Día","Inicio","Fin","Comisión","Materia","Docente","Aula","Observaciones"];const values=kind==="rooms"?rows.map(x=>[x.nombre,x.codigo,x.tipo,x.capacidad,x.equipamiento,x.estado]):rows.map(x=>[x.dia,x.inicio,x.fin,scheduleCommissionName(x.comisionId),scheduleSubjectName(x.materiaId),scheduleTeacherName(x.docenteId),scheduleRoomName(x.aulaId),x.observaciones]);const csv=[headers,...values].map(row=>row.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(";")).join("\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="iarte-"+kind+".csv";a.click();URL.revokeObjectURL(url);toast("CSV preparado")}


// ===== MÓDULO DE ASISTENCIA =====
if(!Array.isArray(data.asistencias))data.asistencias=[];
let attendanceFilter="Todas";
function attendanceStudentName(id){const x=data.alumnos.find(s=>s.id===id);return x?studentFullName(x):"Alumno eliminado"}
function attendanceClassLabel(c){return [scheduleSubjectName(c.materiaId),scheduleCommissionName(c.comisionId),c.dia,c.inicio].filter(Boolean).join(" · ")}
function attendanceRoster(comisionId){
 const active=data.alumnos.filter(s=>(s.estado||"Activo")==="Activo");
 const commission=data.academia.comisiones.find(c=>c.id===comisionId);
 if(!commission)return active;
 const keys=[commission.nombre,commission.codigo,commission.id].filter(Boolean).map(x=>String(x).trim().toLowerCase());
 const matched=active.filter(s=>keys.includes(String(s.comision||"").trim().toLowerCase()));
 return matched.length?matched:active;
}
function attendanceStats(){
 const all=data.asistencias.flatMap(x=>x.registros||[]);
 const total=all.length,present=all.filter(x=>x.estado==="Presente").length;
 return {sessions:data.asistencias.length,total,present,absent:all.filter(x=>x.estado==="Ausente").length,late:all.filter(x=>x.estado==="Tarde").length,rate:total?Math.round((present+all.filter(x=>x.estado==="Tarde").length)/total*100):0};
}
function renderAttendanceModule(){
 const st=attendanceStats(),sessions=[...data.asistencias].sort((a,b)=>b.fecha.localeCompare(a.fecha));
 root.innerHTML=heading("SEGUIMIENTO ACADÉMICO","Asistencia","Registrá la asistencia por clase y conservá el historial de cada estudiante.",'<button class="primary-btn" data-attendance-new="1">＋ Tomar asistencia</button>')+
 '<div class="stats-grid">'+stat("Clases registradas",st.sessions,"Sesiones cargadas","◷","lav")+stat("Presentes",st.present,"Registros de presencia","✓","mint")+stat("Ausentes",st.absent,"Inasistencias registradas","!","peach")+stat("Presentismo",st.rate+"%","Sobre todos los registros","▥","sky")+'</div>'+
 '<div class="notice"><strong>Registro por clase:</strong> seleccioná una clase programada, la fecha y cargá el estado de cada alumno. Podés registrar presentes, ausentes y llegadas tarde, agregar minutos de demora y justificar inasistencias. El listado de alumnos intenta vincularse con la comisión; si no encuentra coincidencias, muestra los alumnos activos para que puedas revisar el padrón.</div>'+
 '<div class="toolbar"><input class="search-input" id="attendanceSearch" placeholder="Buscar por materia, comisión o docente..."><select class="field-select" id="attendanceStatusFilter"><option>Todas</option><option>Con ausencias</option><option>Con llegadas tarde</option></select><button class="secondary-btn" id="attendanceExport">Exportar CSV</button></div>'+
 '<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Fecha</th><th>Clase / materia</th><th>Comisión</th><th>Docente</th><th>Presentes</th><th>Ausentes</th><th>Tarde</th><th>Acciones</th></tr></thead><tbody id="attendanceRows">'+attendanceRows(sessions)+'</tbody></table></div>'+
 '<p class="panel-sub" style="margin:12px 2px">Sesiones guardadas: <strong>'+sessions.length+'</strong>. Cada registro conserva el detalle individual de la clase.</p>'+renderStudentAttendanceSummary();
 document.getElementById("attendanceSearch").addEventListener("input",applyAttendanceFilters);
 document.getElementById("attendanceStatusFilter").addEventListener("change",applyAttendanceFilters);
 document.getElementById("attendanceExport").onclick=exportAttendanceCSV;
}
function renderStudentAttendanceSummary(){
 const rows=data.alumnos.filter(st=>data.asistencias.some(s=>(s.registros||[]).some(r=>r.alumnoId===st.id)));
 const body=rows.length?rows.map(st=>{const records=data.asistencias.flatMap(s=>(s.registros||[]).filter(r=>r.alumnoId===st.id));const total=records.length,p=records.filter(r=>r.estado==="Presente").length,a=records.filter(r=>r.estado==="Ausente").length,t=records.filter(r=>r.estado==="Tarde").length,rate=total?Math.round((p+t)/total*100):0;return '<tr><td>'+escapeHTML(st.id)+'</td><td>'+escapeHTML(studentFullName(st))+'</td><td>'+total+'</td><td>'+p+'</td><td>'+a+'</td><td>'+t+'</td><td><strong>'+rate+'%</strong></td></tr>'}).join(""):'<tr><td colspan="7" class="empty-note">El resumen individual aparecerá cuando se registren asistencias.</td></tr>';
 return '<section class="panel attendance-summary"><div class="panel-head"><div><h2>Resumen de asistencia por alumno</h2><div class="panel-sub">Presentismo acumulado según las sesiones registradas</div></div></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>Legajo</th><th>Alumno/a</th><th>Clases</th><th>Presente</th><th>Ausente</th><th>Tarde</th><th>Presentismo</th></tr></thead><tbody>'+body+'</tbody></table></div></section>';
}
function attendanceRows(rows){
 if(!rows.length)return '<tr><td colspan="8" class="empty-note">Todavía no hay asistencias registradas. Seleccioná “Tomar asistencia” para cargar la primera clase.</td></tr>';
 return rows.map(x=>{const r=x.registros||[],p=r.filter(z=>z.estado==="Presente").length,a=r.filter(z=>z.estado==="Ausente").length,t=r.filter(z=>z.estado==="Tarde").length;return '<tr><td>'+escapeHTML(x.fecha)+'</td><td>'+escapeHTML(x.materiaNombre||"—")+'</td><td>'+escapeHTML(x.comisionNombre||"—")+'</td><td>'+escapeHTML(x.docenteNombre||"—")+'</td><td>'+p+'</td><td>'+a+'</td><td>'+t+'</td><td><button class="text-link" data-attendance-edit="'+x.id+'">Ver / editar</button> <button class="text-link" data-attendance-delete="'+x.id+'">Eliminar</button></td></tr>'}).join("");
}
function applyAttendanceFilters(){
 const q=document.getElementById("attendanceSearch").value.toLowerCase(),f=document.getElementById("attendanceStatusFilter").value;
 const rows=data.asistencias.filter(x=>JSON.stringify([x.fecha,x.materiaNombre,x.comisionNombre,x.docenteNombre,(x.registros||[]).map(r=>attendanceStudentName(r.alumnoId)).join(" ")]).toLowerCase().includes(q)&&(f==="Todas"||(f==="Con ausencias"&&(x.registros||[]).some(r=>r.estado==="Ausente"))||(f==="Con llegadas tarde"&&(x.registros||[]).some(r=>r.estado==="Tarde"))));
 document.getElementById("attendanceRows").innerHTML=attendanceRows(rows);
}
function openAttendanceForm(id=null){
 const old=id?data.asistencias.find(x=>x.id===id):null;
 if(!old&&!data.clases.length){toast("Primero programá las clases en Horarios y aulas");return}
 const planned=old?data.clases.find(c=>c.id===old.claseId):null;
 const date=old?.fecha||new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
 const classOptions=data.clases.map(c=>'<option value="'+escapeHTML(c.id)+'" '+((old?.claseId||"")===c.id?'selected':'')+'>'+escapeHTML(attendanceClassLabel(c))+'</option>').join("");
 const classForRoster=planned||(data.clases.find(c=>c.id===data.clases[0]?.id));
 let roster=attendanceRoster(old?.comisionId||classForRoster?.comisionId||"");
 const existingMap=new Map((old?.registros||[]).map(r=>[r.alumnoId,r]));
 const b=document.createElement("div");b.className="modal-backdrop";
 const makeRosterRows=()=>roster.map(st=>{const rec=existingMap.get(st.id)||{};return '<tr><td>'+escapeHTML(st.id)+'</td><td>'+escapeHTML(studentFullName(st))+'</td><td><select class="field-input attendance-state" data-student="'+escapeHTML(st.id)+'">'+["Presente","Ausente","Tarde"].map(v=>'<option '+((rec.estado||"Presente")===v?'selected':'')+'>'+v+'</option>').join("")+'</select></td><td><input class="field-input attendance-minutes" data-student="'+escapeHTML(st.id)+'" type="number" min="0" max="240" placeholder="Min." value="'+escapeHTML(rec.minutosTarde||"") +'" '+(rec.estado==="Tarde"?"":"disabled")+'></td><td><input class="field-input attendance-reason" data-student="'+escapeHTML(st.id)+'" placeholder="Motivo / justificación" value="'+escapeHTML(rec.justificacion||"")+'"></td><td><input class="field-input attendance-note" data-student="'+escapeHTML(st.id)+'" placeholder="Observación" value="'+escapeHTML(rec.observaciones||"")+'"></td></tr>'}).join("");
 const rosterRows=makeRosterRows();
 b.innerHTML='<form class="modal attendance-modal" id="attendanceForm"><h2>'+(old?"Editar registro de asistencia":"Tomar asistencia")+'</h2><p>Elegí una clase y completá el estado de cada estudiante.</p><div class="form-row"><div class="form-field"><label>Fecha de la clase *</label><input class="field-input" type="date" name="fecha" required value="'+escapeHTML(date)+'"></div><div class="form-field"><label>Clase programada *</label><select class="field-input" name="claseId" required>'+classOptions+'</select></div></div><div class="notice attendance-roster-notice">Padrón sugerido: '+roster.length+' alumnos activos. Revisá que la comisión seleccionada corresponda al grupo que asistió.</div><div class="data-table-wrap attendance-roster-wrap"><table class="data-table"><thead><tr><th>Legajo</th><th>Alumno/a</th><th>Estado</th><th>Demora</th><th>Justificación</th><th>Observación</th></tr></thead><tbody>'+rosterRows+'</tbody></table></div><div class="modal-actions"><button type="button" class="secondary-btn" id="cancelAttendance">Cancelar</button><button class="primary-btn">Guardar asistencia</button></div></form>';
 document.body.appendChild(b);document.getElementById("cancelAttendance").onclick=()=>b.remove();b.addEventListener("click",e=>{if(e.target===b)b.remove()});
 b.querySelectorAll(".attendance-state").forEach(sel=>sel.addEventListener("change",()=>{const m=b.querySelector('.attendance-minutes[data-student="'+sel.dataset.student+'"]');m.disabled=sel.value!=="Tarde";if(m.disabled)m.value=""}));
 const classPicker=b.querySelector('select[name="claseId"]');classPicker.addEventListener("change",()=>{const selected=data.clases.find(c=>c.id===classPicker.value);roster=attendanceRoster(selected?.comisionId||"");b.querySelector(".attendance-roster-notice").textContent="Padrón sugerido: "+roster.length+" alumnos activos. Revisá que la comisión seleccionada corresponda al grupo que asistió.";b.querySelector(".attendance-roster-wrap tbody").innerHTML=makeRosterRows();b.querySelectorAll(".attendance-state").forEach(sel=>sel.addEventListener("change",()=>{const m=b.querySelector('.attendance-minutes[data-student="'+sel.dataset.student+'"]');m.disabled=sel.value!=="Tarde";if(m.disabled)m.value=""}))});
 document.getElementById("attendanceForm").onsubmit=e=>{
  e.preventDefault();const form=Object.fromEntries(new FormData(e.target)),cl=data.clases.find(c=>c.id===form.claseId);
  if(!cl){toast("La clase seleccionada ya no está disponible");return}
  const registros=roster.map(st=>{const id=st.id,estado=b.querySelector('.attendance-state[data-student="'+id+'"]').value;return {alumnoId:id,estado,minutosTarde:estado==="Tarde"?b.querySelector('.attendance-minutes[data-student="'+id+'"]').value:"",justificacion:b.querySelector('.attendance-reason[data-student="'+id+'"]').value,observaciones:b.querySelector('.attendance-note[data-student="'+id+'"]').value}});
  const duplicate=data.asistencias.find(x=>x.id!==old?.id&&x.fecha===form.fecha&&x.claseId===cl.id);
  if(duplicate){toast("Ya existe una asistencia para esa clase y fecha. Abrí el registro existente para editarlo.");return}
  const record={id:old?.id||"ASI-"+String(Date.now()).slice(-8),fecha:form.fecha,claseId:cl.id,comisionId:cl.comisionId,materiaId:cl.materiaId,docenteId:cl.docenteId,aulaId:cl.aulaId,materiaNombre:scheduleSubjectName(cl.materiaId),comisionNombre:scheduleCommissionName(cl.comisionId),docenteNombre:scheduleTeacherName(cl.docenteId),registros};
  if(old)Object.assign(old,record);else data.asistencias.push(record);
  saveData();b.remove();render();toast("Asistencia guardada correctamente");
 };
}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-attendance-new]");if(add){openAttendanceForm();return}
 const edit=e.target.closest("[data-attendance-edit]");if(edit){openAttendanceForm(edit.dataset.attendanceEdit);return}
 const del=e.target.closest("[data-attendance-delete]");if(del&&confirm("¿Eliminar esta sesión y sus registros individuales?")){data.asistencias=data.asistencias.filter(x=>x.id!==del.dataset.attendanceDelete);saveData();render();toast("Registro eliminado")}
});
function exportAttendanceCSV(){
 const rows=[["Fecha","Materia","Comisión","Docente","Legajo","Alumno/a","Estado","Minutos tarde","Justificación","Observaciones"]];
 data.asistencias.forEach(s=>(s.registros||[]).forEach(r=>rows.push([s.fecha,s.materiaNombre,s.comisionNombre,s.docenteNombre,r.alumnoId,attendanceStudentName(r.alumnoId),r.estado,r.minutosTarde,r.justificacion,r.observaciones])));
 const csv=rows.map(row=>row.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(";")).join("\n");
 const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="iarte-asistencia.csv";a.click();URL.revokeObjectURL(url);toast("CSV de asistencia preparado");
}


// ===== MÓDULO DE PRODUCCIÓN ARTÍSTICA =====
if(!Array.isArray(data.producciones))data.producciones=[];
let productionTab="proyectos";
function productionStatusClass(v){return ["Finalizada","Cancelada","Suspendida"].includes(v)?"pending":""}
function renderProductionModule(){
 const items=[...data.producciones].sort((a,b)=>(b.fechaInicio||"").localeCompare(a.fechaInicio||""));
 const active=items.filter(x=>!["Finalizada","Cancelada"].includes(x.estado)).length;
 root.innerHTML=heading("ÁREA ARTÍSTICA","Producción artística","Administrá proyectos, montajes, elencos, equipos creativos, ensayos y funciones.",'<button class="primary-btn" data-production-add="1">＋ Nuevo proyecto</button>')+
 '<div class="stats-grid">'+stat("Proyectos registrados",items.length,"Producciones cargadas","✧","lav")+stat("En actividad",active,"Procesos no finalizados","◷","mint")+stat("Funciones programadas",items.reduce((n,x)=>n+(x.funciones||[]).length,0),"Fechas de presentación","◎","peach")+stat("Participantes vinculados",new Set(items.flatMap(x=>(x.elenco||[]).map(y=>y.alumnoId).filter(Boolean))).size,"Alumnos únicos en elencos","♧","sky")+'</div>'+
 '<div class="notice"><strong>Producción conectada:</strong> vinculá alumnos y docentes ya registrados. Cada proyecto puede guardar su equipo, elenco, cronograma de ensayos y funciones. Los datos se almacenan en este navegador.</div>'+
 '<div class="toolbar"><input class="search-input" id="productionSearch" placeholder="Buscar por obra, responsable, sala o estado..."><select class="field-select" id="productionStatus"><option value="">Todos los estados</option>'+["Idea","Desarrollo","Ensayos","En preparación","En temporada","Finalizada","Suspendida","Cancelada"].map(x=>'<option>'+x+'</option>').join("")+'</select><button class="secondary-btn" id="productionExport">Exportar CSV</button></div>'+
 '<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Proyecto</th><th>Tipo</th><th>Responsable</th><th>Inicio</th><th>Funciones</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="productionRows">'+productionRows(items)+'</tbody></table></div><p class="panel-sub" style="margin:12px 2px">Cada ficha conserva los datos artísticos y operativos del proyecto.</p>';
 const apply=()=>{const q=document.getElementById("productionSearch").value.toLowerCase(),st=document.getElementById("productionStatus").value;document.getElementById("productionRows").innerHTML=productionRows(items.filter(x=>(!st||x.estado===st)&&[x.nombre,x.tipo,x.responsable,x.sala,x.estado].join(" ").toLowerCase().includes(q)))};
 document.getElementById("productionSearch").oninput=apply;document.getElementById("productionStatus").onchange=apply;
 document.getElementById("productionExport").onclick=exportProductionCSV;
}
function productionRows(items){
 if(!items.length)return '<tr><td colspan="7" class="empty-note">Todavía no hay proyectos. Creá el primero para comenzar.</td></tr>';
 return items.map(x=>'<tr><td><strong>'+escapeHTML(x.nombre)+'</strong><br><small>'+escapeHTML(x.codigo||"Sin código")+'</small></td><td>'+escapeHTML(x.tipo||"—")+'</td><td>'+escapeHTML(x.responsable||"—")+'</td><td>'+escapeHTML(x.fechaInicio||"—")+'</td><td>'+((x.funciones||[]).length)+'</td><td><span class="status '+productionStatusClass(x.estado)+'">'+escapeHTML(x.estado||"Idea")+'</span></td><td><button class="text-link" data-production-edit="'+escapeHTML(x.id)+'">Editar</button> · <button class="text-link" data-production-delete="'+escapeHTML(x.id)+'">Eliminar</button></td></tr>').join("");
}
function openProductionForm(id=null){
 const old=id?data.producciones.find(x=>x.id===id):null;
 const teacherOpts=data.docentes.map(x=>'<option value="'+escapeHTML(x.id)+'" '+(old?.docenteId===x.id?"selected":"")+'>'+escapeHTML(teacherFullName(x))+'</option>').join("");
 const studentOpts=data.alumnos.map(x=>'<option value="'+escapeHTML(x.id)+'">'+escapeHTML(studentFullName(x))+'</option>').join("");
 const b=document.createElement("div");b.className="modal-backdrop";
 b.innerHTML='<form class="modal production-modal" id="productionForm"><h2>'+(old?"Editar proyecto":"Nuevo proyecto artístico")+'</h2><p>Ficha general, responsables, elenco y calendario de presentación.</p><div class="form-section-title">Identificación del proyecto</div><div class="form-row">'+
 productionField("nombre","Nombre del proyecto",old?.nombre,"text",true)+productionField("codigo","Código interno",old?.codigo)+productionField("tipo","Tipo de producción",old?.tipo,"select",false,["Obra teatral","Musical","Taller de montaje","Muestra","Concierto","Evento","Otro"])+productionField("estado","Estado",old?.estado||"Idea","select",false,["Idea","Desarrollo","Ensayos","En preparación","En temporada","Finalizada","Suspendida","Cancelada"])+productionField("fechaInicio","Fecha de inicio",old?.fechaInicio,"date")+productionField("fechaEstreno","Fecha de estreno / muestra",old?.fechaEstreno,"date")+productionField("sala","Sala / espacio",old?.sala)+productionField("responsable","Responsable de producción",old?.responsable)+
 '</div><div class="form-section-title">Dirección y equipo</div><div class="form-row"><div class="form-field"><label>Docente / responsable vinculado</label><select class="field-input" name="docenteId"><option value="">Sin asignar</option>'+teacherOpts+'</select></div><div class="form-field"><label>Dirección artística / técnica</label><input class="field-input" name="direccion" value="'+escapeHTML(old?.direccion||"")+'"></div></div><div class="form-field"><label>Descripción y objetivos</label><textarea class="field-input" name="descripcion" rows="3">'+escapeHTML(old?.descripcion||"")+'</textarea></div><div class="form-section-title">Elenco y participantes</div><div class="form-row"><div class="form-field"><label>Alumno/a participante</label><select class="field-input" id="productionStudent"><option value="">Seleccionar alumno/a</option>'+studentOpts+'</select></div><div class="form-field"><label>Personaje / función</label><input class="field-input" id="productionRole" placeholder="Ej.: Protagonista, ensamble, solista"></div></div><button type="button" class="secondary-btn" id="addProductionCast">＋ Incorporar al elenco</button><div id="productionCast" class="production-cast">'+productionCastRows(old?.elenco||[])+'</div><div class="form-section-title">Ensayos y funciones</div><div class="form-row"><div class="form-field"><label>Ensayos / cronograma</label><textarea class="field-input" name="ensayos" rows="3" placeholder="Fecha · horario · espacio · convocatoria">'+escapeHTML(old?.ensayos||"")+'</textarea></div><div class="form-field"><label>Funciones / presentaciones</label><textarea class="field-input" name="funcionesTexto" rows="3" placeholder="Fecha · hora · sala · observaciones">'+escapeHTML(old?.funcionesTexto||"")+'</textarea></div></div><div class="form-field"><label>Necesidades técnicas y observaciones</label><textarea class="field-input" name="tecnica" rows="3">'+escapeHTML(old?.tecnica||"")+'</textarea></div><div class="modal-actions"><button type="button" class="secondary-btn" id="cancelProduction">Cancelar</button><button class="primary-btn">Guardar proyecto</button></div></form>';
 document.body.appendChild(b);let cast=[...(old?.elenco||[])];
 const redraw=()=>{b.querySelector("#productionCast").innerHTML=productionCastRows(cast)};
 b.querySelector("#addProductionCast").onclick=()=>{const sid=b.querySelector("#productionStudent").value,role=b.querySelector("#productionRole").value.trim(),st=data.alumnos.find(x=>x.id===sid);if(!st){toast("Seleccioná un alumno");return}if(cast.some(x=>x.alumnoId===sid)){toast("Ese alumno ya está incorporado");return}cast.push({alumnoId:sid,nombre:studentFullName(st),rol:role});redraw();b.querySelector("#productionRole").value=""};
 b.querySelector("#productionCast").onclick=e=>{const btn=e.target.closest("[data-cast-remove]");if(btn){cast.splice(Number(btn.dataset.castRemove),1);redraw()}};
 b.querySelector("#cancelProduction").onclick=()=>b.remove();b.addEventListener("click",e=>{if(e.target===b)b.remove()});
 b.querySelector("#productionForm").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));const record={...f,id:old?.id||"PRO-"+String(Date.now()).slice(-8),elenco:cast,funciones:(f.funcionesTexto||"").split("\n").map(x=>x.trim()).filter(Boolean)};if(old)Object.assign(old,record);else data.producciones.push(record);data.actividades.unshift({icon:"✧",title:old?"Proyecto artístico actualizado":"Nuevo proyecto artístico",detail:f.nombre,time:"Ahora"});saveData();b.remove();render();toast("Proyecto guardado correctamente")};
}
function productionField(name,label,value="",type="text",required=false,options=[]){return '<div class="form-field"><label>'+label+'</label>'+(type==="select"?'<select class="field-input" name="'+name+'">'+options.map(x=>'<option '+(value===x?"selected":"")+'>'+x+'</option>').join("")+'</select>':'<input class="field-input" name="'+name+'" type="'+type+'" value="'+escapeHTML(value||"")+'" '+(required?"required":"")+'></div>')}
function productionCastRows(cast){if(!cast.length)return '<p class="panel-sub">No se agregaron participantes todavía.</p>';return '<ul>'+cast.map((x,i)=>'<li>'+escapeHTML(x.nombre||attendanceStudentName(x.alumnoId))+' · '+escapeHTML(x.rol||"Sin rol")+' <button type="button" class="text-link" data-cast-remove="'+i+'">Quitar</button></li>').join("")+'</ul>'}
function exportProductionCSV(){const rows=[["Código","Proyecto","Tipo","Estado","Responsable","Docente ID","Inicio","Estreno","Sala","Elenco","Ensayos","Funciones","Técnica"],...data.producciones.map(x=>[x.codigo,x.nombre,x.tipo,x.estado,x.responsable,x.docenteId,x.fechaInicio,x.fechaEstreno,x.sala,(x.elenco||[]).map(y=>y.nombre+" ("+y.rol+")").join(" | "),x.ensayos,x.funcionesTexto,x.tecnica])];downloadCSV("iarte-produccion.csv",rows)}
function downloadCSV(filename,rows){const csv=rows.map(row=>row.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(";")).join("\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);toast("Archivo CSV preparado")}
document.addEventListener("click",e=>{const add=e.target.closest("[data-production-add]");if(add){openProductionForm();return}const edit=e.target.closest("[data-production-edit]");if(edit){openProductionForm(edit.dataset.productionEdit);return}const del=e.target.closest("[data-production-delete]");if(del&&confirm("¿Eliminar este proyecto y su ficha?")){data.producciones=data.producciones.filter(x=>x.id!==del.dataset.productionDelete);saveData();render();toast("Proyecto eliminado")}});

// ===== MÓDULO DE ADMINISTRACIÓN FINANCIERA =====
if(!Array.isArray(data.movimientos))data.movimientos=[];
function financeStats(){const all=data.movimientos;const income=all.filter(x=>x.tipo==="Ingreso").reduce((n,x)=>n+Number(x.importe||0),0),expense=all.filter(x=>x.tipo==="Egreso").reduce((n,x)=>n+Number(x.importe||0),0);return {income,expense,balance:income-expense,items:all.length}}
function renderFinanceModule(){
 const st=financeStats(),rows=[...data.movimientos].sort((a,b)=>(b.fecha||"").localeCompare(a.fecha||""));
 root.innerHTML=heading("GESTIÓN ECONÓMICA","Administración financiera","Registrá aranceles, cuotas, cobros, gastos, becas aplicadas y movimientos de caja.",'<button class="primary-btn" data-finance-add="1">＋ Nuevo movimiento</button>')+
 '<div class="stats-grid">'+stat("Ingresos",financeMoney(st.income),"Cobros registrados","＋","mint")+stat("Egresos",financeMoney(st.expense),"Gastos registrados","−","peach")+stat("Saldo",financeMoney(st.balance),"Ingresos menos egresos","＄","lav")+stat("Movimientos",st.items,"Operaciones cargadas","▤","sky")+'</div>'+
 '<div class="notice"><strong>Control financiero inicial:</strong> este módulo registra movimientos de caja de manera manual. No procesa pagos, no se conecta con bancos ni emite comprobantes fiscales. Los importes se guardan en la moneda indicada en cada registro.</div>'+
 '<div class="toolbar"><input class="search-input" id="financeSearch" placeholder="Buscar por concepto, alumno, proveedor o categoría..."><select class="field-select" id="financeType"><option value="">Todos los movimientos</option><option>Ingreso</option><option>Egreso</option></select><button class="secondary-btn" id="financeExport">Exportar CSV</button></div>'+
 '<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Fecha</th><th>Tipo</th><th>Categoría</th><th>Concepto</th><th>Relacionado</th><th>Importe</th><th>Acciones</th></tr></thead><tbody id="financeRows">'+financeRows(rows)+'</tbody></table></div><p class="panel-sub" style="margin:12px 2px">El saldo es un cálculo de los movimientos cargados, no una conciliación bancaria.</p>';
 const apply=()=>{const q=document.getElementById("financeSearch").value.toLowerCase(),t=document.getElementById("financeType").value;document.getElementById("financeRows").innerHTML=financeRows(rows.filter(x=>(!t||x.tipo===t)&&[x.categoria,x.concepto,x.relacionado,x.referencia].join(" ").toLowerCase().includes(q)))};
 document.getElementById("financeSearch").oninput=apply;document.getElementById("financeType").onchange=apply;document.getElementById("financeExport").onclick=exportFinanceCSV;
}
function financeMoney(v){return new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:2}).format(Number(v||0))}
function financeRows(rows){if(!rows.length)return '<tr><td colspan="7" class="empty-note">No hay movimientos registrados.</td></tr>';return rows.map(x=>'<tr><td>'+escapeHTML(x.fecha||"—")+'</td><td><span class="status '+(x.tipo==="Egreso"?"pending":"")+'">'+escapeHTML(x.tipo)+'</span></td><td>'+escapeHTML(x.categoria||"—")+'</td><td>'+escapeHTML(x.concepto||"—")+'</td><td>'+escapeHTML(x.relacionado||"—")+'</td><td><strong>'+financeMoney(x.importe)+'</strong></td><td><button class="text-link" data-finance-edit="'+escapeHTML(x.id)+'">Editar</button> · <button class="text-link" data-finance-delete="'+escapeHTML(x.id)+'">Eliminar</button></td></tr>').join("")}
function openFinanceForm(id=null){
 const old=id?data.movimientos.find(x=>x.id===id):null;const b=document.createElement("div");b.className="modal-backdrop";
 const students=data.alumnos.map(x=>'<option>'+escapeHTML(studentFullName(x))+'</option>').join("");
 b.innerHTML='<form class="modal finance-modal" id="financeForm"><h2>'+(old?"Editar movimiento":"Nuevo movimiento financiero")+'</h2><p>Ingresá los datos de la operación. El importe debe ser positivo.</p><div class="form-row">'+
 productionField("fecha","Fecha",old?.fecha||new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10),"date",true)+productionField("tipo","Tipo",old?.tipo||"Ingreso","select",false,["Ingreso","Egreso"])+productionField("categoria","Categoría",old?.categoria||"","select",false,["Aranceles y cuotas","Matrícula e inscripción","Clases particulares","Funciones y entradas","Talleres y seminarios","Sueldos y honorarios","Alquiler","Servicios","Equipamiento","Producción artística","Becas y descuentos","Impuestos y tasas","Otros"])+productionField("concepto","Concepto",old?.concepto||"","text",true)+
 '</div><div class="form-row"><div class="form-field"><label>Alumno/a relacionado (opcional)</label><select class="field-input" name="relacionado"><option value="">Sin vincular</option>'+students+'</select></div>'+productionField("referencia","Proveedor / referencia",old?.referencia||"")+'</div><div class="form-row">'+productionField("importe","Importe en pesos argentinos",old?.importe||"","number",true)+productionField("medio","Medio de pago",old?.medio||"","select",false,["Efectivo","Transferencia","Tarjeta","Débito automático","Otro"])+'</div><div class="form-field"><label>Observaciones</label><textarea class="field-input" name="observaciones" rows="3">'+escapeHTML(old?.observaciones||"")+'</textarea></div><div class="modal-actions"><button type="button" class="secondary-btn" id="cancelFinance">Cancelar</button><button class="primary-btn">Guardar movimiento</button></div></form>';
 document.body.appendChild(b);b.querySelector("#cancelFinance").onclick=()=>b.remove();b.addEventListener("click",e=>{if(e.target===b)b.remove()});
 if(old&&old.relacionado)b.querySelector('[name="relacionado"]').value=old.relacionado;
 b.querySelector("#financeForm").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));if(!(Number(f.importe)>0)){toast("El importe debe ser mayor que cero");return}const rec={...f,importe:Number(f.importe),id:old?.id||"MOV-"+String(Date.now()).slice(-8)};if(old)Object.assign(old,rec);else data.movimientos.push(rec);data.actividades.unshift({icon:f.tipo==="Ingreso"?"＋":"−",title:old?"Movimiento financiero actualizado":"Movimiento financiero registrado",detail:f.concepto,time:"Ahora"});saveData();b.remove();render();toast("Movimiento guardado correctamente")};
}
function exportFinanceCSV(){downloadCSV("iarte-movimientos-financieros.csv",[["Fecha","Tipo","Categoría","Concepto","Relacionado","Referencia","Importe ARS","Medio","Observaciones"],...data.movimientos.map(x=>[x.fecha,x.tipo,x.categoria,x.concepto,x.relacionado,x.referencia,x.importe,x.medio,x.observaciones])])}
document.addEventListener("click",e=>{const add=e.target.closest("[data-finance-add]");if(add){openFinanceForm();return}const edit=e.target.closest("[data-finance-edit]");if(edit){openFinanceForm(edit.dataset.financeEdit);return}const del=e.target.closest("[data-finance-delete]");if(del&&confirm("¿Eliminar este movimiento financiero?")){data.movimientos=data.movimientos.filter(x=>x.id!==del.dataset.financeDelete);saveData();render();toast("Movimiento eliminado")}});


// ===== MÓDULO DE BECAS Y ACOMPAÑAMIENTO =====
if(!Array.isArray(data.becas))data.becas=[];
const scholarshipStatuses=["Borrador","Recibida","Documentación pendiente","En evaluación","Aprobada","Rechazada","En espera","Renovación pendiente","Finalizada","Desistida"];
const scholarshipTypes=["Beca completa","Beca parcial","Beca por mérito artístico","Beca por situación económica","Beca por continuidad","Beca de emergencia","Otra"];
function scholarshipStudentName(id){const s=data.alumnos.find(x=>x.id===id);return s?studentFullName(s):"Alumno/a no vinculado"}
function scholarshipMoney(v){return new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(Number(v||0))}
function scholarshipStats(){
 const all=data.becas,approved=all.filter(x=>x.estado==="Aprobada");
 return {total:all.length,approved:approved.length,pending:all.filter(x=>["Recibida","Documentación pendiente","En evaluación","En espera","Renovación pendiente"].includes(x.estado)).length,coverage:approved.reduce((n,x)=>n+Number(x.porcentaje||0),0),full:approved.filter(x=>Number(x.porcentaje)>=100).length};
}
function scholarshipRows(rows){
 if(!rows.length)return '<tr><td colspan="8" class="empty-note">No hay solicitudes que coincidan. Creá una nueva postulación para comenzar.</td></tr>';
 return rows.map(x=>'<tr><td><strong>'+escapeHTML(scholarshipStudentName(x.alumnoId))+'</strong><br><small>'+escapeHTML(x.codigo||"Sin código")+'</small></td><td>'+escapeHTML(x.tipo||"—")+'</td><td>'+escapeHTML(x.periodo||"—")+'</td><td>'+escapeHTML(x.porcentaje||0)+'%</td><td>'+escapeHTML(x.fechaSolicitud||"—")+'</td><td><span class="status '+(["Rechazada","Finalizada","Desistida"].includes(x.estado)?"pending":"")+'">'+escapeHTML(x.estado||"Recibida")+'</span></td><td>'+escapeHTML(x.vigenciaHasta||"—")+'</td><td><button class="text-link" data-scholarship-edit="'+escapeHTML(x.id)+'">Editar</button> · <button class="text-link" data-scholarship-delete="'+escapeHTML(x.id)+'">Eliminar</button></td></tr>').join("");
}
function renderScholarshipModule(){
 const st=scholarshipStats(),rows=[...data.becas].sort((a,b)=>(b.fechaSolicitud||"").localeCompare(a.fechaSolicitud||""));
 root.innerHTML=heading("ACOMPAÑAMIENTO INSTITUCIONAL","Becas","Administrá postulaciones, documentación, evaluación, asignaciones, vigencias y renovaciones.",'<button class="primary-btn" data-scholarship-add="1">＋ Nueva solicitud</button>')+
 '<div class="stats-grid">'+stat("Solicitudes",st.total,"Postulaciones registradas","♡","lav")+stat("Becas aprobadas",st.approved,"Asignaciones vigentes o resueltas","✓","mint")+stat("En seguimiento",st.pending,"Pendientes de resolución o documentación","◷","peach")+stat("Cobertura asignada",st.coverage+"%","Suma de porcentajes aprobados","▤","sky")+'</div>'+
 '<div class="notice"><strong>Gestión responsable:</strong> registrá solamente la información necesaria para evaluar y acompañar cada solicitud. Esta versión es un prototipo local; no incorpora expedientes protegidos, firma digital ni notificaciones automáticas. Evitá cargar información sensible real.</div>'+
 '<div class="toolbar"><input class="search-input" id="scholarshipSearch" placeholder="Buscar por alumno, legajo, tipo o período..."><select class="field-select" id="scholarshipStatus"><option value="">Todos los estados</option>'+scholarshipStatuses.map(x=>'<option>'+x+'</option>').join("")+'</select><select class="field-select" id="scholarshipType"><option value="">Todos los tipos</option>'+scholarshipTypes.map(x=>'<option>'+x+'</option>').join("")+'</select><button class="secondary-btn" id="scholarshipExport">Exportar CSV</button></div>'+
 '<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Alumno/a</th><th>Tipo de beca</th><th>Período</th><th>Cobertura</th><th>Solicitud</th><th>Estado</th><th>Vigencia hasta</th><th>Acciones</th></tr></thead><tbody id="scholarshipRows">'+scholarshipRows(rows)+'</tbody></table></div>'+
 '<div class="scholarship-lower"><section class="panel"><div class="panel-head"><div><h2>Distribución de estados</h2><div class="panel-sub">Solicitudes según su etapa de gestión</div></div></div>'+scholarshipStatuses.map(x=>{const n=rows.filter(y=>y.estado===x).length;return '<div class="scholarship-state"><span>'+escapeHTML(x)+'</span><strong>'+n+'</strong><div class="scholarship-bar"><i style="width:'+(rows.length?Math.round(n/rows.length*100):0)+'%"></i></div></div>'}).join("")+'</section><section class="panel"><div class="panel-head"><div><h2>Próximas renovaciones</h2><div class="panel-sub">Becas aprobadas con fecha de vencimiento registrada</div></div></div>'+scholarshipRenewalList(rows)+'</section></div>';
 const apply=()=>{const q=document.getElementById("scholarshipSearch").value.toLowerCase(),s=document.getElementById("scholarshipStatus").value,t=document.getElementById("scholarshipType").value;document.getElementById("scholarshipRows").innerHTML=scholarshipRows(rows.filter(x=>(!s||x.estado===s)&&(!t||x.tipo===t)&&[scholarshipStudentName(x.alumnoId),x.codigo,x.tipo,x.periodo,x.estado].join(" ").toLowerCase().includes(q)))};
 document.getElementById("scholarshipSearch").oninput=apply;document.getElementById("scholarshipStatus").onchange=apply;document.getElementById("scholarshipType").onchange=apply;document.getElementById("scholarshipExport").onclick=exportScholarshipsCSV;
}
function scholarshipRenewalList(rows){
 const today=new Date();today.setHours(0,0,0,0);
 const upcoming=rows.filter(x=>x.estado==="Aprobada"&&x.vigenciaHasta).map(x=>({...x,days:Math.ceil((new Date(x.vigenciaHasta+"T00:00:00")-today)/86400000)})).filter(x=>x.days>=0&&x.days<=60).sort((a,b)=>a.days-b.days);
 if(!upcoming.length)return '<p class="empty-note">No hay renovaciones dentro de los próximos 60 días.</p>';
 return upcoming.map(x=>'<div class="scholarship-renewal"><strong>'+escapeHTML(scholarshipStudentName(x.alumnoId))+'</strong><span>'+escapeHTML(x.vigenciaHasta)+' · '+x.days+' días</span><button class="text-link" data-scholarship-edit="'+escapeHTML(x.id)+'">Abrir ficha</button></div>').join("");
}
function openScholarshipForm(id=null){
 const old=id?data.becas.find(x=>x.id===id):null;
 const b=document.createElement("div");b.className="modal-backdrop";
 const studentOptions=data.alumnos.map(x=>'<option value="'+escapeHTML(x.id)+'" '+(old?.alumnoId===x.id?"selected":"")+'>'+escapeHTML(studentFullName(x))+' · '+escapeHTML(x.id)+'</option>').join("");
 const field=(key,label,value="",type="text",required=false,full=false)=>'<div class="form-field '+(full?"full-field":"")+'"><label>'+label+'</label><input class="field-input" name="'+key+'" type="'+type+'" value="'+escapeHTML(value??"")+'" '+(required?"required":"")+'></div>';
 const select=(key,label,options,value)=>'<div class="form-field"><label>'+label+'</label><select class="field-input" name="'+key+'">'+options.map(o=>'<option '+(value===o?"selected":"")+'>'+o+'</option>').join("")+'</select></div>';
 b.innerHTML='<form class="modal scholarship-modal" id="scholarshipForm"><h2>'+(old?"Editar solicitud de beca":"Nueva solicitud de beca")+'</h2><p>Completá la postulación, el proceso de evaluación y la resolución institucional.</p>'+
 '<div class="form-section-title">Identificación y período</div><div class="form-row"><div class="form-field"><label>Alumno/a *</label><select class="field-input" name="alumnoId" required><option value="">Seleccionar alumno/a</option>'+studentOptions+'</select></div>'+field("codigo","Código de solicitud",old?.codigo||"BE-"+String(Date.now()).slice(-7))+field("fechaSolicitud","Fecha de solicitud",old?.fechaSolicitud||new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10),"date",true)+field("periodo","Período académico",old?.periodo||new Date().getFullYear(), "text",true)+select("tipo","Tipo de beca",scholarshipTypes,old?.tipo||scholarshipTypes[0])+select("estado","Estado de la solicitud",scholarshipStatuses,old?.estado||"Recibida")+'</div>'+
 '<div class="form-section-title">Cobertura y vigencia</div><div class="form-row">'+field("porcentaje","Porcentaje de cobertura (0 a 100)",old?.porcentaje??0,"number",true)+field("vigenciaDesde","Vigencia desde",old?.vigenciaDesde||"","date")+field("vigenciaHasta","Vigencia hasta",old?.vigenciaHasta||"","date")+field("renovacion","Renovación / período siguiente",old?.renovacion||"","text")+'</div>'+
 '<div class="form-section-title">Documentación y evaluación</div><div class="scholarship-checklist">'+["Formulario de solicitud recibido","Documentación de identidad verificada","Constancia de alumno/a regular","Documentación respaldatoria recibida","Entrevista o reunión realizada","Evaluación académica completada"].map((x,i)=>'<label><input type="checkbox" name="doc_'+i+'" '+(old?.documentacion?.[i]?"checked":"")+'><span>'+x+'</span></label>').join("")+'</div>'+
 '<div class="form-row">'+field("evaluador","Responsable de evaluación",old?.evaluador||"")+field("fechaEvaluacion","Fecha de evaluación",old?.fechaEvaluacion||"","date")+field("comite","Comité / autoridad resolutiva",old?.comite||"")+field("fechaResolucion","Fecha de resolución",old?.fechaResolucion||"","date")+field("montoReferencia","Arancel mensual de referencia (ARS)",old?.montoReferencia??"","number")+'</div>'+
 '<div class="form-field"><label>Fundamento y criterios de evaluación</label><textarea class="field-input" name="fundamento" rows="3">'+escapeHTML(old?.fundamento||"")+'</textarea></div><div class="form-field"><label>Resolución y condiciones</label><textarea class="field-input" name="resolucion" rows="3">'+escapeHTML(old?.resolucion||"")+'</textarea></div><div class="form-field"><label>Observaciones de seguimiento</label><textarea class="field-input" name="observaciones" rows="3">'+escapeHTML(old?.observaciones||"")+'</textarea></div>'+
 '<div class="modal-actions"><button type="button" class="secondary-btn" id="cancelScholarship">Cancelar</button><button class="primary-btn" type="submit">Guardar solicitud</button></div></form>';
 document.body.appendChild(b);b.querySelector("#cancelScholarship").onclick=()=>b.remove();b.addEventListener("click",e=>{if(e.target===b)b.remove()});
 b.querySelector("#scholarshipForm").onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target),f=Object.fromEntries(fd.entries());const percentage=Number(f.porcentaje);if(percentage<0||percentage>100){toast("El porcentaje debe estar entre 0 y 100");return}if(f.vigenciaDesde&&f.vigenciaHasta&&f.vigenciaHasta<f.vigenciaDesde){toast("La fecha final no puede ser anterior al inicio");return}const docs=[0,1,2,3,4,5].map(i=>fd.has("doc_"+i));const rec={...f,id:old?.id||"BEC-"+String(Date.now()).slice(-8),porcentaje:percentage,montoReferencia:Number(f.montoReferencia||0),documentacion:docs};if(old)Object.assign(old,rec);else data.becas.push(rec);data.actividades.unshift({icon:"♡",title:old?"Solicitud de beca actualizada":"Nueva solicitud de beca",detail:scholarshipStudentName(rec.alumnoId),time:"Ahora"});saveData();b.remove();render();toast("Solicitud de beca guardada")};
}
function exportScholarshipsCSV(){
 const headers=["Código","Alumno/a","Legajo","Tipo","Período","Estado","Porcentaje","Fecha solicitud","Vigencia desde","Vigencia hasta","Evaluador","Fecha evaluación","Comité","Fecha resolución","Monto referencia ARS","Documentación","Fundamento","Resolución","Observaciones"];
 const rows=data.becas.map(x=>[x.codigo,scholarshipStudentName(x.alumnoId),x.alumnoId,x.tipo,x.periodo,x.estado,x.porcentaje,x.fechaSolicitud,x.vigenciaDesde,x.vigenciaHasta,x.evaluador,x.fechaEvaluacion,x.comite,x.fechaResolucion,x.montoReferencia,(x.documentacion||[]).map((v,i)=>v?["Formulario","Identidad","Alumno regular","Respaldo","Entrevista","Evaluación académica"][i]:"").filter(Boolean).join(", "),x.fundamento,x.resolucion,x.observaciones]);
 downloadCSV("iarte-solicitudes-becas.csv",[headers,...rows]);
}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-scholarship-add]");if(add){openScholarshipForm();return}
 const edit=e.target.closest("[data-scholarship-edit]");if(edit){openScholarshipForm(edit.dataset.scholarshipEdit);return}
 const del=e.target.closest("[data-scholarship-delete]");if(del&&confirm("¿Eliminar esta solicitud de beca?")){data.becas=data.becas.filter(x=>x.id!==del.dataset.scholarshipDelete);saveData();render();toast("Solicitud eliminada")}
});
