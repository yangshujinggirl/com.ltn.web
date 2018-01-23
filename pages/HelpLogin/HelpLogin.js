import '../../common/pages/help/help.js';

$('.slide').click(function(){
  $(this).siblings().children('div.content').slideUp(800);
  $(this).children('div.content').slideToggle(800);
});
