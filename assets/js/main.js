 //-----Defining letiables-----------------------

 //let startPointListener, endPointListener, startlat, startlong, endlat, endlong, distance, duration, routeGraphic, routeGraphicLayer, startPointGraphic, endPointGraphic
 //let directionPath = []

 let sketch;
 let viewDiv = document.getElementById("mapViewDiv");

 if (window.innerWidth < 900 || window.innerHeight < 500) {
     // alert()
     let errorMsg_Device = document.getElementById('msgOverlay').cloneNode(true);
     errorMsg_Device.style.display = "flex";
     document.body.appendChild(errorMsg_Device);
 }

 function menuCheck() {
     let menuCheck = document.getElementById("menuCheck");

     if (menuCheck.checked == true) {
         viewDiv.style.width = "50%";
     } else {
         viewDiv.style.width = "100%";
     }

 }

 function fixLayerListUI() {
     // Fix the layer list appearnce Issue
     let layerListUIFixer = setInterval(function() {
         document.getElementById("layerList").style.display = "flex";
         document.getElementById("layerListContainer").appendChild(document.getElementById("layerList"));
         document.getElementById("layerList").children[0].style.display = "contents";
         let menuOptions = document.getElementsByClassName("esri-layer-list__item-actions-list");
         //console.log(menuOptions)
         for (i = 0; i < menuOptions.length; i++) {
             menuOptions[i].style.display = "contents";
             //console.log(menuOptions[i])
         };
         clearInterval(layerListUIFixer);
     }, 100);
 }

 function expandMenu(id) {
     if (id == 0) {
         //layerList.container= document.getElementById("layerList");
         document.getElementById("layerList").style.display = "flex";
         document.getElementById("layerListContainer").appendChild(document.getElementById("layerList"));
         document.getElementById("layerList").children[0].style.display = "contents";
         let menuOptions = document.getElementsByClassName("esri-layer-list__item-actions-list");
         //console.log(menuOptions)
         for (i = 0; i < menuOptions.length; i++) {
             menuOptions[i].style.display = "contents";
             //console.log(menuOptions[i])
         };
         let layerListOptions = document.getElementsByClassName("esri-layer-list__item-actions-menu-item");
         for (i = 0; i < layerListOptions.length; i++) {
             layerListOptions[i].addEventListener("click", function() {
                 //document.getElementsByClassName("panel0")[0].style.maxHeight = document.getElementsByClassName("panel0")[0].scrollHeight + "px"

                 document.getElementById("panel0").style.maxHeight = "1000px";
             });
         }
     }


     let accordion = document.getElementsByClassName("panel" + id);
     if (accordion[0].style.maxHeight) {
         accordion[0].style.maxHeight = null;
     } else {
         accordion[0].style.maxHeight = accordion[0].scrollHeight + "px";

         let acc = document.getElementsByClassName("accordion");
         let i;
         for (i = 0; i < acc.length; i++) {
             let panel = document.getElementsByClassName("panel" + i);
             if (i != id) {
                 panel[0].style.maxHeight = null;
             }
         }


     }
 }

 function expandMenu3D(id) {
     let accordion3D = document.getElementsByClassName("panel3D" + id);
     if (accordion3D[0].style.maxHeight) {
         accordion3D[0].style.maxHeight = null;
     } else {
         accordion3D[0].style.maxHeight = accordion3D[0].scrollHeight + "px";

         let acc = document.getElementsByClassName("accordion3D");
         let i;
         for (i = 0; i < acc.length; i++) {
             let panel = document.getElementsByClassName("panel3D" + i);
             if (i != id) {
                 panel[0].style.maxHeight = null;
             }
         }


     }
 }


 //------------- Maximize routing div height ------------------------------
 function maximizeRoutingDiv() {
     let accordion = document.getElementsByClassName("panel5");
     accordion[0].style.maxHeight = accordion[0].scrollHeight + "px";
 }