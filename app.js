//Note  Class: Represents a Note
class Note {
    constructor(title,content){
        this.title = title;
        this.content = content;
    }
}

//UI Class: Hangle UI Tasks
class UI {
    static displayNotes(){
        


        const notes = Store.getNotes();

        notes.forEach((note) => UI.addNoteToList(note));
    }

    static addNoteToList(note) {
        const list = document.getElementById("note-list");

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${note.title}</td>
            <td>${note.content}</td>
            <td><a href = "#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteNote(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    

    static showAlert(message,className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#note-form');
        container.insertBefore(div,form);
        //Vanish in 3 seconds
        var time = 3000;
        if(className === 'success' || className === 'info')
            time = 1500;
        setTimeout(() => document.querySelector('.alert').remove(), time);
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#content').value = '';
    }
}


//Store Class: Handles Storage
class Store {
    static getNotes(){
        let notes;
        if(localStorage.getItem('notes') === null){
            notes = [];
        } else{
            notes = JSON.parse(localStorage.getItem('notes'));
        }
        return notes;
    }

    static addNote(note){
        const notes = Store.getNotes();
        notes.push(note);
        localStorage.setItem('notes',JSON.stringify(notes));
    }

    static removeNote(title){
        const notes = Store.getNotes();

        notes.forEach((note,index) => {
            if(note.title === title){
                notes.splice(index,1);
            }
        });

        localStorage.setItem('notes',JSON.stringify(notes));
    }
}




//Event: Display Notes
document.addEventListener('DOMContentLoaded',UI.displayNotes);
//Event: Add a Note
document.querySelector('#note-form').addEventListener('submit',
(e) => {
    //Prevent actual submit
    e.preventDefault();
    //Get form values
    const title = document.querySelector('#title').value;
    const content = document.querySelector('#content').value;

    //Validate
    if(title === '' || content === ''){
        UI.showAlert('Zapolni polji naslov in vsebina','danger');
    } else{

        //Initiate note
        const note = new Note(title,content);
        //console.log(note);

        //Add note to UI
        UI.addNoteToList(note);

        //add note to store
        Store.addNote(note);
        
        //Show success message
        UI.showAlert('Note dodan','success');
        
        //Clear fields
        UI.clearFields();
    }
    
});

//Event: Remove a Note
document.querySelector('#note-list').addEventListener('click',
(e) => {
    //console.log(e);
    //console.log(e.target);
    
    //Remove Note from UI
    UI.deleteNote(e.target);

    //Remove Note from store
    Store.removeNote(e.target.parentElement.parentElement.cells[0].innerHTML);

    //Show success message
    UI.showAlert('Note odstranjen','info');

});

