import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { collection, query, where, orderBy, limit, getDocs, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import TripDetailModal from '@/components/TripDetailModal';
import type { TripData as BaseTripData } from '@/types/trip';

// Extended trip data with optional participants array
interface TripData extends BaseTripData {
  participants?: string[];
}

// Brand colors
const electricPurple = '#8A2BE2';
const gold = '#FFD700';
const darkGold = '#DAA520';
const lightPurple = '#B185DB';

// Activity types for filtering
const activityTypes = [
  'hiking',
  'beach_day',
  'city_tour',
  'camping',
  'mountain_biking',
  'kayaking',
  'rock_climbing',
  'skiing',
  'surfing',
  'other'
];

export default function TripDiscovery() {
  const { user } = useAuth();
  const router = useRouter();
  
  // State for trips and filtering
  const [trips, setTrips] = useState<TripData[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivityType, setSelectedActivityType] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [sortOption, setSortOption] = useState<'newest' | 'popularity'>('newest');
  
  // Fetch trips from Firestore
  useEffect(() => {
    setLoading(true);
    
    // Create a query to get trips that haven't ended yet
    const today = new Date();
    const tripsRef = collection(db, 'trips');
    const tripsQuery = query(
      tripsRef,
      where('endDate', '>=', today.toISOString()),
      orderBy('endDate'),
      limit(50)
    );
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(tripsQuery, (snapshot) => {
      const tripsData: TripData[] = [];
      
      snapshot.forEach((doc) => {
        tripsData.push({ id: doc.id, ...doc.data() } as TripData);
      });
      
      setTrips(tripsData);
      setFilteredTrips(tripsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching trips:', error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Apply filters when any filter state changes
  useEffect(() => {
    let result = [...trips];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(trip => 
        trip.title.toLowerCase().includes(query) || 
        trip.description.toLowerCase().includes(query) ||
        trip.location.address.toLowerCase().includes(query)
      );
    }
    
    // Apply activity type filter
    if (selectedActivityType) {
      result = result.filter(trip => trip.activityType === selectedActivityType);
    }
    
    // Apply date range filter
    if (dateRange.start) {
      result = result.filter(trip => new Date(trip.startDate) >= dateRange.start!);
    }
    if (dateRange.end) {
      result = result.filter(trip => new Date(trip.startDate) <= dateRange.end!);
    }
    
    // Apply sorting
    if (sortOption === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'popularity') {
      // Assuming we track popularity by number of participants
      result.sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0));
    }
    
    setFilteredTrips(result);
  }, [trips, searchQuery, selectedActivityType, dateRange, sortOption]);
  
  // Handle opening trip detail modal
  const handleTripClick = (trip: TripData) => {
    setSelectedTrip(trip);
    setShowDetailModal(true);
  };
  
  // Handle date range changes
  const handleDateChange = (type: 'start' | 'end', date: Date | null) => {
    setDateRange(prev => ({
      ...prev,
      [type]: date
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedActivityType('');
    setDateRange({ start: null, end: null });
    setSortOption('newest');
  };
  
  return (
    <>
      <Head>
        <title>Discover Adventures - GoPalz</title>
        <meta name="description" content="Find your next adventure buddy on GoPalz" />
      </Head>
      
      <div className="container py-5">
        {/* Hero Banner */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 rounded-4 overflow-hidden shadow-sm">
              <div className="card-body p-5" style={{ background: electricPurple }}>
                <div className="row align-items-center">
                  <div className="col-md-8 text-white">
                    <h1 className="display-5 fw-bold mb-3">Find Your Next Adventure</h1>
                    <p className="lead mb-4">Discover trips created by fellow adventurers or create your own!</p>
                    <Link href="/trips/create" className="btn btn-lg fw-bold" style={{ backgroundColor: gold, color: '#000' }}>
                      <i className="bi bi-plus-circle me-2"></i>
                      Create New Adventure
                    </Link>
                  </div>
                  <div className="col-md-4 d-none d-md-block text-center">
                    <div className="position-relative" style={{ height: '200px' }}>
                      {/* Placeholder for illustration - you'll need to add this image */}
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <i className="bi bi-compass" style={{ fontSize: '5rem', color: 'white' }}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 rounded-4 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-3" style={{ color: electricPurple }}>Find Adventures</h5>
                
                <div className="row g-3">
                  {/* Search Input */}
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-search"></i>
                      </span>
                      <input 
                        type="text" 
                        className="form-control border-start-0" 
                        placeholder="Search adventures..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Activity Type Filter */}
                  <div className="col-md-3">
                    <select 
                      className="form-select" 
                      value={selectedActivityType}
                      onChange={(e) => setSelectedActivityType(e.target.value)}
                    >
                      <option value="">All Activities</option>
                      {activityTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Date Filter */}
                  <div className="col-md-3">
                    <div className="dropdown">
                      <button 
                        className="btn btn-outline-secondary dropdown-toggle w-100" 
                        type="button" 
                        id="dateFilterDropdown" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                      >
                        {dateRange.start ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end ? dateRange.end.toLocaleDateString() : 'Any'}` : 'Select Dates'}
                      </button>
                      <div className="dropdown-menu p-3" aria-labelledby="dateFilterDropdown" style={{ minWidth: '300px' }}>
                        <div className="mb-3">
                          <label className="form-label">Start Date</label>
                          <input 
                            type="date" 
                            className="form-control" 
                            value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleDateChange('start', e.target.value ? new Date(e.target.value) : null)}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">End Date</label>
                          <input 
                            type="date" 
                            className="form-control" 
                            value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleDateChange('end', e.target.value ? new Date(e.target.value) : null)}
                          />
                        </div>
                        <div className="d-flex justify-content-end">
                          <button 
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => setDateRange({ start: null, end: null })}
                          >
                            Clear
                          </button>
                          <button 
                            className="btn btn-sm" 
                            style={{ backgroundColor: electricPurple, color: 'white' }}
                            onClick={() => document.body.click()} // Close dropdown
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sort Options */}
                  <div className="col-md-2">
                    <select 
                      className="form-select" 
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as 'newest' | 'popularity')}
                    >
                      <option value="newest">Newest First</option>
                      <option value="popularity">Most Popular</option>
                    </select>
                  </div>
                </div>
                
                {/* Active Filters */}
                {(searchQuery || selectedActivityType || dateRange.start || dateRange.end) && (
                  <div className="d-flex flex-wrap align-items-center mt-3">
                    <span className="me-2 text-muted">Active filters:</span>
                    {searchQuery && (
                      <span className="badge bg-light text-dark me-2 mb-1">
                        Search: {searchQuery}
                        <button 
                          className="btn-close btn-close-sm ms-1" 
                          style={{ fontSize: '0.65rem' }}
                          onClick={() => setSearchQuery('')}
                        ></button>
                      </span>
                    )}
                    {selectedActivityType && (
                      <span className="badge bg-light text-dark me-2 mb-1">
                        Activity: {selectedActivityType.replace('_', ' ')}
                        <button 
                          className="btn-close btn-close-sm ms-1" 
                          style={{ fontSize: '0.65rem' }}
                          onClick={() => setSelectedActivityType('')}
                        ></button>
                      </span>
                    )}
                    {dateRange.start && (
                      <span className="badge bg-light text-dark me-2 mb-1">
                        Dates: {dateRange.start.toLocaleDateString()} - {dateRange.end ? dateRange.end.toLocaleDateString() : 'Any'}
                        <button 
                          className="btn-close btn-close-sm ms-1" 
                          style={{ fontSize: '0.65rem' }}
                          onClick={() => setDateRange({ start: null, end: null })}
                        ></button>
                      </span>
                    )}
                    <button 
                      className="btn btn-sm btn-outline-secondary ms-auto mb-1"
                      onClick={resetFilters}
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 rounded-4 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 style={{ color: electricPurple }}>
                    {loading ? 'Loading adventures...' : `${filteredTrips.length} Adventures Found`}
                  </h5>
                  <div className="text-muted small">
                    Showing {filteredTrips.length} of {trips.length} adventures
                  </div>
                </div>
                
                {loading ? (
                  <div className="d-flex flex-column justify-content-center align-items-center py-5">
                    <div className="spinner-border mb-3" style={{ width: '3rem', height: '3rem', color: electricPurple }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Finding adventures near you...</p>
                  </div>
                ) : filteredTrips.length > 0 ? (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {filteredTrips.map((trip) => (
                      <div key={trip.id} className="col">
                        <div 
                          className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleTripClick(trip)}
                        >
                          {/* Trip Image */}
                          <div className="position-relative" style={{ height: '180px' }}>
                            {trip.imageUrls && trip.imageUrls.length > 0 ? (
                              <Image 
                                src={trip.imageUrls[0]} 
                                alt={trip.title} 
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="h-100 w-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(45deg, #f3f3f3, #e3e3e3)' }}>
                                <i className="bi bi-image" style={{ fontSize: '48px', color: '#bbb' }}></i>
                              </div>
                            )}
                            
                            {/* Activity Badge */}
                            <div className="position-absolute top-0 start-0 m-2">
                              <span className="badge" style={{ backgroundColor: electricPurple }}>
                                {trip.activityType.replace('_', ' ')}
                              </span>
                            </div>
                            
                            {/* Availability Badge */}
                            <div className="position-absolute top-0 end-0 m-2">
                              <span className={`badge ${trip.spots > 3 ? 'bg-success' : trip.spots > 0 ? 'bg-warning' : 'bg-danger'}`}>
                                {trip.spots > 0 ? `${trip.spots} spots left` : 'Full'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="card-body">
                            <h5 className="card-title mb-1">{trip.title}</h5>
                            <p className="card-text mb-2 small">
                              <i className="bi bi-geo-alt me-1"></i> {trip.location.address}
                            </p>
                            
                            <div className="d-flex mb-3">
                              <div className="me-3">
                                <small className="text-muted d-block">Start</small>
                                <strong>{new Date(trip.startDate).toLocaleDateString()}</strong>
                              </div>
                              <div>
                                <small className="text-muted d-block">End</small>
                                <strong>{new Date(trip.endDate).toLocaleDateString()}</strong>
                              </div>
                            </div>
                            
                            <div className="d-flex justify-content-between align-items-center mt-auto">
                              <span className="badge bg-light text-dark">
                                <i className="bi bi-star-fill me-1" style={{ color: darkGold }}></i>
                                {trip.difficulty}
                              </span>
                              <button className="btn btn-sm" style={{ backgroundColor: gold, color: '#000' }}>
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5" style={{ backgroundColor: '#f9f9f9', borderRadius: '0.5rem' }}>
                    <div className="mb-3">
                      <i className="bi bi-search" style={{ fontSize: '48px', color: electricPurple }}></i>
                    </div>
                    <h5 style={{ color: electricPurple }}>No Adventures Found</h5>
                    <p className="text-muted mb-4">Try adjusting your filters or create your own adventure!</p>
                    <Link href="/trips/create" className="btn btn-lg fw-bold" style={{ backgroundColor: gold, color: '#000' }}>
                      <i className="bi bi-plus-circle me-2"></i>
                      Create New Adventure
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trip Detail Modal */}
      {selectedTrip && (
        <TripDetailModal 
          trip={selectedTrip} 
          show={showDetailModal} 
          onHide={() => setShowDetailModal(false)} 
        />
      )}
    </>
  );
}
