function Footer() {
  return (
   <footer id="footer" className="mt-20 bg-gray-900 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <div>
          <h2 className="text-3xl font-bold text-orange-500">
            Foodie
          </h2>

          <p className="mt-2 text-gray-400">
            Delicious food delivered to your doorstep.
          </p>
        </div>

        <div className="text-center md:text-right">
          <p className="text-gray-400">
            © 2026 Foodie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;