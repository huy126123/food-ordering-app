const RestaurantList = ({ restaurants, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {restaurants.map((res) => (
        <div
          key={res.id}
          className="p-4 bg-white shadow rounded hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelect(res)}
        >
          <h2 className="text-lg font-semibold">{res.name}</h2>
          <p className="text-gray-500">{res.address}</p>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
