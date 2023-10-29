/** 
* {
*     id: string | number,
*     title: string,
*     author: string,
*     year: number,
*     isComplete: boolean,
* }
*/
  
const books = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'BOOKSHELF_APPS';

  function generateId() {
    return +new Date();
  }
  
  function generateTodoObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    };
  }
  
  function findBook(todoId) {
    for (const todoItem of books) {
      if (todoItem.id === todoId) {
        return todoItem;
      }
    }
    return null;
  }
  
  function findBookIndex(todoId) {
    for (const index in books) {
      if (books[index].id === todoId) {
        return index;
      }
    }
    return -1;
  }

  function searchBook(title){
    const result =  books.find((book) => book.title.toLowerCase().includes(title.toLowerCase()),);
    if(result == undefined){
        return null;
    }
    return result;
  }

  /**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }
  
  /**
   * Fungsi ini digunakan untuk menyimpan data ke localStorage
   * berdasarkan KEY yang sudah ditetapkan sebelumnya.
   */
  function saveData() {
    if (isStorageExist()) {
      const parsed /* string */ = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }
  
  /**
   * Fungsi ini digunakan untuk memuat data dari localStorage
   * Dan memasukkan data hasil parsing ke variabel {@see books}
   */
  function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    console.log(data);
    if (data !== null) {
      for (const todo of data) {
        books.push(todo);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function makeItemBook(booksObject){
    const {id, title, author, year, isCompleted} = booksObject;
    
    const titleBook = document.createElement("h3");
    titleBook.innerText = title;

    const authorBook = document.createElement("p");
    authorBook.innerText = `Penulis: ${author}`;

    const yearBook = document.createElement("p");
    yearBook.innerText =  `Tahun: ${year}`;

    const articleBook = document.createElement("article");
    articleBook.classList.add("book_item");
    articleBook.setAttribute("id", `book-${id}`);
    articleBook.append(titleBook, authorBook, yearBook);

    if(isCompleted){
        const isDoneButton = document.createElement("button");
        isDoneButton.classList.add("green");
        isDoneButton.innerText = "Belum selesai di Baca";
        isDoneButton.addEventListener("click" , function(){
            moveBooks(id, false);
        });

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("red");
        deleteButton.innerText = "Hapus buku";
        deleteButton.addEventListener("click" , function(){
            var result = confirm("Are you sure you want to delete this book?");
            if(result){
                removeBook(id);
            }
        });
        
        const actionDiv = document.createElement("div");
        actionDiv.classList.add("action");
        actionDiv.append(isDoneButton, deleteButton);

        articleBook.append(actionDiv);
    }else{
        const isDoneButton = document.createElement("button");
        isDoneButton.classList.add("green");
        isDoneButton.innerText = "Selesai dibaca"; 
        isDoneButton.addEventListener("click" , function(){
            moveBooks(id, true);
        });

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("red");
        deleteButton.innerText = "Hapus buku";
        deleteButton.addEventListener("click" , function(){
            var result = confirm("Are you sure you want to delete this book?");
            if(result){
                removeBook(id);
            }
            
        });
        
        const actionDiv = document.createElement("div");
        actionDiv.classList.add("action");
        actionDiv.append(isDoneButton, deleteButton);

        articleBook.append(actionDiv);

    }

    return articleBook;
  }

  function addTodo() {
    const titleBook = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value;
    const yearBook = document.getElementById('inputBookYear').value;
    const isCompleteBook = document.getElementById('inputBookIsComplete').checked;
  
    const generatedID = generateId();
    const bookObject = generateTodoObject(generatedID, titleBook, authorBook, Number(yearBook), isCompleteBook);
    books.push(bookObject);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("book added successfully");
  }

  function moveBooks(bookId, isHasRead) {
    const bookTarget = findBook(bookId);
  
    if (bookTarget == null) return;
    
    if(isHasRead){
        bookTarget.isCompleted = true;
    }else{
        bookTarget.isCompleted = false;
    }
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("book moved successfully");
  }

  function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);
  
    if (bookTarget === -1) return;
  
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("The book has been successfully deleted!")
  }

  document.addEventListener('DOMContentLoaded', function () {

    const submitForm /* HTMLFormElement */ = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addTodo();
      document.getElementById("inputBook").reset();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
    

    // SEARCH BOOK
    const doSearchBook = document.getElementById("searchBook");
    doSearchBook.addEventListener('submit', function(event){
        event.preventDefault();
        
        const textSearchBook = document.getElementById("searchBookTitle").value;
        console.log(`search : ${textSearchBook}`);
        
        const result = searchBook(textSearchBook);
        console.log(    result);
        if(result != null) {
            const bookElement = makeItemBook(result);
            const resultSearchElement = document.getElementById("resultSearch");
            resultSearchElement.innerHTML = '';
            resultSearchElement.append(bookElement);
        }else{
            const resultSearchElement = document.getElementById("resultSearch");
            resultSearchElement.innerHTML = '';
            const bookNotFound = document.createElement("h3");
            bookNotFound.innerText = "Book not found";
            resultSearchElement.append(bookNotFound);
        }
    });
  });

  document.addEventListener(SAVED_EVENT, (event) => {
    event.preventDefault();
    
  });
  
  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedList = document.getElementById('incompleteBookshelfList');
    const listCompleted = document.getElementById('completeBookshelfList');
  
    // clearing list item
    uncompletedList.innerHTML = '';
    listCompleted.innerHTML = '';
  
    for (const bookItem of books) {
      const bookElement = makeItemBook(bookItem);
      if (bookItem.isCompleted) {
        listCompleted.append(bookElement);
      } else {
        uncompletedList.append(bookElement);
      }
    }
  });