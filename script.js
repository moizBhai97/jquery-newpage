var cards = [];
var filters = [];
var isFormHidden = true;

$(document).ready(function() {

    $.get("data.json", function(data, status) {

        if (status === "success") {
            cards = [...data];
            displayCards();
        }
      
    });

    const form = $(".form");

    const job = $(".job-description");

    $("*").on("click", function(event) {

        if (!isFormHidden && !form.is(event.target) && form.has(event.target).length === 0) {
            console.log("clicked form");
            isFormHidden = true;
            $(".form-container").prop("hidden", true);
            $("body").removeClass("noscroll");
        }

        if (!$(".job-container").prop("hidden") && !job.is(event.target) && job.has(event.target).length === 0) {
            console.log("clicked job");
            $(".job-container").prop("hidden", true);
            $("body").removeClass("noscroll");
        } 

        event.stopPropagation();

    });


    addButton();

    addLanguages();

    addTools();

    submitPressed();

    clearButton();

});

function clearButton() {

  $("#clear span").click(function(event) {

    event.stopPropagation();

    console.log("clear pressed");

    filters = [];

    displayFilters();

    displayCards();

  });

  $("#clear").click(function(event) {

    event.stopPropagation();

    console.log("clear pressed");

    filters = [];

    displayFilters();

    displayCards();

  });
}

function displayCards() {

  var lastAddedCard = null;

  $(".container:last-child").empty();

  cards.forEach(element => {

    if(filters.length > 0) {
      var isCardValid = true;

      filters.forEach(filter => {
        if(!element.languages.includes(filter) && !element.tools.includes(filter) && element.role !== filter && element.level !== filter) {
          isCardValid = false;
        }
      });

      if(!isCardValid) {
        return;
      }
    }

    var card = `
      <div class="box" id= ${element.id}>
        <div class="remove_box" id="remove_box">
          <img src="./images/icon-remove.svg" alt="icon-remove" class="remove_img_box">
        </div>
        <div class="box_img">
          <img src="${element.logo}" alt="${element.company}">
        </div>
        <div class="box_content">
          <div class="box_content__header">
            <h2>${element.company}</h2>
            ${element.new ? '<span class="box_content__new">New!</span>' : ''}
            ${element.featured ? '<span class="box_content__featured">Featured</span>' : ''}
          </div>
          <div class="box_content__title">
            <span>${element.position}</span>
          </div>
          <div class="box_content__info">
            <p>${element.postedAt} • ${element.contract} • ${element.location}</p>
          </div>
        </div>
        <div class="tags">
          <div class="box_content__tags">
            <span>${element.role}</span>
            <span>${element.level}</span>
            ${element.languages.map(language => `<span>${language}</span>`).join('')}
            ${element.tools.map(tool => `<span>${tool}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    $(".container:last-child").append(card);

    lastAddedCard = $(".container:last-child .box:last-child");

    if(!element.featured)
    {
      lastAddedCard.css("border-left", "5px solid white");
    }

    $(".container:last-child .box:last-child .remove_box").click(function(event) {

        event.stopPropagation();
        
        cards.splice(cards.findIndex(card => card.id === element.id), 1);

        displayCards();
    });

    $(".container:last-child .box:last-child .box_content__tags span").click(function(event) {
        
        event.stopPropagation();

        if(filters.includes($(this).text().trim())) {
          return;
        }
    
        filters.push($(this).text().trim());
    
        displayCards();

        displayFilters();
    });

    $(".container:last-child .box:last-child .box_content__title span").click(function(event) {
          
        event.stopPropagation();
    
        $(".job-container").prop("hidden", false);

        $("body").addClass("noscroll");

        $(".job-container .job-description__header .job-description__logo img").prop("src", element.logo);
        $(".job-container .job-description__header .job-description__info .header h2").text(element.position);
        $(".job-container .job-description__header .job-description__info .header .box_content__new").prop("hidden", !element.new);
        $(".job-container .job-description__header .job-description__info .header .box_content__featured").prop("hidden", !element.featured);
        $(".job-container .job-description__header .job-description__info p").text("At " + element.company);
        $(".job-container .job-description__header .job-description__info .job-description__tags").empty();
        $(".job-container .job-description__header .job-description__info .job-description__tags").append(`<span>${element.role}</span>`);
        $(".job-container .job-description__header .job-description__info .job-description__tags").append(`<span>${element.level}</span>`);
        $(".job-container .job-description__body #1 p").text(element.location);
        $(".job-container .job-description__body #2 p").text(element.postedAt);
        $(".job-container .job-description__body #3 p").text(element.contract);
        $(".job-container .job-description__body .job-description__description p").text("We are in need of a " + element.position + " at " + element.company + ", we are welcoming only " +  element.level + " level employees.");

        $(".job-container .job-description__body .job-description__requirements ul").empty();

        var requirement = null;

        if(element.level === "Senior")
          requirement = "5+ years of experience in " + element.role + " development.";
        else if(element.level === "Midweight")
          requirement = "3+ years of experience in " + element.role + " development.";
        else if(element.level === "Junior")
          requirement = "1+ years of experience in " + element.role + " development.";
        else
          requirement = "Some experience in " + element.role + " development."; 

        $(".job-container .job-description__body .job-description__requirements ul").append(`<li>${requirement}</li>`);

        if(element.languages.length > 0)
        {

          requirement = null;

          requirement = "Strong proficiency in ";

          element.languages.forEach(language => {
            if(element.languages.indexOf(language) === element.languages.length - 1)
              requirement += language + ".";
            else
              requirement += language + ", ";
          });

          $(".job-container .job-description__body .job-description__requirements ul").append(`<li>${requirement}</li>`);
        }

        if(element.tools.length > 0) {

          requirement = null;

          requirement = "Experience with ";

          element.tools.forEach(tool => {
            if(element.tools.indexOf(tool) === element.tools.length - 1)
              requirement += tool + ".";
            else
              requirement += tool + ", ";
          });

          $(".job-container .job-description__body .job-description__requirements ul").append(`<li>${requirement}</li>`);
        }

    });
  });
}

