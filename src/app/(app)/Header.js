const Header = ({ title, subtitle }) => {
  return (
    <header className="mb-2">
      <div className="max-w-8xl mx-auto py-6">
        <h2 className="font-semibold text-4xl text-gray-800 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-600 text-base mt-2 ">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
};

export default Header;
