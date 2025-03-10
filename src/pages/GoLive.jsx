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
    <div className="w-full h-screen bg-[#101828] flex items-center justify-center">
      <div ref={goLiveRef} className="w-[80%] h-[600px]"></div>
    </div>
  );
};

export default GoLive;
