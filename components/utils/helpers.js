export const getPlaceString = (places) => {
    // Check if the `places` argument is truthy and if the first element of the array exists
    if (!places || !places[0]) return '';
  
    // Destructure the properties `name`, `landskap`, and `fylke` from the first element of the `places` array
    const { name, landskap, fylke } = places[0];
  
    // Initialize a variable `placeString` with the value of `name`
    let placeString = name;
  
    // Check if either `landskap` or `fylke` is truthy
    if (landskap || fylke) {
      // If so, add a comma followed by the value of either `landskap` or `fylke` to `placeString`
      placeString += ', ' + (landskap || fylke);
    }
  
    // Return the final value of `placeString`
    return placeString;
  };