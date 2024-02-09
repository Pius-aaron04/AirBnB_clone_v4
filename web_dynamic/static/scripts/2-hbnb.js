$(document).ready(function () {
  const selectedAmenities = [];

  // listen for changes in the input checkbox
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
  $.get('http://localhost:5001/api/v1/status/', function (data) {
    console.log(data);
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      if ($('#api_status').hasClass('available')) {
        $('#api_status').removeClass('available');
      }
    }
  });
});
