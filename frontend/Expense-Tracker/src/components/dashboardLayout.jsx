import React, {useContext} from 'react';
import { UserContext } from '../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
    const {user} = useContext(UserContext)
    console.log("DashboardLayout user:", user);
  return (
    <div className="">
        <Navbar activeMenu={activeMenu} />

        {user && (
            <div className="flex">
                <div className="hidden md:block">
                    <SideMenu activeMenu={activeMenu} />
                </div>
                <div className="grow mx-5">{children}</div>
            </div>
        )}
    </div>
  )
}

export default DashboardLayout