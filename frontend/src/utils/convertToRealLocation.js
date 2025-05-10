import axios from "axios";

export const getAddressFromCoordinates = async function (latitude, longitude) {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    const data = response.data;

    return {
      address: data.display_name
    };
  } catch (error) {
    return {
      street: "Unknown",
      city: "Unknown",
      state: "Unknown",
      country: "Unknown",
    };
  }
};
