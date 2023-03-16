import { NavLink } from "react-router-dom";
import { FaBars, FaHome, FaUser, FaCalendarCheck, FaHospitalUser, FaRupeeSign, FaClipboardList, FaClipboard } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { BiAnalyse, BiSearch } from "react-icons/bi";
import { BiCog } from "react-icons/bi";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
import { HiUserGroup } from 'react-icons/hi';
import { GiConcentrationOrb } from 'react-icons/gi';
import { GiImbricatedArrows } from 'react-icons/gi'
// import {TfiThemifyFaviconAlt} from 'react-icons/tfi'
import zecimg from "./zecdata.png";
const routes = [
  {
    path: "/",
    name: "Dashboard",
    icon: <FaHome />,
  },
  {
    className: 'pointer',
    path: "/Employees",
    name: "Employees",
    icon: <HiUserGroup />,
    exact: true,
    subRoutes: [
      {
        path: "/employee/profile",
        name: "Add Employee",
        icon: <FaUser />,
      },
      {
        path: "/employee/manageprofile",
        name: "Manage Employee",
        icon: <FaUser />,
      },
    ],
  },
  {
    path: "/employee/leavedetails",
    name: "Leaves",
    icon: <FaCalendarCheck />,
    subRoutes: [
      {
        path: "/employee/leave",
        name: "Add Leave",
        icon: <FaClipboardList />,
      },
      {
        path: "/employee/leavedetails",
        name: "Manage leaves",
        icon: <FaClipboard />,

      },
      {
        path: "/TotalPresent",
        name: "Total Present",
        icon: <FaClipboard />,
      },
    ],
  },
  // {
  //   path: "/salary",
  //   name: "Payroll",
  //   icon: <FaHospitalUser />,
  //   subRoutes: [
  //     {
  //       path: "/employee/salary",
  //       name: "Salary Receipt",
  //       icon: <FaRupeeSign />,
  //     },
  //   ],
  // },
  {
    path: "/holiydays",
    name: "Holidays",
    icon: <GiConcentrationOrb />,
    // icon :<TfiThemifyFaviconAlt/>
  },
  {
    path: "/year_leavedetails",
    name: "Year Leave",
    icon: <GiImbricatedArrows />,
    subRoutes: [
      {
        path: "/Year_leave",
        name: "Add Year_Leave",
        icon: <FaClipboardList />,
      },
      {
        path: "/year_leavedetails",
        name: "Manage Year_Leave",
        icon: <FaClipboard />,
      },

    ],
  },
];

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <div className="main-container">
        <motion.div
          animate={{
            width: isOpen ? "200px" : "45px",

            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar `}
        >
          <div className="bg-white d-flex justify-content-center align-items-center" style={{ height: '50px' }}>
            <img src={zecimg} />
          </div>
          <div className="top_section pointer">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo"
                >
                </motion.h1>
              )}
            </AnimatePresence>
            <div className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>
          <section className="routes">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    setIsOpen={setIsOpen}
                    key={index}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }
              return (
                <NavLink
                  to={route.path}
                  key={index}
                  className="link"
                >
                  <div className="icon" >{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>
        <main>{children}</main>
      </div>
    </>
  );
};

export default SideBar;