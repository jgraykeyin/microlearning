

$(document).ready( function() {
  //initialize the quiz options
  let answersLeft = [];
  $('.quiz-wrapper').find('li.option').each( function(i) {
    let $this = $(this);
    let answerValue = $this.data('target');
    let $target = $('.answers .target[data-accept="'+answerValue+'"]');
    let labelText = $this.html();
    $this.draggable( {
      revert: "invalid",
      containment: ".quiz-wrapper"
    });
   
    if ( $target.length > 0 ) {
    $target.droppable( {
        accept: 'li.option[data-target="'+answerValue+'"]',
        drop: function( event, ui ) {
          $this.draggable('destroy');
          $target.droppable('destroy');
          $this.html('&nbsp;');
          $target.html(labelText);
          answersLeft.splice( answersLeft.indexOf( answerValue ), 1 );
        }
    });
    answersLeft.push(answerValue);
    } else { }
   });
   $('.quiz-wrapper button[type="submit"]').click( function() {
	   if ( answersLeft.length > 0 ) {
		    $('.lightbox-bg').show();
      $('.status.deny').show();
      $('.lightbox-bg').click( function() {
		      $('.lightbox-bg').hide();
        $('.status.deny').hide();
        $('.lightbox-bg').unbind('click');
      });
	   } else {
		    $('.lightbox-bg').show();
      $('.status.confirm').show();
	   }
   });
});