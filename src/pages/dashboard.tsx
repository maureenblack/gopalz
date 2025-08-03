import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface UserProfile {
  displayName: string;
  email: string;
  photoURL?: string;
  experience?: string;
  createdAt: string;
  bio?: string;
  preferences?: {
    activities?: string[];
    [key: string]: any;
  };
}

interface Trip {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  imageUrl?: string;
  createdBy: string;
  participants?: number;
  activityType?: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [pastTrips, setPastTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Brand colors
  const electricPurple = '#8A2BE2';
  const gold = '#FFD700';
  const darkGold = '#DAA520'; // For hover states
  const lightPurple = '#B185DB'; // For accents and hover states

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    async function fetchUserData() {
      if (!user) return;
      
      try {
        // Set a timeout to prevent infinite loading if Firestore is slow
        const timeoutId = setTimeout(() => {
          setLoading(false);
        }, 5000); // 5 second timeout as fallback
        
        // Fetch user profile
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          // Create a default profile if none exists
          setProfile({
            displayName: user.displayName || user.email?.split('@')[0] || 'Adventurer',
            email: user.email || '',
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString(),
            experience: 'beginner'
          });
        }
        
        // Fetch user's trips
        const tripsRef = collection(db, 'trips');
        const userTripsQuery = query(tripsRef, where('createdBy', '==', user.uid));
        const tripsSnapshot = await getDocs(userTripsQuery);
        
        const today = new Date();
        const upcoming: Trip[] = [];
        const past: Trip[] = [];
        
        tripsSnapshot.forEach((doc) => {
          const tripData = { id: doc.id, ...doc.data() } as Trip;
          const tripEndDate = new Date(tripData.endDate);
          
          if (tripEndDate >= today) {
            upcoming.push(tripData);
          } else {
            past.push(tripData);
          }
        });
        
        // Sort upcoming trips by start date (closest first)
        upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        
        // Sort past trips by end date (most recent first)
        past.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
        
        setUpcomingTrips(upcoming);
        setPastTrips(past);
        
        // Clear the timeout since we're done loading
        clearTimeout(timeoutId);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [user, authLoading, router]);

  // Calculate days until next trip
  const getNextTripCountdown = () => {
    if (upcomingTrips.length === 0) return null;
    
    const nextTrip = upcomingTrips[0];
    const tripDate = new Date(nextTrip.startDate);
    const today = new Date();
    
    // Set hours to 0 to just compare dates
    today.setHours(0, 0, 0, 0);
    
    const diffTime = tripDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      days: diffDays,
      trip: nextTrip
    };
  };
  
  const nextTripInfo = getNextTripCountdown();

