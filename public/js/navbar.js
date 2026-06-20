document.addEventListener(
   "DOMContentLoaded",
   ()=>{

      const menuBtn =
      document.querySelector(".menu-btn");

      const dropdown =
      document.querySelector(
         ".dropdown-menu-custom"
      );

      if(menuBtn && dropdown){

         menuBtn.addEventListener(
            "click",
            ()=>{

               dropdown.classList.toggle(
                  "show-menu"
               );

            }
         );

      }

   }
);