function displayFilters() {

  $("#filter .tags .box_content__tags").empty();

  if(filters.length === 0) {

    $("#filter").prop("hidden", true);

    return;
  }

  $("#filter").prop("hidden", false);

  console.log(filters);

  filters.forEach(filter => {
    var filterElement = `
                        <span>
                          ${filter}
                          <div class="remove" id="remove">
                            <img src="./images/icon-remove.svg" alt="icon-remove" class="remove_img">
                          </div>
                        </span>
                        `;

    $("#filter .tags .box_content__tags").append(filterElement);

    $("#filter .tags .box_content__tags .remove").click(function(event) {

      event.stopPropagation();
      var removedFilter = $(this).parent().text().trim();
      console.log(removedFilter);
      filters = filters.filter(filter => filter !== removedFilter);

      displayFilters();
      displayCards();
    });

  });

}

function addButton() {

  const button = $(".add");

  button.on("click", function(event) {
    $("body").addClass("noscroll");

    $(".form-container").prop("hidden", false);

    isFormHidden = false;

    event.stopPropagation();

    //reset form

    $(".form")[0].reset();

    $("#selected-languages").prop("hidden", true);

    $("#selected-tools").prop("hidden", true);
  });
}

function submitPressed() {

  const button = $(".submit");

  var form = $(".form");

  button.on("click", function(event) {

    event.preventDefault();

    if(form[0] && form[0].checkValidity()) {

      console.log("submit pressed");

      var company = $("#company").val().trim();
      var position = $("#position").val().trim();
      var role = $("#role").val().trim();
      var level = $("#level").val().trim();
      var contract = $("#contract").val().trim();
      var location = $("#location").val().trim();
      var languages = $("#selected-languages span").map(function() {
        return $(this).text().trim();
      }).get();
      var tools = $("#selected-tools span").map(function() {
        return $(this).text().trim();
      }).get();
      var featured = $("#featured").prop("checked");

      var postedAt = "Just now";
      var newCard = true;

      var logoInput = $("#logo")[0]; // Get the input element
      var logo = null; // Initialize the logo variable

      if (logoInput && logoInput.files.length > 0) {
        var reader = new FileReader();
        reader.readAsDataURL(logoInput.files[0]); // Read the uploaded file as a data URL
        reader.onload = function() {
          logo = reader.result;

          var card = {
            "id": cards.length + 1,
            "company": company,
            "logo": logo,
            "new": newCard,
            "featured": featured,
            "position": position,
            "role": role,
            "level": level,
            "postedAt": postedAt,
            "contract": contract,
            "location": location,
            "languages": languages,
            "tools": tools
          };

          if(card.featured)
          //if featured add to start
            cards.unshift(card);

          else {
            // Find the index of the last featured card in the cards array
            var lastFeaturedCardIndex = -1;
            for (var i = cards.length - 1; i >= 0; i--) {
              if (cards[i].featured) {
                lastFeaturedCardIndex = i;
                break;
              }
            }

            // Insert the new card after the last featured card but before any non-featured cards
            if (lastFeaturedCardIndex !== -1) {
              cards.splice(lastFeaturedCardIndex + 1, 0, card);
            } else {
              // If there are no featured cards, add the new card at the beginning
              cards.unshift(card);
            }
          }

          displayCards(); // Call displayCards after card creation

          $(".form-container").prop("hidden", true);

          $("body").removeClass("noscroll");

          isFormHidden = true;

          form[0].reset();
        }
      } 
      else {
        // Handle the case where no logo was uploaded
        console.log("No logo uploaded");
      }
    }
    else {
      form[0].reportValidity();
    } 
  });
}

