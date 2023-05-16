import $ from 'jquery';

class MyNotes {
  constructor() {
    this.events();
  }
  events() {
    $('#my-notes').on('click', '.delete-note', this.deleteNote);
    $('#my-notes').on('click', '.edit-note', this.editNote.bind(this));
    $('#my-notes').on('click', '.update-note', this.updateNote.bind(this));
    $('.submit-note').on('click', this.createNote.bind(this));
  }

  // Methods will go here
  editNote(e) {
    var thisNote = $(e.target).parents('li');
    if (thisNote.data('state') == 'editable') {
      this.makeNoteReadOnly(thisNote);
    } else {
      this.makeNoteEditable(thisNote);
    }
  }

  makeNoteEditable(thisNote) {
    thisNote
      .find('.edit-note')
      .html('<i class="fa fa-times" aria-hidden="true"></i> Cancel');
    thisNote
      .find('.note-title-field, .note-body-field')
      .removeAttr('readonly')
      .addClass('note-active-field');
    thisNote.find('.update-note').addClass('update-note--visible');
    thisNote.data('state', 'editable');
  }

  makeNoteReadOnly(thisNote) {
    thisNote
      .find('.edit-note')
      .html('<i class="fa fa-pencil" aria-hidden="true"></i> Edit');
    thisNote
      .find('.note-title-field, .note-body-field')
      .attr('readonly', 'readonly')
      .removeClass('note-active-field');
    thisNote.find('.update-note').removeClass('update-note--visible');
    thisNote.data('state', 'cancel');
  }

  async deleteNote(event) {
    // var thisNote = $(event.target).parents('li');
    var thisNote = event.target.closest('li');
    try {
      console.log(event.target);
      const deleteResponse = await fetch(
        `${wcsData.root_url}/wp-json/wp/v2/note/${thisNote.dataset.noteId}`,
        {
          method: 'DELETE',
          headers: {
            'X-WP-Nonce': wcsData.nonce,
          },
        }
      );
      thisNote.remove();
      return deleteResponse.json();
    } catch (err) {
      console.log(err);
    }
  }

  async updateNote(e) {
    const thisNote = e.target.parentElement;
    // console.log(thisNote)

    var ourUpdatedPost = {
      title: thisNote.querySelector('.note-title-field').value,
      content: thisNote.querySelector('.note-body-field').value,
    };
    try {
      const response = await fetch(
        `${wcsData.root_url}/wp-json/wp/v2/note/${thisNote.getAttribute(
          'data-id'
        )}`,
        {
          headers: {
            'X-WP-Nonce': wcsData.nonce,
            'Content-Type': 'application/json;charset=utf-8',
          },
          credentials: 'same-origin',
          method: 'POST',
          body: JSON.stringify(ourUpdatedPost),
        }
      );
      this.makeNoteReadOnly(thisNote);
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }
  }

  async createNote() {
    var ourNewPost = {
      title: document.querySelector('.new-note-title').value,
      content: document.querySelector('.new-note-body').value,
      status: 'publish',
    };
    try {
      const response = await fetch(`${wcsData.root_url}/wp-json/wp/v2/note/`, {
        headers: {
          'X-WP-Nonce': wcsData.nonce,
          'Content-Type': 'application/json;charset=utf-8',
        },
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify(ourNewPost),
      });
      const results = await response.json();
      document.querySelector('.new-note-title').value = '';
      document.querySelector('.new-note-body').value = '';
      document.querySelector('#my-notes').insertAdjacentHTML(
        'afterbegin',
        `
        <li data-id="${results.id}">
        <input readonly class="note-title-field" value="${results.title.raw}">
        <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i>Edit</span>
        <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i>Delete</span>
        <textarea readonly class="note-body-field">${results.content.raw}</textarea>
        <span class="update-note btn btn--blue btn-small"><i class="fa fa-arrow-right" aria-hidden="true"></i>Save</span>
        
        </li>
        `
      );
      let finalHeight; // browser needs a specific height to transition to, you can't transition to 'auto' height
      let newlyCreated = document.querySelector('#my-notes li');

      // give the browser 30 milliseconds to have the invisible element added to the DOM before moving on
      setTimeout(function () {
        finalHeight = `${newlyCreated.offsetHeight}px`;
        newlyCreated.style.height = '0px';
      }, 30);

      // give the browser another 20 milliseconds to count the height of the invisible element before moving on
      setTimeout(function () {
        newlyCreated.classList.remove('fade-in-calc');
        newlyCreated.style.height = finalHeight;
      }, 50);

      // wait the duration of the CSS transition before removing the hardcoded calculated height from the element so that our design is responsive once again
      setTimeout(function () {
        newlyCreated.style.removeProperty('height');
      }, 450);
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }
  }
}

export default MyNotes;
