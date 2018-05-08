$(function() {
  var fieldCount =1;
  $('.add-more-contacts').click(function(){
    var nameInput = '<input class="form-control" type="text" id="assistant-name-'+ fieldCount +'">',
        phoneInput= '<input class="form-control" type="text" id="assistant-phone-'+ fieldCount +'">';

    $( ".form-c-list" ).append( '<div class="row form-c-item"><div class="col-md-6 col-xs-12"><div class="form-group"><label>Assistant</label>' + nameInput +'</div></div><div class="col-md-6 col-xs-12"><div class="form-group"><label>Phone number</label>'+ phoneInput +'</div></div></div>');
    ++fieldCount;
  })

   $('.simple-select').selectpicker({
    });


   // ---------------------------------------

	$('.header-hamburger').click(function(){
		$('.side-nav').addClass('is-active');
		$('body,html').addClass('lock');
	})

	$('.nav-close').click(function(){
		$('.side-nav').removeClass('is-active');
		$('body,html').removeClass('lock');
	})


/*  $('body')
    .on('click', '.chat-hamburger', function(){
    $('.chat-left').addClass('active');
    $(this).hide();
    $(this).next().show();
  })
    .on('click', '.chat-dialog-close', function(){
      $('.chat-left').removeClass('active');
      $(this).hide();
      $(this).prev().show();
    });*/




	$('.pt-descr .show-more').click(function(){
		$(this).hide();
		$(this).prev().show();
	});


  $('.header-button').click(function(){
    if ($(this).hasClass('opened')){
      $(this).removeClass('opened');
      $('#'+$(this).data('form')).slideUp();
    } else{
      $('.header-form').slideUp();
      $('#'+$(this).data('form')).slideDown();
      $('.header-button').removeClass('opened');
      $(this).addClass('opened');
    }
  });

  $('.header-form .cancel-button').click(function(){
    var container = $(this).closest('.header-form');
    container.slideUp();
    $("[data-form='" + container.prop('id') +"']").removeClass('opened');

  })

  $('.reset-button').click(function(){
    $('.password-hidden').slideDown();
  })



  $('.open-quote').click(function(){
    var container = $(this).closest('.quote-item-wrap');
    $(this).toggleClass('opened');
    container.find('.quote-info').slideToggle();

  })

  $('.quote-info .cancel-button').click(function(){
    $(this).closest('.quote-item-wrap').find('.open-quote').removeClass('opened');
    $(this).closest('.quote-info').slideUp();
  })

  $('.popup-close').click(function(){
    $(this).closest('.popup-chat').addClass('closed');
  })


  $('.chat-button').click(function(){
    $('.popup-chat').removeClass('closed');
  })

  $('.hs_button').click(function(){
    $(this).closest('.has_submenu').find('.submenu-wrap').slideToggle();
    $(this).toggleClass('is-opened');
  })

  $('.full-chat .chat-body').height( $( window ).height() - ( $('.main-header').outerHeight() + $('h1').outerHeight(true) + $('.cr-top').outerHeight() + $('.cr-bottom').outerHeight() + $('.file-list').outerHeight() +100) );

  $('.slideto').on('click', function (e) {
    e.preventDefault();

    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top
    }, 500, 'linear');
  });


  $(".chat-body").scrollTop($(this).height());

// label для input[type="file"]

	var inputs = document.querySelectorAll( '.file-input' );
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e )
		{
			var fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();

			if( fileName )
				label.querySelector( 'span' ).innerHTML = fileName;
			else
				label.innerHTML = labelVal;
		});
	});
})
