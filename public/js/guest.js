document.addEventListener(
   "DOMContentLoaded",
   ()=>{

      let count = 1;

      const guestCount =
      document.getElementById(
         "guest-count"
      );

      const increaseBtn =
      document.getElementById(
         "increase-btn"
      );

      const decreaseBtn =
      document.getElementById(
         "decrease-btn"
      );

      // STOP if elements don't exist

      if(
         !guestCount ||
         !increaseBtn ||
         !decreaseBtn
      ){
         return;
      }

      increaseBtn.addEventListener(
         "click",
         ()=>{

            count++;

            guestCount.innerText =
            `${count} Guests`;

         }
      );

      decreaseBtn.addEventListener(
         "click",
         ()=>{

            if(count > 1){

               count--;

               guestCount.innerText =
               `${count} Guests`;

            }

         }
      );

   }
);