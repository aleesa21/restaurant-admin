import React from "react";

const categories = [
  {
    name: "COFFEE",
    items: [
      {
        id: "i1",
        name: "Espresso / Macchiato",
        price: 200,
        image: "/img/espresso.png",
      },
      { id: "i2", name: "Piccolo", price: 250, image: "/img/piccolo.png" },
      {
        id: "i3",
        name: "Cappuccino",
        price: 280,
        image: "/img/cappuccino.png",
      },
    ],
  },
  {
    name: "STARTERS",
    items: [
      {
        id: "i4",
        name: "Garlic Bread",
        price: 180,
        image: "/img/garlic-bread.png",
      },
      { id: "i5", name: "Chicken Wings", price: 350, image: "/img/wings.png" },
    ],
  },
  {
    name: "MAIN COURSE",
    items: [
      {
        id: "i6",
        name: "Margherita Pizza",
        price: 450,
        image: "/img/margherita.png",
      },
      {
        id: "i7",
        name: "Grilled Salmon",
        price: 650,
        image: "/img/salmon.png",
      },
    ],
  },
  {
    name: "DESSERTS",
    items: [
      { id: "i8", name: "Tiramisu", price: 300, image: "/img/tiramisu.png" },
    ],
  },
];
function CataegoryTable() {
  return (
    <>
      {categories.map((c) => {
        return (
          <div className="w-full  bg-white rounded-2xl p-6  shadow-sm border border-gray-100">
            <div className="top-div flex justify-between">
              <div className="">{c.name}</div>
              <div className="">add new item</div>
            </div>
            <table className="w-full table-fixed">
              <thead>
            
                    <tr className="text-start">
                      <th className="text-start">img</th>
                      <th className="text-start">name</th>
                      <th className="text-start">price</th>
                      <th className="text-end">actions</th>
                    </tr>
                
              </thead>
              <tbody>
                {c.items.map((item) => {
                  return (
                    <tr className="text-start">
                      <td className="text-start">img</td>
                      <td className="text-start">{item.name}</td>
                      <td className="text-start">{item.price}</td>
                      <td className="text-end">btn btn</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}

export default CataegoryTable;
