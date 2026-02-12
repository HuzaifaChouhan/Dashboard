import React, { useState, useMemo } from "react";
import { Search, Filter, Users, UserCheck, UserPlus, DollarSign, Mail, Phone, MapPin, Calendar, Shield, Star, Eye, Edit, Ban, MessageSquare, X, Check, AlertCircle } from "lucide-react";

const Customers = () => {
  // Sample customer data
  const [customers] = useState([
    {
      id: "CUST-001",
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY 10001",
      registrationDate: "2023-06-15T10:30:00",
      lastLogin: "2024-01-17T14:22:00",
      status: "active",
      verified: true,
      totalOrders: 12,
      totalSpent: 2598.75,
      loyaltyTier: "Gold",
      avatar: "https://picsum.photos/seed/john/40/40.jpg"
    },
    {
      id: "CUST-002",
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1 (555) 234-5678",
      address: "456 Oak Ave, Los Angeles, CA 90001",
      registrationDate: "2023-08-22T09:15:00",
      lastLogin: "2024-01-16T16:45:00",
      status: "active",
      verified: true,
      totalOrders: 8,
      totalSpent: 1845.50,
      loyaltyTier: "Silver",
      avatar: "https://picsum.photos/seed/jane/40/40.jpg"
    },
    {
      id: "CUST-003",
      name: "Robert Johnson",
      email: "robert.j@email.com",
      phone: "+1 (555) 345-6789",
      address: "789 Pine Rd, Chicago, IL 60601",
      registrationDate: "2023-11-10T11:20:00",
      lastLogin: "2024-01-15T13:55:00",
      status: "active",
      verified: false,
      totalOrders: 3,
      totalSpent: 425.50,
      loyaltyTier: "Bronze",
      avatar: "https://picsum.photos/seed/robert/40/40.jpg"
    },
    {
      id: "CUST-004",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1 (555) 456-7890",
      address: "321 Elm St, Houston, TX 77001",
      registrationDate: "2024-01-05T14:30:00",
      lastLogin: "2024-01-17T09:15:00",
      status: "active",
      verified: true,
      totalOrders: 1,
      totalSpent: 89.99,
      loyaltyTier: "Bronze",
      avatar: "https://picsum.photos/seed/emily/40/40.jpg"
    },
    {
      id: "CUST-005",
      name: "Michael Wilson",
      email: "m.wilson@email.com",
      phone: "+1 (555) 567-8901",
      address: "654 Maple Dr, Phoenix, AZ 85001",
      registrationDate: "2023-09-18T10:45:00",
      lastLogin: "2024-01-10T11:20:00",
      status: "inactive",
      verified: true,
      totalOrders: 5,
      totalSpent: 756.75,
      loyaltyTier: "Silver",
      avatar: "https://picsum.photos/seed/michael/40/40.jpg"
    },
    {
      id: "CUST-006",
      name: "Sarah Brown",
      email: "sarah.b@email.com",
      phone: "+1 (555) 678-9012",
      address: "987 Cedar Ln, Philadelphia, PA 19101",
      registrationDate: "2023-12-01T16:20:00",
      lastLogin: "2024-01-17T15:30:00",
      status: "active",
      verified: true,
      totalOrders: 4,
      totalSpent: 312.00,
      loyaltyTier: "Bronze",
      avatar: "https://picsum.photos/seed/sarah/40/40.jpg"
    },
    {
      id: "CUST-007",
      name: "David Martinez",
      email: "david.martinez@email.com",
      phone: "+1 (555) 789-0123",
      address: "147 Birch Way, San Antonio, TX 78201",
      registrationDate: "2023-07-25T13:10:00",
      lastLogin: "2024-01-14T12:45:00",
      status: "banned",
      verified: false,
      totalOrders: 2,
      totalSpent: 156.00,
      loyaltyTier: "Bronze",
      avatar: "https://picsum.photos/seed/david/40/40.jpg"
    },
    {
      id: "CUST-008",
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      phone: "+1 (555) 890-1234",
      address: "258 Spruce St, San Diego, CA 92101",
      registrationDate: "2023-10-30T15:25:00",
      lastLogin: "2024-01-17T10:15:00",
      status: "active",
      verified: true,
      totalOrders: 6,
      totalSpent: 892.25,
      loyaltyTier: "Silver",
      avatar: "https://picsum.photos/seed/lisa/40/40.jpg"
    }
  ]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = 
        customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus;
      const matchesTier = selectedTier === "all" || customer.loyaltyTier === selectedTier;
      const matchesVerified = verifiedFilter === "all" || 
        (verifiedFilter === "verified" && customer.verified) ||
        (verifiedFilter === "unverified" && !customer.verified);
      
      return matchesSearch && matchesStatus && matchesTier && matchesVerified;
    });
  }, [customers, searchTerm, selectedStatus, selectedTier, verifiedFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === "active").length;
    const newCustomers = customers.filter(c => {
      const registrationDate = new Date(c.registrationDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return registrationDate >= thirtyDaysAgo;
    }).length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    
    return { totalCustomers, activeCustomers, newCustomers, totalRevenue };
  }, [customers]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "active": return <UserCheck className="w-4 h-4" />;
      case "inactive": return <AlertCircle className="w-4 h-4" />;
      case "banned": return <Ban className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "text-green-500 bg-green-500/10";
      case "inactive": return "text-yellow-500 bg-yellow-500/10";
      case "banned": return "text-red-500 bg-red-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "Gold": return "text-yellow-500 bg-yellow-500/10";
      case "Silver": return "text-gray-300 bg-gray-300/10";
      case "Bronze": return "text-orange-600 bg-orange-600/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 30) return `${diffDays} days ago`;
    return formatDate(dateString);
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">Total Customers</p>
                <p className="text-white text-2xl font-bold mt-1">{stats.totalCustomers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">Active Customers</p>
                <p className="text-white text-2xl font-bold mt-1">{stats.activeCustomers}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <UserCheck className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">New (30 days)</p>
                <p className="text-white text-2xl font-bold mt-1">{stats.newCustomers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <UserPlus className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">Total Revenue</p>
                <p className="text-white text-2xl font-bold mt-1 truncate">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-[#1a2332] border border-gray-600 text-white rounded-lg hover:bg-[#1e2875] transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters && <X className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div className="min-w-0">
                <label className="block text-gray-400 text-sm mb-2">Account Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#1e2875]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
              
              {/* Loyalty Tier Filter */}
              <div className="min-w-0">
                <label className="block text-gray-400 text-sm mb-2">Loyalty Tier</label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#1e2875]"
                >
                  <option value="all">All Tiers</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Bronze">Bronze</option>
                </select>
              </div>
              
              {/* Verification Filter */}
              <div className="min-w-0">
                <label className="block text-gray-400 text-sm mb-2">Verification</label>
                <select
                  value={verifiedFilter}
                  onChange={(e) => setVerifiedFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#1e2875]"
                >
                  <option value="all">All Customers</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
              
              {/* Clear Filters */}
              <div className="min-w-0 flex items-end">
                <button
                  onClick={() => {
                    setSelectedStatus("all");
                    setSelectedTier("all");
                    setVerifiedFilter("all");
                  }}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
          
          {/* Results Count */}
          <div className="mt-4 text-gray-400 text-sm">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-[#111827] rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a2332] border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Spent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#1a2332] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={customer.avatar} 
                          alt={customer.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-white flex items-center gap-2">
                            {customer.name}
                            {customer.verified && <Shield className="w-4 h-4 text-blue-500" title="Verified" />}
                          </div>
                          <div className="text-xs text-gray-400">{customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Mail className="w-3 h-3 text-gray-500" />
                          <span className="truncate max-w-[150px]">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Phone className="w-3 h-3 text-gray-500" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="truncate max-w-[150px]">{customer.address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-300">{formatDate(customer.registrationDate)}</div>
                      <div className="text-xs text-gray-400">Last login: {getRelativeTime(customer.lastLogin)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(customer.status)}`}>
                          {getStatusIcon(customer.status)}
                          <span className="capitalize">{customer.status}</span>
                        </div>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getTierColor(customer.loyaltyTier)}`}>
                          <Star className="w-3 h-3" />
                          <span>{customer.loyaltyTier}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-white font-medium">{customer.totalOrders}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-white font-medium">${customer.totalSpent.toFixed(2)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="Edit Customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="Send Message"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No customers found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Customer Details Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-[#111827] rounded-lg border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Customer Details</h3>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Customer Header */}
                  <div className="flex items-center gap-4 pb-6 border-b border-gray-700">
                    <img 
                      src={selectedCustomer.avatar} 
                      alt={selectedCustomer.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">{selectedCustomer.name}</h4>
                        {selectedCustomer.verified && (
                          <div className="flex items-center gap-1 text-blue-500">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm">Verified</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{selectedCustomer.id}</p>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs mt-2 ${getStatusColor(selectedCustomer.status)}`}>
                        {getStatusIcon(selectedCustomer.status)}
                        <span className="capitalize">{selectedCustomer.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Customer Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div>
                      <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Contact Information
                      </h5>
                      <div className="bg-[#1a2332] rounded-lg p-4 space-y-3">
                        <div>
                          <p className="text-gray-400 text-xs">Email</p>
                          <p className="text-white text-sm">{selectedCustomer.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Phone</p>
                          <p className="text-white text-sm">{selectedCustomer.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Address</p>
                          <p className="text-white text-sm">{selectedCustomer.address}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Account Information */}
                    <div>
                      <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Account Information
                      </h5>
                      <div className="bg-[#1a2332] rounded-lg p-4 space-y-3">
                        <div>
                          <p className="text-gray-400 text-xs">Registration Date</p>
                          <p className="text-white text-sm">{formatDate(selectedCustomer.registrationDate)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Last Login</p>
                          <p className="text-white text-sm">{getRelativeTime(selectedCustomer.lastLogin)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Loyalty Tier</p>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getTierColor(selectedCustomer.loyaltyTier)}`}>
                            <Star className="w-3 h-3" />
                            <span>{selectedCustomer.loyaltyTier}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Statistics */}
                  <div>
                    <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Order Statistics
                    </h5>
                    <div className="bg-[#1a2332] rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Total Orders</p>
                          <p className="text-white text-xl font-bold mt-1">{selectedCustomer.totalOrders}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Total Spent</p>
                          <p className="text-white text-xl font-bold mt-1">${selectedCustomer.totalSpent.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Average Order</p>
                          <p className="text-white text-xl font-bold mt-1">
                            ${(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Customer Since</p>
                          <p className="text-white text-sm mt-1">
                            {new Date(selectedCustomer.registrationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    <button className="flex-1 px-4 py-2 bg-[#1e2875] text-white rounded-lg hover:bg-[#2a3599] transition-colors flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Customer
                    </button>
                    <button className="flex-1 px-4 py-2 bg-[#1a2332] border border-gray-600 text-white rounded-lg hover:bg-[#252f41] transition-colors flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Send Message
                    </button>
                    {selectedCustomer.status === 'active' ? (
                      <button className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2">
                        <Ban className="w-4 h-4" />
                        Ban Customer
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;