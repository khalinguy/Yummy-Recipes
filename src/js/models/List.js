import uniqid from 'uniqid';
import {elements} from '../views/base';
export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }

        //Add to local storage
        this.persistData();

        this.items.push(item);
        return item;
    }

    deleteItem (id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);

        //Delete from local storage
        this.persistData();
    }

    deleteAllItem () {
        this.items = [];

        //Delete from local storage
        this.persistData();
    }

    updateCount (id, newCount){
        this.items.find(el => el.id === id).count = newCount;

        //Update local storage
        this.persistData();
    }

    isDeleteAllBtnHere () {
        const btnDeleteAll = document.querySelector('.btn-delete-all');
        return (btnDeleteAll === document.body) ? false : document.body.contains(btnDeleteAll);
    }

    persistData(){
        localStorage.setItem('lists', JSON.stringify(this.items));
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('lists'));

        //Restoring lists from local storage
        if (storage) this.items = storage;
    }
}