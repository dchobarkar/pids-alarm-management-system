const Spinner = () => {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-6 h-6 border-2 border-(--border-default) border-t-(--brand-primary) rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;
