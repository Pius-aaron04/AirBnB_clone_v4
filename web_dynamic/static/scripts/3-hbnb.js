/**
 * This script is responsible for fetching places data from the server
 * and rendering them in the UI.
 */

$(document).ready(function () {
    const selectedAmenities = [];
  
    // Listen for changes in the input checkbox
    $('input[type="checkbox"]').change(function () {
      const amenityId = $(this).data('name');
  
      if ($(this).is(':checked')) {
        selectedAmenities.push(amenityId);
      } else {
        const index = selectedAmenities.indexOf(amenityId);
        if (index !== -1) {
          selectedAmenities.splice(index, 1);
        }
      }
      const amenitiesText = selectedAmenities.join(', ');
      $('div.amenities h4').text(amenitiesText);
    });
  
    // Make a request to get places data
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({}), // Send an empty dictionary in the body
      success: function (data) {
        // Clear existing places
        $('section.places').empty();
  
        // Loop through the result and create HTML elements for each place
        data.forEach(function (place) {
          const article = $('<article>').append(
            $('<div>').append(
              $('<div>').append(
                $('<h2>').text(place.name),
                $('<div>').addClass('price_by_night').text('$' + place.price_by_night)
              ),
              $('<div>').addClass('information').append(
                $('<div>').addClass('max_guest').text(place.max_guest + ' Guest(s)'),
                $('<div>').addClass('number_rooms').text(place.number_rooms + ' Bedroom(s)'),
                $('<div>').addClass('number_bathrooms').text(place.number_bathrooms + ' Bathroom(s)')
              )
            ),
            $('<div>').addClass('description').text(place.description)
          );
  
          // Append the created article to the places section
          $('section.places').append(article);
        });
      },
      error: function (xhr, status, error) {
        console.error('Error:', error);
      }
    });
  
    // Check API status
    $.get('http://localhost:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  });
  