  // If still authenticating, show loading spinner
  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status" style={{ color: electricPurple }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  // If not authenticated, don't render anything (will redirect in useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="container py-4">
      {/* Hero Banner */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-body p-0">
          <div className="row g-0">
            <div className="col-md-8 p-4" style={{ background: electricPurple }}>
              <div className="d-flex flex-column h-100 justify-content-center text-white">
                <h1 className="display-5 fw-bold mb-2">Welcome, {profile?.displayName || user.email?.split('@')[0] || 'Adventurer'}!</h1>
                <p className="lead mb-4">Ready for your next adventure?</p>
                
                {nextTripInfo ? (
                  <div className="bg-white bg-opacity-25 rounded-4 p-3 mb-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-3">
                        <div className="rounded-circle bg-white text-center d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', color: electricPurple }}>
                          <h2 className="mb-0">{nextTripInfo.days}</h2>
                        </div>
                      </div>
                      <div>
                        <p className="mb-0 fw-bold">Days until your next adventure</p>
                        <p className="mb-0">{nextTripInfo.trip.title} in {nextTripInfo.trip.location}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white bg-opacity-25 rounded-4 p-3 mb-3">
                    <p className="mb-0">You don't have any upcoming adventures yet. Time to plan one!</p>
                  </div>
                )}
                
                <div>
                  <Link href="/trips/create" className="btn btn-lg fw-bold me-2" style={{ backgroundColor: gold, color: '#000' }}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Create Adventure
                  </Link>
                  <Link href="/trips" className="btn btn-outline-light btn-lg">
                    <i className="bi bi-search me-2"></i>
                    Find Adventures
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 d-none d-md-block">
              <div className="h-100 position-relative">
                <div className="position-absolute top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <i className="bi bi-image text-white" style={{ fontSize: '48px' }}></i>
                </div>
                {profile?.photoURL ? (
                  <Image
                    src={profile.photoURL}
                    alt="Profile background"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="h-100 w-100" style={{ background: 'url(/images/adventure-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-4">
          {/* User Profile Card */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4 text-center">
              <div className="position-relative mb-4 mx-auto" style={{ width: '120px', height: '120px' }}>
                {profile?.photoURL ? (
                  <Image
                    src={profile.photoURL}
                    alt={profile.displayName || 'User'}
                    width={120}
                    height={120}
                    className="rounded-circle border shadow-sm"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="rounded-circle d-flex align-items-center justify-content-center w-100 h-100 shadow-sm text-white" style={{ background: electricPurple }}>
                    <span className="display-4">{profile?.displayName?.charAt(0) || user?.email?.charAt(0)}</span>
                  </div>
                )}
                <div className="position-absolute bottom-0 end-0">
                  <Link href="/profile" className="btn btn-sm rounded-circle p-2 shadow-sm" style={{ backgroundColor: gold, color: '#000' }}>
                    <i className="bi bi-pencil-fill"></i>
                  </Link>
                </div>
              </div>
              
              <h3 className="mb-1">{profile?.displayName || user?.email?.split('@')[0]}</h3>
              <div className="badge mb-3" style={{ backgroundColor: electricPurple }}>
                {profile?.experience ? profile.experience.charAt(0).toUpperCase() + profile.experience.slice(1) : 'Adventure Seeker'}
              </div>
              
              <p className="text-muted mb-3">{profile?.bio || 'No bio yet. Tell others about your adventure style!'}</p>
              
              <Link href="/profile" className="btn w-100 fw-bold" style={{ backgroundColor: gold, color: '#000' }}>
                Complete Your Profile
              </Link>
            </div>
            <div className="card-footer bg-light p-3 rounded-bottom-4">
              <div className="row text-center g-0">
                <div className="col-4 border-end">
                  <div className="p-2">
                    <h5 className="mb-0" style={{ color: electricPurple }}>{upcomingTrips.length}</h5>
                    <small className="text-muted">Upcoming</small>
                  </div>
                </div>
                <div className="col-4 border-end">
                  <div className="p-2">
                    <h5 className="mb-0" style={{ color: electricPurple }}>{pastTrips.length}</h5>
                    <small className="text-muted">Completed</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2">
                    <h5 className="mb-0" style={{ color: electricPurple }}>0</h5>
                    <small className="text-muted">Connections</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header border-0 bg-transparent pt-3 px-4">
              <h5 className="mb-0" style={{ color: electricPurple }}>Quick Actions</h5>
            </div>
            <div className="card-body px-4 py-3">
              <div className="list-group list-group-flush">
                <Link href="/trips/create" className="list-group-item list-group-item-action border-0 px-0 py-2 d-flex align-items-center">
                  <span className="me-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '40px', height: '40px', backgroundColor: gold, color: '#000' }}>
                    <i className="bi bi-plus-lg"></i>
                  </span>
                  <span>Create New Adventure</span>
                </Link>
                <Link href="/trips" className="list-group-item list-group-item-action border-0 px-0 py-2 d-flex align-items-center">
                  <span className="me-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '40px', height: '40px', backgroundColor: '#f0f0f0' }}>
                    <i className="bi bi-search"></i>
                  </span>
                  <span>Explore Adventures</span>
                </Link>
                <Link href="/connections" className="list-group-item list-group-item-action border-0 px-0 py-2 d-flex align-items-center">
                  <span className="me-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '40px', height: '40px', backgroundColor: '#f0f0f0' }}>
                    <i className="bi bi-people"></i>
                  </span>
                  <span>Find Adventure Buddies</span>
                </Link>
                <Link href="/wallet" className="list-group-item list-group-item-action border-0 px-0 py-2 d-flex align-items-center">
                  <span className="me-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '40px', height: '40px', backgroundColor: '#f0f0f0' }}>
                    <i className="bi bi-wallet2"></i>
                  </span>
                  <span>Connect Wallet</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Activity Feed (Placeholder) */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header border-0 bg-transparent pt-3 px-4">
              <h5 className="mb-0" style={{ color: electricPurple }}>Recent Activity</h5>
            </div>
            <div className="card-body p-4">
              <div className="text-center py-4">
                <div className="mb-3">
                  <i className="bi bi-clock-history" style={{ fontSize: '48px', color: '#ccc' }}></i>
                </div>
                <p className="text-muted mb-0">Your activity feed is empty</p>
                <p className="small text-muted">
                  Join or create adventures to see activity here
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="col-lg-8">
          {/* Trips Section */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header border-0 bg-white pt-3 px-4">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                    style={activeTab === 'upcoming' ? { color: electricPurple, borderColor: '#dee2e6 #dee2e6 #fff', borderTop: `2px solid ${electricPurple}` } : {}}
                  >
                    Upcoming Adventures
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                    style={activeTab === 'past' ? { color: electricPurple, borderColor: '#dee2e6 #dee2e6 #fff', borderTop: `2px solid ${electricPurple}` } : {}}
                  >
                    Past Adventures
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="card-body p-4" style={{ minHeight: '300px', border: '1px solid #f0f0f0', borderRadius: '0 0 0.5rem 0.5rem' }}>
              {loading ? (
                <div className="d-flex flex-column justify-content-center align-items-center py-5">
                  <div className="spinner-border mb-3" style={{ width: '3rem', height: '3rem', color: electricPurple }} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Loading your adventures...</p>
                </div>
              ) : (
                <>
                  {/* Upcoming Trips Tab */}
                  {activeTab === 'upcoming' && (
                    <>
                      {upcomingTrips.length > 0 ? (
                        <div className="row row-cols-1 g-4">
                          {upcomingTrips.map((trip) => (
                            <div key={trip.id} className="col">
                              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                <div className="row g-0">
                                  <div className="col-md-4">
                                    <div className="h-100 position-relative" style={{ minHeight: '160px' }}>
                                      {trip.imageUrl ? (
                                        <Image 
                                          src={trip.imageUrl} 
                                          alt={trip.title} 
                                          fill
                                          style={{ objectFit: 'cover' }}
                                        />
                                      ) : (
                                        <div className="h-100 w-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(45deg, #f3f3f3, #e3e3e3)' }}>
                                          <i className="bi bi-image" style={{ fontSize: '48px', color: '#bbb' }}></i>
                                        </div>
                                      )}
                                      <div className="position-absolute top-0 start-0 m-2">
                                        <span className="badge" style={{ backgroundColor: electricPurple }}>
                                          {trip.activityType || 'Adventure'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-8">
                                    <div className="card-body h-100 d-flex flex-column">
                                      <div className="d-flex justify-content-between align-items-start">
                                        <h5 className="card-title mb-1">{trip.title}</h5>
                                        <div className="dropdown">
                                          <button className="btn btn-sm btn-light rounded-circle" type="button" id={`dropdownMenuButton-${trip.id}`} data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="bi bi-three-dots"></i>
                                          </button>
                                          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdownMenuButton-${trip.id}`}>
                                            <li><Link href={`/trips/${trip.id}/edit`} className="dropdown-item">Edit</Link></li>
                                            <li><a className="dropdown-item" href="#">Share</a></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><a className="dropdown-item text-danger" href="#">Cancel</a></li>
                                          </ul>
                                        </div>
                                      </div>
                                      
                                      <p className="card-text mb-1">
                                        <i className="bi bi-geo-alt me-1"></i> {trip.location}
                                      </p>
                                      
                                      <div className="d-flex mb-3">
                                        <div className="me-3">
                                          <small className="text-muted d-block">Start Date</small>
                                          <strong>{new Date(trip.startDate).toLocaleDateString()}</strong>
                                        </div>
                                        <div>
                                          <small className="text-muted d-block">End Date</small>
                                          <strong>{new Date(trip.endDate).toLocaleDateString()}</strong>
                                        </div>
                                      </div>
                                      
                                      <p className="card-text small mb-3 text-muted">
                                        {trip.description ? trip.description.substring(0, 100) + (trip.description.length > 100 ? '...' : '') : 'No description provided.'}
                                      </p>
                                      
                                      <div className="mt-auto d-flex align-items-center justify-content-between">
                                        <span className="badge bg-light text-dark">
                                          <i className="bi bi-people me-1"></i> {trip.participants || 0} participants
                                        </span>
                                        <Link href={`/trips/${trip.id}`} className="btn" style={{ backgroundColor: gold, color: '#000' }}>
                                          View Details
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-5" style={{ backgroundColor: '#f9f9f9', borderRadius: '0.5rem' }}>
                          <div className="mb-3">
                            <i className="bi bi-calendar-plus" style={{ fontSize: '48px', color: electricPurple }}></i>
                          </div>
                          <h5 style={{ color: electricPurple }}>No Upcoming Adventures</h5>
                          <p className="text-muted mb-4">Time to plan your next adventure!</p>
                          <Link href="/trips/create" className="btn btn-lg fw-bold" style={{ backgroundColor: gold, color: '#000' }}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Create Your First Adventure
                          </Link>
                          <div className="mt-3 small text-muted">
                            {upcomingTrips.length === 0 ? 'No trips found in database' : `Found ${upcomingTrips.length} trips (not visible)`}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Past Trips Tab */}
                  {activeTab === 'past' && (
                    <>
                      {pastTrips.length > 0 ? (
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                          {pastTrips.map((trip) => (
                            <div key={trip.id} className="col">
                              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                <div className="position-relative" style={{ height: '140px' }}>
                                  {trip.imageUrl ? (
                                    <Image 
                                      src={trip.imageUrl} 
                                      alt={trip.title} 
                                      fill
                                      style={{ objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div className="h-100 w-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(45deg, #f3f3f3, #e3e3e3)' }}>
                                      <i className="bi bi-image" style={{ fontSize: '48px', color: '#bbb' }}></i>
                                    </div>
                                  )}
                                  <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-end p-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))' }}>
                                    <h5 className="text-white mb-0">{trip.title}</h5>
                                  </div>
                                </div>
                                <div className="card-body">
                                  <p className="card-text mb-1">
                                    <i className="bi bi-geo-alt me-1"></i> {trip.location}
                                  </p>
                                  <p className="card-text small mb-3">
                                    <i className="bi bi-calendar me-1"></i> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                  </p>
                                  
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span className="badge" style={{ backgroundColor: '#f0f0f0', color: '#666' }}>
                                      {trip.activityType || 'Adventure'} 
                                    </span>
                                    <Link href={`/trips/${trip.id}`} className="btn btn-sm" style={{ backgroundColor: electricPurple, color: 'white' }}>
                                      View Memories
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-5" style={{ backgroundColor: '#f9f9f9', borderRadius: '0.5rem' }}>
                          <div className="mb-3">
                            <i className="bi bi-clock-history" style={{ fontSize: '48px', color: electricPurple }}></i>
                          </div>
                          <h5 style={{ color: electricPurple }}>No Past Adventures</h5>
                          <p className="text-muted">Your completed adventures will appear here</p>
                          <div className="mt-3 small text-muted">
                            {pastTrips.length === 0 ? 'No past trips found in database' : `Found ${pastTrips.length} past trips (not visible)`}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            
            {/* Card Footer with Link to All Trips */}
            <div className="card-footer bg-white border-0 text-center p-4">
              <Link href="/trips" className="btn btn-outline-dark">
                View All Adventures
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}