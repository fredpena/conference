import { getUsefulContents, getUsefulLink } from '/js/util-url.js';

var fetchUrl = getUsefulContents("lang", "../json/workshops");

fetch(fetchUrl)
    .then(function (response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }

        return response.json();
    })
    .then(function (workshopJson) {

      var workshopList = [];
      for(let y in workshopJson){
        workshopList.push(workshopJson[y]);
      }

      workshopList.sort(function(a, b){return a.id-b.id});

      let workshops = document.getElementById('workshopsList');

      workshopList.forEach((workshop) => {
            workshops.innerHTML += createWorkshopCard(workshop);
          });


});

$(document).on('click', '#workshopsList li.meeta-event-accordion-item > .meeta-event-accordion-toggle', function(){
  if ($(this).hasClass("active")) {
    $(this).removeClass("active");
    $(this).siblings(".meeta-event-accordion-body").slideUp(200);
} else {           
    $(".meeta-event-accordion-item > .meeta-event-accordion-toggle").removeClass("active");
    $(this).addClass("active");
    $(".meeta-event-accordion-body").slideUp(200);
    $(this).siblings(".meeta-event-accordion-body").slideDown(200);
}
});

function createWorkshopCard(workshop) {

  let title = workshop.title;
  let description = workshop.description;
  let speakers = workshop.speakers; 
  let time = workshop.time;

  var sessionHtml = "<li class=\"meeta-event-accordion-item\">"+
     "<h3 class=\"meeta-event-accordion-toggle\">"+
     "<div class=\"image\">";

     (async () => {
     for (let i in speakers) {
         
          sessionHtml += await getSpeakerById(getUsefulContents("lang", "../json/speakers/"+speakers[i]));                
    }
  })();

    
     sessionHtml += "</div><div class=\"event-title\"><span class=\"time\">"+time+"</span>"+
     "<span class=\"title\">"+ title +"</span>"+
     "</div>"+
     " </h3>"+
     "<div class=\"meeta-event-accordion-body\">"+
     "<p>"+description+"</p>"+
      "</div>"+
      "</li>";


     

        return sessionHtml;
}

function getSpeakerById(fetchUrlSpeaker){
 return fetch(fetchUrlSpeaker)
      .then(function (response) {
          if (!response.ok) {
              throw Error(response.statusText);
          }

          return response.json();
      }).then(function(speaker){
             
        var speakerUrlDetail =  getUsefulLink("lang", "speaker-details.html?id=" + speaker.id);
          
        return "<a href=\"" + speakerUrlDetail + "\"><img src=\"" + speaker.photoUrl +"\" alt=\""+speaker.name+"\"></a>";    
    });
      
}
