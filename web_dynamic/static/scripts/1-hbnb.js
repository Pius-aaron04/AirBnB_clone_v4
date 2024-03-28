$(document).ready(function () {
  const selectedAmenities = [];

  // listen for changes in d input checkbox
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
});
