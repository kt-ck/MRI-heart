function List({ listdata }) {
  return (
    <div className="w-full overflow-auto text-slate-600 dark:text-slate-200">
      {Object.keys(listdata).map((item) => (
        <div key={item} className="w-full flex">
          <div className="w-1/3 border-2 border-slate-300 dark:border-slate-600 text-center">
            {item}
          </div>
          <div className="w-2/3 border-2 border-slate-300 dark:border-slate-600">
            {Array.isArray(listdata[item])
              ? listdata[item].join(",")
              : listdata[item]}
          </div>
        </div>
      ))}
    </div>
  );
}

export default List;
