import '../../common/pages/help/help.js';

$('.glossary-contain').children().click(function(){
  $('.glossary-contain').children().removeClass('selected');
  $(this).addClass('selected');
  var name = $(this).attr('name');
  $('.glossary-text').children().css('display','none');
  $('.glossary-text').children('p.'+name).toggle();
});
