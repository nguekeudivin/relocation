const NotifionCationBadge = ({ count }: { count: number }) => {
  return (
    <>
      <div className="hidden lg:flex w-6 h-6 absolute top-4 right-4  rounded bg-red-400 text-white rounded-full inline-flex items-center justify-center text-xs">
        {count}
      </div>
      <div className="lg:hidden absolute w-3 h-3 top-1 right-1 bg-red-400 rounded-full">
        {count}
      </div>
    </>
  );
};

export default NotifionCationBadge;
