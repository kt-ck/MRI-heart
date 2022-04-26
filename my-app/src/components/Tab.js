function Tab({ list, activeIndex, setactiveIndex }) {
  return (
    <div className="w-full h-10 flex flex-row items-center bg-slate-200 dark:bg-slate-500 text-slate-900 dark:text-slate-50">
      {list.map((item, index) => (
        <div
          key={item.id}
          className={`p-2 cursor-default border-b-4  ${
            activeIndex === index && "border-b-purple-600"
          } `}
          onClick={(e) => setactiveIndex(index)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

export default Tab;
