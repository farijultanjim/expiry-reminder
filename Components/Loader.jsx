import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <div className="grid place-items-center animate-spin">

      {/* <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-800"></div> */}

      <div className="">
        <Image src="/loading.png" alt="loader" width={22} height={22} />
      </div>
    </div>
  );
};

export default Loader;
