import '../../common/pages/about/about.js';
import './AboutJoin.scss';
$('.find-job-header').click(function(){
  $(this).parent().siblings().children('div.job-description').slideUp(800);
  $(this).next().slideToggle(800);
});
