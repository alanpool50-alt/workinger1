/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Welcome from './pages/Welcome';
import Explore from './pages/Explore';
import JobDetails from './pages/JobDetails';
import Apply from './pages/Apply';
import Saved from './pages/Saved';
import PostJob from './pages/PostJob';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import AdminEntity from './pages/AdminEntity';
import ManageJobs from './pages/ManageJobs';
import Applicants from './pages/Applicants';
import Notifications from './pages/Notifications';
import Account from './pages/Account';
import NotificationSettings from './pages/NotificationSettings';
import Privacy from './pages/Privacy';


export const PAGES = {
    "Welcome": Welcome,
    "Explore": Explore,
    "JobDetails": JobDetails,
    "Apply": Apply,
    "Saved": Saved,
    "PostJob": PostJob,
    "Messages": Messages,
    "Chat": Chat,
    "Profile": Profile,
    "Settings": Settings,
    "Admin": Admin,
    "AdminEntity": AdminEntity,
    "ManageJobs": ManageJobs,
    "Applicants": Applicants,
    "Notifications": Notifications,
    "Account": Account,
    "NotificationSettings": NotificationSettings,
    "Privacy": Privacy,
}

export const pagesConfig = {
    mainPage: "Welcome",
    Pages: PAGES,
};
