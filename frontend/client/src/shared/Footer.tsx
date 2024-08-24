import { Link } from "react-router-dom"
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaTumblrSquare } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="w-full flex flex-col   bg-[var(--quinary-color)] pb-4">
      <div className="w-full grid grid-cols-2 lg:grid-cols-6 text-center items-center py-4 px-4 gap-4 " >
        
        <div className="flex flex-col p-3  h-[220px]">
          <h3 className="font-bold text-xl">About Us</h3>
        <Link to="/" className="mt-2">General</Link>
        <Link to="/" className="mt-2">Blog</Link>
        <Link to="/" className="mt-2">Careers</Link>
        <Link to="/" className="mt-2">Affilate Program</Link>
        </div>

        <div className="flex flex-col p-3 h-[220px]">
          <h3 className="font-bold text-xl">Legal</h3>
        <Link to="/" className="mt-2">Terms of Services</Link>
        <Link to="/" className="mt-2">Privacy Policy</Link>
        <Link to="/" className="mt-2">Refund Policy</Link>
        <Link to="/" className="mt-2">Cookie Policie</Link>
        </div>

        <div className="flex flex-col p-3 border  h-[220px]">
          <h3 className="font-bold text-xl">Support</h3>
        <Link to="/" className="mt-2">Account</Link>
        <Link to="/" className="mt-2">Genral</Link>
        <Link to="/" className="mt-2">Server Management</Link>
        <Link to="/" className="mt-2">Server Management</Link>
        <Link to="/" className="mt-2">Server Plans</Link>
        </div>

        <div className="flex flex-col p-3 h-[220px]">
          <h3 className="font-bold text-xl">Account</h3>
        <Link to="/" className="mt-2">My Servers</Link>
        <Link to="/" className="mt-2">Create Server</Link>
        <Link to="/" className="mt-2">Settings</Link>
        <Link to="/" className="mt-2">Register</Link>
        </div>

        <div className="flex flex-col p-3 h-[220px]">
          <h3 className="font-bold text-xl">Blog</h3>
        <Link to="/" className="mt-2">Minecraft </Link>
        <Link to="/" className="mt-2">FiveM</Link>
        <Link to="/" className="mt-2">Others</Link>
        
        </div>

        <div className="flex flex-col p-3 h-[220px]">
          <h3 className="font-bold text-xl">Others</h3>
        <Link to="/" className="mt-2">Server List </Link>
        <Link to="/" className="mt-2">Trustpilot</Link>
        <Link to="/" className="mt-2">Reedem Code</Link>
        
        </div>
      </div>
      <div className="lg:w-[80%] bg-bg-footer mx-auto lg:h-[180px] bg-no-repeat bg-cover bg-opacity-5 rounded-lg  flex flex-col lg:flex-row justify-between items-center">
        <div className="flex flex-col gap-1 ml-4 lg:mt-0 mt-2 ">
          <div className="font-bold text-2xl roboto-slab-600" >Switch to Premium Plan today and save up to 25% off</div>
          <div className="dark:text-gray-400 mt-3">Unsatisfied from our service?</div>
          <div className="dark:text-gray-400">We'll provide a full refund within the first 14-days of deployment no questions asked!</div>
        </div>
        <div className=" p-4 mr-6">
          <Link to="/">
          <div className="uppercase bg-[var(--text-color)] p-4 rounded-lg">Upgrade My Plan</div></Link>
        </div>
      </div>
      <div className="flex lg:w-[80%] mx-auto  flex-col lg:flex-row justify-between items-center mt-10 mb-10 lg:mt-14">
        <div className=""><img src="/images/how2mc.jpg" className="rounded-[100%]" width="50px" height="50px" alt="how2mc" /></div>
        <div className="flex flex-col gap-2 w">
          <div className="font-semibold ">Terms of Service &nbsp; |&nbsp; Privacy Policy&nbsp; |&nbsp; Refund Policy&nbsp; |&nbsp; Cookie Policy&nbsp;</div>
          <div className="text-gray-500"> Copyright © 2024, How2MC GSM - All Rights Reserved. Not affiliated with Mojang, AB. </div>
          <div className="text-gray-500">Nor should we be considered a company endorsed by Mojang, AB.</div>
        </div>
        <div className="flex flex-row gap-3">
            <Link to="/" className="text-gray-400 dark:text-gray-500 font-bold text-xl"><FaGithub width="30px"/></Link>
            <Link to="/" className="text-gray-400 dark:text-gray-500 font-bold text-xl"><FaFacebook width="30px"/></Link>
            <Link to="/" className="text-gray-400 dark:text-gray-500 font-bold text-xl"><FaLinkedin width="30px"/></Link>
            <Link to="/" className="text-gray-400 dark:text-gray-500 font-bold text-xl"><FaTumblrSquare width="30px"/></Link>
        </div>
      </div>
    </div>
  )
}

export default Footer