function addLanguages() {

  const languagesInput = $("#languages-input");
  const selectedLanguagesContainer = $("#selected-languages");

  var selectedLanguages = [];

  languagesInput.on("change keydown", function (event) {

    if(event.keyCode === 13 || event.type === "change") {

      event.preventDefault();

      if(selectedLanguagesContainer.prop("hidden") === true) {
        selectedLanguages = [];
      }

      const inputValue = languagesInput.prop("value").trim();

      if (inputValue === "") {
          return;
      }

      if (!isLanguageSelected(inputValue)) {

        $("#error1").prop("hidden", true);
        selectedLanguages.push(inputValue);
        displaySelectedLanguage();
      }
      else {
        languagesInput.prop("value", "");
        $("#error1").prop("hidden", false);
        setTimeout(() => {
          $("#error1").prop("hidden", true);
        }, 1000);
      }
    }

  });

  function isLanguageSelected(language) {

      for (let i = 0; i < selectedLanguages.length; i++) {
          if (selectedLanguages[i] == language) {
              return true;
          }
      }

      return false;
  }

  function displaySelectedLanguage() {


      if(selectedLanguages.length === 0) {
          $("#selected-languages #tags #box_content__tags").empty();
          selectedLanguagesContainer.prop("hidden", true);
          return;
      }

      selectedLanguagesContainer.prop("hidden", false);

      var tags = $("#selected-languages #tags #box_content__tags");

      tags.empty();

      for (let i = 0; i < selectedLanguages.length; i++) {
          var selectedLanguageElement = `
                                        <span>
                                          ${selectedLanguages[i]}
                                          <div class="remove" id="remove">
                                            <img src="./images/icon-remove.svg" alt="icon-remove" class="remove_img">
                                          </div>
                                        </span>
                                        `;

          tags.append(selectedLanguageElement);
      }

      languagesInput.prop("value", "");

      $("#selected-languages .tags .box_content__tags .remove").click(function(event) {
        event.stopPropagation();
        var removedLanguage = $(this).parent().text().trim();
        console.log(removedLanguage);
        selectedLanguages = selectedLanguages.filter(lang => lang !== removedLanguage);

        displaySelectedLanguage();
      });
  }
}

function addTools() {

  const toolsInput = $("#tools-input");
  const selectedToolsContainer = $("#selected-tools");

  var selectedTools = [];

  toolsInput.on("change keydown", function (event) {

    if(event.keyCode === 13 || event.type === "change") {

      event.preventDefault();

      if(selectedToolsContainer.prop("hidden") === true) {
        selectedTools = [];
      }

      const inputValue = toolsInput.prop("value").trim();

      if (inputValue === "") {
          return;
      }

      if (!isToolSelected(inputValue)) {

        $("#error2").prop("hidden", true);
        selectedTools.push(inputValue);
        displaySelectedTool();
      }
      else {
        $("#error2").prop("hidden", false);
        toolsInput.prop("value", "");
        setTimeout(() => {
          $("#error2").prop("hidden", true);
        }, 1000);
      }
    }
  });

  function isToolSelected(tool) {

      for (let i = 0; i < selectedTools.length; i++) {
          if (selectedTools[i] == tool) {
              return true;
          }
      }

      return false;
  }

  function displaySelectedTool() {


      if(selectedTools.length === 0) {
          $("#selected-tools #tags #box_content__tags").empty();
          selectedToolsContainer.prop("hidden", true);
          return;
      }

      selectedToolsContainer.prop("hidden", false);

      var tags = $("#selected-tools #tags #box_content__tags");

      tags.empty();

      for (let i = 0; i < selectedTools.length; i++) {
          var selectedToolElement = `
                                    <span>
                                      ${selectedTools[i]}
                                      <div class="remove" id="remove">
                                        <img src="./images/icon-remove.svg" alt="icon-remove" class="remove_img">
                                      </div>
                                    </span>
                                    `;

          tags.append(selectedToolElement);
      }

      toolsInput.prop("value", "");

      $("#selected-tools .tags .box_content__tags .remove").click(function(event) {

        event.stopPropagation();
        var removedTool = $(this).parent().text().trim();
        console.log(removedTool);
        selectedTools = selectedTools.filter(tool => tool !== removedTool);

        displaySelectedTool();
      });
  }
}