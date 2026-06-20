const wrapper =
document.querySelector(
   ".guest-dropdown-wrapper"
);

const dropdown =
document.querySelector(
   ".guest-dropdown"
);

wrapper.addEventListener(
   "click",
   ()=>{

      dropdown.classList.toggle(
         "active"
      );

   }
);

let adults = 1;
let children = 0;

const updateSummary = ()=>{

   const total =
   adults + children;

   document.getElementById(
      "guest-summary"
   ).innerText =
   `${total} Guest${total>1?"s":""}`;

};

document
.querySelectorAll(".guest-plus")
.forEach(btn=>{

   btn.addEventListener(
      "click",
      ()=>{

         const type =
         btn.dataset.type;

         if(type==="adults"){

            adults++;

            document.getElementById(
               "adults-count"
            ).innerText = adults;

         }

         else{

            children++;

            document.getElementById(
               "children-count"
            ).innerText = children;

         }

         updateSummary();

      }
   );

});

document
.querySelectorAll(".guest-minus")
.forEach(btn=>{

   btn.addEventListener(
      "click",
      ()=>{

         const type =
         btn.dataset.type;

         if(
            type==="adults"
            &&
            adults>1
         ){

            adults--;

            document.getElementById(
               "adults-count"
            ).innerText = adults;

         }

         else if(
            type==="children"
            &&
            children>0
         ){

            children--;

            document.getElementById(
               "children-count"
            ).innerText = children;

         }

         updateSummary();

      }
   );

});