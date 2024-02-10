$(document).ready(function () {
  const selectedAmenities = {};

  // Listen for changes in the input checkbox
  $('input[type="checkbox"]').change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      selectedAmenities[amenityId] = amenityName;
    } else {
      if ((amenityId in selectedAmenities)) {
        delete selectedAmenities[amenityId];
      }
    }
    const amenitiesText = Object.values(selectedAmenities).join(', ');
    $('div.amenities h4').text(amenitiesText);
  });

  // Listen for clicks on the button tag
  $('button').click(function () {
    // Make a request to get places data with selected amenities
    $.ajax({
      url: 'http://localhost:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: selectedAmenities }), // Send selected amenities in the body
      success: function (data) {
        // Clear existing places
        $('section.places').empty();

        // Loop through the result and create HTML elements for each place
        data.forEach(function (place) {
          const article = $('<article>').addClass('place'); // Unique class for each element

          article.append(
            $('<div>').addClass('title_box').append(
              $('<h2>').text(place.name),
              $('<div>').addClass('price_by_night').text('$' + place.price_by_night)
            ),
            $('<div>').addClass('information').append(
              $('<div>').addClass('max_guest').text(place.max_guest + ' Guest(s)'),
              $('<div>').addClass('number_rooms').text(place.number_rooms + ' Bedroom(s)'),
              $('<div>').addClass('number_bathrooms').text(place.number_bathrooms + ' Bathroom(s)')
            ),
            $('<div>').addClass('description').html(place.description)
          );

          // Append the created article to the places section
          $('section.places').append(article);
        });
      },
      error: function (xhr, status, error) {
        console.error('Error:', error);
      }
    });
  });

  // Loads Places by sending and empty post request to place_search

  // Check API-status
  $.get('http://localhost:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
  $.ajax({
    url: 'http://localhost:5001/api/v1/places_search/',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (data) {
      const placesSection = $('section.places');
      placesSection.empty(); // Clear existing content, if any

      data.forEach(function (place) {
        const article = $('<article>').addClass('place'); // Unique class for each element

        article.append(
          $('<div>').addClass('title_box').append(
            $('<h2>').text(place.name),
            $('<div>').addClass('price_by_night').text('$' + place.price_by_night)
          ),
          $('<div>').addClass('information').append(
            $('<div>').addClass('max_guest').text(place.max_guest + ' Guest(s)'),
            $('<div>').addClass('number_rooms').text(place.number_rooms + ' Bedroom(s)'),
            $('<div>').addClass('number_bathrooms').text(place.number_bathrooms + ' Bathroom(s)')
          ),
          $('<div>').addClass('description').text(place.description)
        );

        placesSection.append(article);
      });
    }
  });
});
