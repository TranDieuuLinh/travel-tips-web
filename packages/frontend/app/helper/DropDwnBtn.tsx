"use client";
import React, { useEffect, useState } from "react";

const DropDwnBtn = () => {
  const [dropDown, setDropDown] = useState(false);
  const [inBasketData, setInBasketData] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("inBasketCountry", JSON.stringify(inBasketData));
  }, [inBasketData]);

  const [countriesDrpDwnList, setcountriesDrpDwnList] = useState([
    { name: "china", id: 1 },
    { name: "Pak", id: 2 },
  ]);

  const hadnleDrpDownItems = (country: string) => {
    setInBasketData((prev) => [...prev, country]);

    setcountriesDrpDwnList(
      countriesDrpDwnList.filter((each) => country !== each.name)
    );
  };

  return (
    <>
      <div>
        <div
          className=" border px-3 rounded flex justify-evenly"
          onClick={() => setDropDown(!dropDown)}
        >
          {countriesDrpDwnList.length > 0 && (
            <div>
              <p className="items-start pe-10 font-extralight">
                choose country...{" "}
              </p>
              <span className="items-end">▼</span>
            </div>
          )}
          {countriesDrpDwnList.length <= 0 && (
            <p className="items-start pe-10 font-extralight">
              No more country to choose 
            </p>
          )}
        </div>

        {dropDown &&
          countriesDrpDwnList.map((p) => (
            <p
              onClick={() => hadnleDrpDownItems(p.name)}
              key={p.id}
              className="w-full bg-gray-100 px-3 font-sans py-1 text-[16px] hover:bg-red-100 cursor-pointer"
            >
              {p.name}
            </p>
          ))}
      </div>
    </>
  );
};

export default DropDwnBtn;
