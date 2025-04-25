import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import user from "../../public/images/patient.png";
import logo from "../../public/images/logo.png";
import { Ordonnance } from "@/types";
import withAuth from "@/components/withPrivateRoute";
import { MdDashboard } from "react-icons/md";
import { FaNotesMedical, FaUserEdit } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";

const ListOrdonnances = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const router = useRouter();
  const [listOrdonnance, setListOrdonnance] = useState<Ordonnance[] | null>(null);

  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // Mobile
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) { // Tablet
        setItemsPerPage(2);
      } else { // Desktop
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listOrdonnance?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchOrdonnances = async () => {
      try {
        const id = localStorage.getItem("id_patient");
        const response = await axios.get(
          `https://tatbib-api.onrender.com/medcine/getOrdonnanceByPatient/${id}`
        );
        setListOrdonnance(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load ordonnances. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdonnances();
  }, []);

  if (typeof window === "undefined") return null;

  const login = localStorage.getItem("LoginPatient") || "{}";

  const logOut = () => {
    localStorage.clear();
    router.push("/login_patient");
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Ordonnances</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside 
        className={`bg-gray-800 text-white w-full lg:w-64 fixed lg:static h-full z-40 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="p-4 flex flex-col items-center border-b border-gray-700">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white mb-3">
            <Image 
              src={user} 
              alt="User profile" 
              width={96}
              height={96}
              className="object-cover"
              priority
            />
          </div>
          <h5 className="font-semibold text-center">{login}</h5>
        </div>
        
        <nav className="mt-4">
          <ul className="space-y-1 px-2">
            <li>
              <Link 
                href="/patient_dashboard" 
                className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MdDashboard className="mr-3 text-lg" />
                <span>Appointments</span>
              </Link>
            </li>
            <li className="bg-gray-700 rounded-lg">
              <Link 
                href="#" 
                className="flex items-center p-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaNotesMedical className="mr-3 text-lg" />
                <span>Ordonnances</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/account_patient" 
                className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaUserEdit className="mr-3 text-lg" />
                <span>My Account</span>
              </Link>
            </li>
            <li>
              <button 
                onClick={() => {
                  logOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center p-3 hover:bg-gray-700 rounded-lg text-left transition-colors"
              >
                <RiLogoutCircleFill className="mr-3 text-lg" />
                <span>Log out</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-6 lg:ml-64">
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Ordonnances <span className="text-blue-600">List</span>
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Ordonnances List */}
            <div className="space-y-4">
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <article key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                      {/* Doctor Image */}
                      <div className="md:w-1/4 p-4 flex justify-center bg-gray-50">
                        <div className="w-32 h-32 relative">
                          <Image 
                            src={logo} 
                            alt="Doctor logo"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                      
                      {/* Ordonnance Details */}
                      <div className="md:w-3/4 p-4 md:p-6">
                        <div className="space-y-3">
                          <div>
                            <span className="text-red-500 font-medium">Dr: </span>
                            <span className="text-lg font-semibold">{item.medcine.fullName}</span>
                          </div>
                          
                          <div>
                            <span className="text-gray-600 font-medium">Speciality: </span>
                            <span>{item.medcine.speciality}</span>
                          </div>
                          
                          <div>
                            <span className="text-red-500 font-medium">Patient: </span>
                            <span>{item.patient.firstName} {item.patient.lastName}</span>
                          </div>
                          
                          <div className="mt-3">
                            <label className="block text-red-500 font-medium mb-2">Prescription:</label>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200">
                              <p className="whitespace-pre-line">{item.medicamment}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="mt-4 flex justify-end space-x-3 noPrint">
                          <button 
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-500">No ordonnances found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {listOrdonnance && listOrdonnance.length > itemsPerPage && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {Array.from({ length: Math.ceil(listOrdonnance.length / itemsPerPage) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`px-4 py-2 border-t border-b border-gray-300 ${currentPage === index + 1 ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(listOrdonnance.length / itemsPerPage)}
                    className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default withAuth(ListOrdonnances);