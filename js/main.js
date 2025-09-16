$(function (){
   "use strict";
   
   // Performance optimizations
   var $window = $(window);
   var $upperBar = $(".upper-bar");
   var $navbar = $(".navbar");
   
   // Debounced resize function for better performance
   function debounce(func, wait) {
       var timeout;
       return function executedFunction() {
           var later = function() {
               clearTimeout(timeout);
               func();
           };
           clearTimeout(timeout);
           timeout = setTimeout(later, wait);
       };
   }
   
   // Adjust Slider Height
   function adjustSliderHeight() {
       var windowHeight = $window.height(),
           upperHeight = $upperBar.innerHeight(),
           navHeight = $navbar.innerHeight();
       $(".slider, .carousel-item").height(windowHeight - (upperHeight + navHeight));
   }
   
   // Initial call
   adjustSliderHeight();
   
   // Debounced resize handler
   $window.on('resize', debounce(adjustSliderHeight, 250));
    
   // Featured Work Shuffle with better performance
   $(".featured-work ul li").on("click", function(){
      var $this = $(this);
      var dataClass = $this.data("class");
      var $shuffleImages = $(".shuffle-images .col-md");
      
      $this.addClass("active").siblings().removeClass("active");
      
      if (dataClass === "all"){
         $shuffleImages.css("opacity", 1);
      } else{
         $shuffleImages.css("opacity", 0.3);
         $(dataClass).parent().css("opacity", 1);
      }
   });
   
   // Lazy loading for images (if needed for high traffic)
   if ('IntersectionObserver' in window) {
       const imageObserver = new IntersectionObserver((entries, observer) => {
           entries.forEach(entry => {
               if (entry.isIntersecting) {
                   const img = entry.target;
                   img.src = img.dataset.src;
                   img.classList.remove('lazy');
                   imageObserver.unobserve(img);
               }
           });
       });
       
       document.querySelectorAll('img[data-src]').forEach(img => {
           imageObserver.observe(img);
       });
   }
   
   (function(){
      function scrollContainer(targetId, direction){
         const container = document.getElementById(targetId);
         if(!container) return;
         const scrollAmount = Math.round(container.clientWidth * 0.7);
         container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
      }

      document.querySelectorAll('.scroll-btn').forEach(btn => {
         btn.addEventListener('click', function(){
            const target = this.getAttribute('data-target');
            if(this.classList.contains('prev')) scrollContainer(target, -1);
            else scrollContainer(target, 1);
         });
      });

      // enable keyboard arrows when focus is inside product-row
      document.querySelectorAll('.product-row').forEach(row => {
         row.setAttribute('tabindex','0');
         row.setAttribute('role','region');
         row.setAttribute('aria-label','Product carousel. Use left and right arrows to navigate.');
         row.addEventListener('keydown', function(e){
            if(e.key === 'ArrowLeft') this.scrollBy({left: -200, behavior:'smooth'});
            if(e.key === 'ArrowRight') this.scrollBy({left: 200, behavior:'smooth'});
         });
      });
   })();
});