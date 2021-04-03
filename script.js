const list = document.querySelector('.list');
const addButton = document.querySelector('.add-button');
const inputText = document.querySelector('.task-text');
const clearButton = document.querySelector('.clear-button');
let todoItems = [];

//on site loaded, renders tasks from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const ref = localStorage.getItem('todoItemsRef');
  if(ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach(key => {createItem(key.content, key.state)});
  }
});

//createItem
const createItem = (content, state) => {
  const item = document.createElement('li');
  const deleteButton = document.createElement('button');
  const doneButton = document.createElement('button');
  const editButton = document.createElement('button');
  const itemContent = document.createElement('span');

  //item & itemContent
  if(state === true) {
    item.className = 'done-item';
    item.style.textDecoration = "line-through";
    item.style.opacity = "0.6";
  }

  item.classList.add('item');
  itemContent.className='item-content';
  itemContent.setAttribute('contenteditable','false');
  if(!content)
    itemContent.textContent = inputText.value;
  else
    itemContent.textContent = content;

  item.appendChild(itemContent);

  //deleteButton
  deleteButton.className='delete-button';
  deleteButton.textContent='Delete';
  deleteButton.onclick = () => {
    item.classList.add('item-fall');
    if (item.classList.contains('item-fall')) {
      setTimeout(() => {item.remove()}, 300);
    }
  }

  item.appendChild(deleteButton);

  //editButton
  editButton.className='edit-button';
  editButton.textContent='Edit';
  editButton.onclick = () => {
    itemContent.setAttribute('contenteditable','true');
    itemContent.focus();
    if(editButton.textContent === 'Edit') {
      itemContent.setAttribute('contenteditable','true');
      editButton.textContent = 'Save';
    } else {
      itemContent.setAttribute('contenteditable','false');
      editButton.textContent = 'Edit';
    }
  }
  state !== true ? item.appendChild(editButton) : null; //adding editButton

  //doneButton
  doneButton.className='done-button';
  doneButton.textContent='Done';
  doneButton.onclick = () => {
    if(editButton.textContent = 'Save') {
      itemContent.setAttribute('contenteditable','false');
      editButton.textContent = 'Edit';
    }
    item.style.textDecoration = "line-through";
    item.style.opacity = "0.6";
    editButton.disabled = true;
    doneButton.disabled = true;
    doneButton.classList.add('button-fall');
    editButton.classList.add('button-fall');
    setTimeout(() => {
      doneButton.remove();
      editButton.remove();
    }, 300);
  }
  state !== true ? item.appendChild(doneButton) : null; //adding doneButton

  list.prepend(item);
}

//clearDoneTasks
const clearDoneTasks = () => {
  const items = document.querySelectorAll('.item');
  let isSomethingDone = false;
  items.forEach(key => {
    if(key.childNodes.length !== 4) {
      isSomethingDone = true;
      key.classList.add('item-fall');
      setTimeout(() => {key.remove()}, 300);
    }
  });
  isSomethingDone === false ? alert('There aren\'t done tasks!') : null;
}

//creates objects
const saveItem = (content, state) => {
  let newItem = {content, state}
  return newItem;
}

//addButton
addButton.addEventListener('click', (e) => {
  e.preventDefault();
  if(inputText.value != "") {
    createItem();
    inputText.value = "";
  }
  else
    alert('Task can\'t be empty!');
}, false);

//clearButton
clearButton.onclick = (e) => {
  e.preventDefault();
  clearDoneTasks();
};

//when closing browser function saves list to localStorage
window.onbeforeunload = () => {
  window.localStorage.clear();
  todoItems = [];
  const items = document.querySelectorAll('.item-content');
  if(items.length > 0) {
    for(let i = items.length - 1; i >= 0; i--) {
      todoItems.push(saveItem(items[i].textContent, list.childNodes[i].childNodes.length !== 4));
    }
    localStorage.setItem('todoItemsRef', JSON.stringify(todoItems));
  }
}