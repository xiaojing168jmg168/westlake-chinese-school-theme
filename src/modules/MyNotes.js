import $ from 'jquery';

class MyNotes {
  constructor() {
    this.events();
  }
  events() {
    $('.delete-note').on('click', this.deleteNote);
    $('.edit-note').on('click', this.editNote.bind(this));
    $('.update-note').on('click', this.updateNote.bind(this));
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
    //console.log(event.target);
    var thisNote = $(event.target).parents('li');
    try {
      console.log(event.target);
      const deleteResponse = await fetch(
        `${wcsData.root_url}/wp-json/wp/v2/note/` + thisNote.data('id'),
        {
          method: 'DELETE',
          headers: {
            'X-WP-Nonce': wcsData.nonce,
          },
        }
      );
      thisNote.slideUp();
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
}

export default MyNotes;
