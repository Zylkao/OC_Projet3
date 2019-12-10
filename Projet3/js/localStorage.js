class StorageNames{
  constructor(){
    this.nameForm = document.getElementById('name'),
    this.surnameForm = document.getElementById('surname');
    this.currentName = localStorage.getItem('name');
    this.currentSurname = localStorage.getItem('surname');
  }

  checkNames(){
    if(!localStorage.getItem('name') && !localStorage.getItem('surname')) {
      storageNames.idStorage();
    } else {
      storageNames.setId();
    }
  }
  
  idStorage(){
    localStorage.setItem('name', document.getElementById('name').value);
    localStorage.setItem('surname', document.getElementById('surname').value);

    storageNames.setId();
  }

  setId() {
    document.getElementById('name').value = this.currentName;
    document.getElementById('surname').value = this.currentSurname;
  }

}

var storageNames = new StorageNames();
storageNames.checkNames();
