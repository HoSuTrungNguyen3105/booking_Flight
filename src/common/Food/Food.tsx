const meals = [
  { id: 1, name: "Cơm gà sốt tiêu", type: "Non-Veg", price: 12.5 },
  { id: 2, name: "Bánh mì chay", type: "Vegan", price: 8 },
  { id: 3, name: "Mì xào hải sản", type: "Seafood", price: 14 },
];

const Food = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">
        🍱 Danh sách món ăn trên chuyến bay
      </h2>
      <ul className="space-y-3">
        {meals.map((meal) => (
          <li
            key={meal.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="text-lg font-semibold text-gray-700">{meal.name}</p>
              <p className="text-sm text-gray-500">{meal.type}</p>
            </div>
            <span className="text-sm text-blue-600 font-medium">
              {meal.price.toFixed(2)} USD
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Food;
