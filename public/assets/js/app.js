// ON CLICK METHOD TO START SCRAPING
$('.scrape').on('click', function() {
  $.ajax({
    method: 'GET',
    url: '/scrape'
  }).done(function(data) {
    alert('Scraped Complete');
    window.location = '/articles';
  });
});

// ON CLICK METHOD TO SAVE ARTICLE (CHANGE SAVED-BOLEEAN TO TRUE)
$('.save').on('click', function() {
  var thisId = $(this).attr('data-id');
  $.ajax({
    method: 'POST',
    url: '/articles/save/' + thisId
  }).done(function(data) {
    alert('Article saved');
    window.location.reload(true);
  });
});

//ON CLICK METHOD TO DROP THE COLLECTION
$('.clear').on('click', function() {
  $.ajax({
    method: 'GET',
    url: '/clear'
  }).done(function(data) {});
  window.location = '/';
});

//ON CLICK METHOD TO POST A NEW NOTE
$('.note').on('submit', function(event) {
  var thisId = $('#noteid').val();
  var newNote = {
    title: $('#NoteTitle')
      .val()
      .trim(),
    body: $('#NoteBody')
      .val()
      .trim()
  };

  $.ajax({
    method: 'POST',
    url: '/articles/' + thisId,
    data: newNote
  }).then(function(data) {
    console.log(data);
  });
});

//ON CLICK METHOD TO DISPLAY THE NOTE CONTENT
$('.notetrigger').on('click', function() {
  var thisId = $(this).attr('data-id');
  $.ajax({
    method: 'GET',
    url: '/articles/' + thisId
  }).then(function(data) {
    $('#NoteTitle').text(data.note.title);
    $('#NoteBody').text(data.note.body);
  });
});

//ON CLICK METHOD TO DELETE A SINGLE NOTE (CHANGE SAVED-BOLEEAN TO FALSE)
$('.delete').on('click', function() {
  var thisId = $(this).attr('data-id');
  $.ajax({
    method: 'POST',
    url: '/articles/delete/' + thisId
  }).done(function(data) {});
  window.location.reload(true);
});
