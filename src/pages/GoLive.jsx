import React, { useEffect, useRef } from "react";

const GoLive = () => {
  let goLiveRef = useRef(null);
  const roomName = `Skillify-${Date.now()}`;

  useEffect(() => {
    try {
      if (window.JitsiMeetExternalAPI) {
        const domain = "meet.jit.si";
        const options = {
          roomName: roomName,
          parentNode: goLiveRef?.current,
          width: "100%",
          height: "100%",
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);

        return () => {
          api.dispose();
        };
      }
    } catch (error) {
      console.log(error);
    }
  }, [roomName]);

  return (
    <div className="w-full h-screen bg-[#101828] flex flex-col items-center justify-center overflow-hidden">
      <div
        ref={goLiveRef}
        className="w-[90%] sm:w-[80%] lg:w-[70%] h-[80vh] sm:h-[600px] bg-black rounded-lg shadow-lg"
      ></div>
    </div>
  );
};

export default GoLive;
