const addBox = document.querySelector(".add-box"),
    popupBox = document.querySelector(".popup-box"),
    popupTitle = popupBox.querySelector("header p"),
    closeIcon = popupBox.querySelector("header i"),
    titleTag = popupBox.querySelector("input"),
    descTag = popupBox.querySelector("textarea"),
    addBtn = popupBox.querySelector("button");

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

/*En esta parte tenemos que agregar las notas por usuario
para que cada usuario cuente con sus notas por lo tanto se quedaran
almacenadas localmente
*/
const notes = 
JSON.parse(localStorage.getItem("notes") || "[]");

let isUpdate = false, updateId;

// Bloque evento de click -----
addBox.addEventListener("click", () => {
    popupTitle.innerText = "add a new note";
    addBtn.innerText = "add Note"
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";

    if(window.innerWidth > 660) titleTag.focus();
});

// bloque ver si existe una nota de manera local

//   bloque cierrre del popup box

closeIcon.addEventListener( "click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

// ------------------------

// desplegar si una nota existe

function showNotes() {
    if(!notes) return;
    document.querySelectorAll(".note").forEach(li => li.remove());

    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag) 
    });
}

showNotes();

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}


//elimnar
function deleteNote(noteId) {
  let confirmDel = confirm("Estas seguro que quieres elimnar esta nota?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

// Editar
function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll('<br/>', '\r\n');
  updateId = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}


// bloque creacion de notas

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
        description = descTag.value.trim();

    if(title || description) {
        let currentDate = new Date(),
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();
    

    let noteInfo = { title, description, date: `${month} ${day} ${year}`}

    if(!isUpdate) {
        notes.push(noteInfo);
    } else {
        isUpdate = false;
        notes[updateId] = noteInfo;
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
    }
});