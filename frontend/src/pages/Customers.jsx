import React, { useState, useMemo, useContext, useEffect } from "react";
import { Search, Filter, MoreVertical, Edit, Trash2, Mail, Phone, MapPin, UserCheck, UserX, Shield } from "lucide-react";
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Customers = () => {
  const { authToken } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedTier, setSelectedTier] = useState("All");

  useEffect(() => {
    fetchCustomers();
  }, [authToken]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/customers/', {
        headers: { Authorization: `Bearer ${authToken.access}` }
      });
      setCustomers(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers");
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || customer.status === selectedStatus;

      const matchesTier =
        selectedTier === "All" || customer.loyalty_tier === selectedTier;

      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [customers, searchTerm, selectedStatus, selectedTier]);

  if (loading) return <div className="text-white text-center mt-20">Loading customers...</div>;
  if (error) return <div className="text-red-400 text-center mt-20">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <div className="flex gap-3">
          <button className="bg-[#1f2937] hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 transition-colors">
            Export
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Add Customer
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-[#111827] p-4 rounded-lg border border-gray-700 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1f2937] text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-40 bg-[#1f2937] text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>

          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full sm:w-40 bg-[#1f2937] text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="All">All Tiers</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-[#111827] rounded-xl border border-gray-700 overflow-hidden hover:border-gray-500 transition-all hover:shadow-lg"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={customer.avatar || `https://ui-avatars.com/api/?name=${customer.name}&background=random`}
                      alt={customer.name}
                      className="w-14 h-14 rounded-full border-2 border-[#1f2937]"
                    />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#111827] ${customer.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                      }`}></div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                      {customer.name}
                      {customer.verified && <UserCheck className="w-4 h-4 text-blue-400" />}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${customer.loyalty_tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-500' :
                        customer.loyalty_tier === 'Silver' ? 'bg-gray-400/20 text-gray-400' : 'bg-orange-700/20 text-orange-700'
                      }`}>
                      {customer.loyalty_tier} Member
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-start gap-3 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{customer.address}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700 flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Total Spent</p>
                  <p className="text-white font-semibold mt-1">$2,450</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Orders</p>
                  <p className="text-white font-semibold mt-1">12</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-red-900/30 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No customers found.
        </div>
      )}
    </div>
  );
};

export default Customers;