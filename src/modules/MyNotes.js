import $ from 'jquery';

class MyNotes {
  constructor() {
    this.events();
  }
  events() {
    $('.delete-note').on('click', this.deleteNote);
  }

  //   deleteNote() {
  //     $.ajax({
  //       beforeSend: (xhr) => {
  //         xhr.setRequestHeader('X-WP-Nonce', wcsData.nonce);
  //       },
  //       url: wcsData.root_url + 'wp-json/wp/v2/note/98',
  //       type: 'DELETE',
  //       success: (response) => {
  //         console.log('congrats');
  //         console.log(response);
  //       },
  //       error: () => {
  //         console.log('sorry');
  //         console.log(response);
  //       },
  //     });
  //   }

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

      return deleteResponse.json();
    } catch (err) {
      console.log(err);
    }
  }
}

export default MyNotes;
