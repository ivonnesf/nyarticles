$(document).ready(function(){
  $('.sidenav').sidenav();
  $('#bodyinput').val('New Text');
  M.textareaAutoResize($('#bodyinput'));
});
// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    $("#articles").prepend(`
  <div class="card">
      <p  class="card-title">${data[i].title}</p>
    <div class="card-content">
      <p>${data[i].summary}</p>
    </div>
    <div class="card-action">
      <a href=' ${data[i].link}'>Read</a>
      <a href='#' id="saveit" >Save</a>
    <a href='#' data-id='${data[i]._id}' id="addnote">Add note</a>
</div>
</div>`);
  }
});



$(document).on("click", "#saveit", function() {
  $.ajax({
    method: "POST",
    // url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      saveit: true
      // Value taken from note textarea
    }
  })
})

// Whenever someone clicks a p tag
$(document).on("click", "#addnote", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

    $("#notes").append(`
    <div class="row">
    <form class="col s12">
    <h5> ${data.title}</h5>
      <div class="row">
        <div class="input-field col s12">
          <textarea  id='bodyinput' name='body' class="materialize-textarea"></textarea>
          <label for="bodyinput"></label>
        </div>
      </div>
      <button data-id='${data._id}' id='savenote'>Save Note</button>
    </form>
  </div>
  `)

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
