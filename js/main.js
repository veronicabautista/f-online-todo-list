'use strict';

window.onload = function() {
  const tasksHeader = document.querySelector('.tasks__header');
  const tasksBody = document.querySelector('.tasks__container');
  const inputTask = document.querySelector('.input-task');
  let inputTaskValue = {
    'text': '',
    'checkValue': false,
    'id': ''
  };
  const tasksListContainer = document.querySelector('.tasks');
  const taskItemContainer = document.querySelector('.task-item');
  const btnShowAddNewContainer = document.querySelector('.btn-plus__container');
  const btnShowAddNew = document.getElementById('btn--plus');
  const newTaskContainer = document.getElementById('new-task__container');
  const btnAddNew = document.querySelector('.btn--add-new');
  let tasksArray = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

  //LocalStorage
  localStorage.setItem('tasks', JSON.stringify(tasksArray) );
  const dataFromStorage = JSON.parse(localStorage.getItem('tasks'));

  //Obtener fecha
  const paintDate = () => {
    const months = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    const daysWeek = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
    const date = new Date();
    let buildDate =
      `<div class="date__container">
        <span class="date--number"> ${date.getDate()}</span>
        <div>
          <p class="date--day-week">${daysWeek[date.getDay()]}</p>
          <p class="date--month-year">${months[date.getMonth()]}, ${date.getFullYear()}</p>
        </div>
      </div>`

    tasksHeader.insertAdjacentHTML('beforeend', buildDate);
  }

  //Gestionar elementos clicados
  const handleCheckBox = (e) => {
    handleTasksDone(e.target);
  }

  const handleTaskLi = (e) => {
    const targetId = e.target.getAttribute('for');
    const targetCheck = document.getElementById(`${targetId}`);
    if (targetCheck.value == false){
      targetCheck.value = true;
    } else {
      targetCheck.value = false;
    }
    handleTasksDone(targetCheck);
  }

  //Cambiar visualizacion del item clicado y su almacenamiento en localstorage
  const handleTasksDone = (selectCheckBox) => {
    const targetParent = selectCheckBox.parentElement;
    const selectId = selectCheckBox.getAttribute('id');
    const selectText = document.querySelector(`.label-${selectId}`);
    for (var i = 0; i < tasksArray.length; i++) {
      if (selectCheckBox.checked == true) {
        selectText.classList.add('cross');
        tasksListContainer.append(targetParent);
        if (selectId == tasksArray[i].id) {
          tasksArray[i].checkValue = true;
          localStorage.setItem('tasks', JSON.stringify(tasksArray) );
        }
      }
      else {
        selectText.classList.remove('cross');
        tasksListContainer.prepend(targetParent);
        if (selectId == tasksArray[i].id) {
          tasksArray[i].checkValue = false;
          localStorage.setItem('tasks', JSON.stringify(tasksArray) );
        }
      }
    }
  }

  //Establecer funciones onclick en elementos creados más tarde
  const setEvent = () => {
    const checkboxContainer = document.querySelectorAll('.checkbox');
    const allTaskContainer = document.querySelectorAll('.label-check')
    for (var i = 0; i < checkboxContainer.length; i++) {
      checkboxContainer[i].addEventListener('click', handleCheckBox);
      allTaskContainer[i].addEventListener('click', handleTaskLi);
    }
  }
  setEvent();
  paintDate();

  //Pintar la lista de tareas
  const paintList = (text, id) => {
    const taskItem = `<li class="task-item"><input type="checkbox" class="checkbox"  id="${id}"><label class="label-check label-${id}" for="${id}">${text}</label></li>`;
    tasksListContainer.insertAdjacentHTML('afterbegin', taskItem);
    setEvent();
  };

  //Añadir nueva tarea
  const handleInsertTask = (text) => {
    inputTaskValue = {
      'text': inputTask.value,
      'checkValue': false
    };
    paintList(inputTaskValue.text);
    tasksArray.push(inputTaskValue);
    for (var i = 0; i < tasksArray.length; i++) {
      tasksArray[i].id = i
    }
    localStorage.setItem('tasks', JSON.stringify(tasksArray) );
    hideNewTaskContainer();

  }
  btnAddNew.addEventListener('click', handleInsertTask);

  //Administrar los datos de Storage
  const paintTasksFromStorage = () => {
    dataFromStorage.map(task => {
      paintList(task.text, task.id);
      if (task.checkValue == true) {
        const idToCompare = document.getElementById(`${task.id}`);
        const labelId = document.querySelector(`.label-${task.id}`);
        idToCompare.checked = true;
        labelId.classList.add('cross');
        tasksListContainer.append(idToCompare.parentElement);
      }
    })
  }
  paintTasksFromStorage();

  const showNewTaskContainer = () => {
    newTaskContainer.classList.add('visible');
    newTaskContainer.classList.remove('invisible');
    btnShowAddNewContainer.classList.add('invisible');
    tasksBody.classList.add('page--input-visible');
  }
  btnShowAddNew.addEventListener('click', showNewTaskContainer);

  const hideNewTaskContainer = () => {
    newTaskContainer.classList.add('invisible');
    btnShowAddNewContainer.classList.remove('invisible');
    tasksBody.classList.remove('page--input-visible');
  }
}