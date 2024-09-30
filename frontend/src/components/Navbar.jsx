import { FaChartBar, FaCog, FaHome, FaThList } from 'react-icons/fa';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
<nav className="fixed bottom-0 w-full bg-[var(--primary-color)] dark:bg-[var(--primary-color)] text-[var(--nav-text-color)] dark:text-[var(--nav-text-color)] flex justify-around py-2">
<NavButton icon={<FaHome />} label="Home" to="/" />
      <NavButton icon={<FaThList />} label="Transactions" to="/transactions" />
      <NavButton icon={<FaChartBar />} label="Analysis" to="/analysis" />
      <NavButton icon={<FaCog />} label="Settings" to="/settings" />
    </nav>
  );
};

const NavButton = ({ icon, label, to }) => {
  return (
    <Link to={to} className="p-2 flex flex-col items-center">
      {icon}
      <span className="mt-1 text-sm">{label}</span>
    </Link>
  );
};

NavButton.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default Navbar;