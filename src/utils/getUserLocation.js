export const getUserLocation = function () {
  return new Promise((res, rej) => {
    if (!navigator.geolocation) {
      rej("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const { latitude, longitude } = position.coords;
          res({ latitude, longitude });
        },
        function (error) {
            rej("Unable to retrieve location")
        }
      );
    }
  });
};
