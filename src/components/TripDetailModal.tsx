import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Modal, Button, Tab, Nav } from 'react-bootstrap';
import { doc, getDoc, collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
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

interface TripDetailModalProps {
  trip: TripData;
  show: boolean;
  onHide: () => void;
}

interface UserProfile {
  displayName: string;
  photoURL?: string;
  experience?: string;
  bio?: string;
}

interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  createdAt: any;
}

export default function TripDetailModal({ trip, show, onHide }: TripDetailModalProps) {
  const { user } = useAuth();
  const [creatorProfile, setCreatorProfile] = useState<UserProfile | null>(null);
  const [participants, setParticipants] = useState<UserProfile[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [isJoining, setIsJoining] = useState(false);

  // Fetch trip creator profile and participants
  useEffect(() => {
    if (!show) return;

    const fetchTripData = async () => {
      setLoading(true);
      try {
        // Fetch creator profile
        const creatorRef = doc(db, 'users', trip.createdBy);
        const creatorDoc = await getDoc(creatorRef);
        
        if (creatorDoc.exists()) {
          setCreatorProfile(creatorDoc.data() as UserProfile);
        }
        
        // Fetch participants (if any)
        if (trip.participants && trip.participants.length > 0) {
          const participantProfiles: UserProfile[] = [];
          
          for (const participantId of trip.participants) {
            const participantRef = doc(db, 'users', participantId);
            const participantDoc = await getDoc(participantRef);
            
            if (participantDoc.exists()) {
              participantProfiles.push(participantDoc.data() as UserProfile);
            }
          }
          
          setParticipants(participantProfiles);
        }
        
        // Fetch comments
        const commentsRef = collection(db, 'tripComments');
        const commentsQuery = query(
          commentsRef,
          where('tripId', '==', trip.id),
          orderBy('createdAt', 'desc')
        );
        
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsData: Comment[] = [];
        
        commentsSnapshot.forEach((doc) => {
          commentsData.push({ id: doc.id, ...doc.data() } as Comment);
        });
        
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching trip data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTripData();
  }, [show, trip]);
  
  // Handle joining a trip
  const handleJoinTrip = async () => {
    if (!user) return;
    
    setIsJoining(true);
    try {
      // Logic to join trip would go here
      // This would typically update the trip document in Firestore
      // to add the current user's ID to the participants array
      
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('You have successfully joined this trip!');
      onHide();
    } catch (error) {
      console.error('Error joining trip:', error);
      alert('Failed to join trip. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };
  
  // Handle adding a comment
  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;
    
    try {
      const commentData = {
        tripId: trip.id,
        text: newComment.trim(),
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || '',
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'tripComments'), commentData);
      
      // Add the new comment to the state
      setComments([
        {
          id: 'temp-' + Date.now(),
          ...commentData,
          createdAt: new Date()
        },
        ...comments
      ]);
      
      // Clear the input
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      className="trip-detail-modal"
    >
      <Modal.Header closeButton style={{ borderBottom: 'none' }}>
        <Modal.Title as="h4" style={{ color: electricPurple }}>
          {trip.title}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-0">
        {/* Trip Images Carousel */}
        <div className="position-relative" style={{ height: '300px' }}>
          {trip.imageUrls && trip.imageUrls.length > 0 ? (
            <Image 
              src={trip.imageUrls[0]} 
              alt={trip.title} 
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="h-100 w-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(45deg, #f3f3f3, #e3e3e3)' }}>
              <i className="bi bi-image" style={{ fontSize: '72px', color: '#bbb' }}></i>
            </div>
          )}
          
          <div className="position-absolute top-0 start-0 m-3">
            <span className="badge" style={{ backgroundColor: electricPurple, fontSize: '1rem' }}>
              {trip.activityType.replace('_', ' ')}
            </span>
          </div>
          
          <div className="position-absolute top-0 end-0 m-3">
            <span className={`badge ${trip.spots > 3 ? 'bg-success' : trip.spots > 0 ? 'bg-warning' : 'bg-danger'}`} style={{ fontSize: '1rem' }}>
              {trip.spots > 0 ? `${trip.spots} spots left` : 'Full'}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          {/* Tabs Navigation */}
          <Tab.Container activeKey={activeTab} onSelect={(k: string | null) => setActiveTab(k || 'details')}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link 
                  eventKey="details"
                  style={activeTab === 'details' ? { color: electricPurple, borderColor: '#dee2e6 #dee2e6 #fff', borderTop: `2px solid ${electricPurple}` } : {}}
                >
                  Trip Details
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  eventKey="participants"
                  style={activeTab === 'participants' ? { color: electricPurple, borderColor: '#dee2e6 #dee2e6 #fff', borderTop: `2px solid ${electricPurple}` } : {}}
                >
                  Participants
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  eventKey="comments"
                  style={activeTab === 'comments' ? { color: electricPurple, borderColor: '#dee2e6 #dee2e6 #fff', borderTop: `2px solid ${electricPurple}` } : {}}
                >
                  Comments
                </Nav.Link>
              </Nav.Item>
            </Nav>
            
            <Tab.Content>
              {/* Details Tab */}
              <Tab.Pane eventKey="details">
                <div className="row">
                  <div className="col-md-8">
                    <h5 className="mb-3">About this Adventure</h5>
                    <p>{trip.description || 'No description provided.'}</p>
                    
                    <div className="row g-3 mb-4">
                      <div className="col-6 col-md-4">
                        <div className="p-3 bg-light rounded-3">
                          <small className="text-muted d-block">Start Date</small>
                          <strong>{new Date(trip.startDate).toLocaleDateString()}</strong>
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="p-3 bg-light rounded-3">
                          <small className="text-muted d-block">End Date</small>
                          <strong>{new Date(trip.endDate).toLocaleDateString()}</strong>
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="p-3 bg-light rounded-3">
                          <small className="text-muted d-block">Difficulty</small>
                          <strong className="text-capitalize">{trip.difficulty}</strong>
                        </div>
                      </div>
                    </div>
                    
                    <h5 className="mb-3">Location</h5>
                    <div className="bg-light p-3 rounded-3 mb-4">
                      <p className="mb-2">
                        <i className="bi bi-geo-alt me-2"></i>
                        {trip.location.address}
                      </p>
                      <div className="ratio ratio-16x9">
                        <iframe 
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${trip.location.lng-0.01}%2C${trip.location.lat-0.01}%2C${trip.location.lng+0.01}%2C${trip.location.lat+0.01}&layer=mapnik&marker=${trip.location.lat}%2C${trip.location.lng}`}
                          title="Trip Location"
                          className="rounded-3"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="mt-2 text-muted small">
                        <i className="bi bi-info-circle me-1"></i>
                        Note: You'll receive exact meeting point details after joining
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                      <div className="card-body">
                        <h5 className="card-title mb-3">Trip Organizer</h5>
                        {loading ? (
                          <div className="d-flex justify-content-center py-3">
                            <div className="spinner-border" style={{ width: '2rem', height: '2rem', color: electricPurple }} role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) : creatorProfile ? (
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                              <div className="rounded-circle overflow-hidden" style={{ width: '60px', height: '60px', backgroundColor: '#f0f0f0' }}>
                                {creatorProfile.photoURL ? (
                                  <Image 
                                    src={creatorProfile.photoURL} 
                                    alt={creatorProfile.displayName} 
                                    width={60}
                                    height={60}
                                  />
                                ) : (
                                  <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: lightPurple }}>
                                    <span className="text-white fw-bold">{creatorProfile.displayName.charAt(0).toUpperCase()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="mb-0">{creatorProfile.displayName}</h6>
                              <p className="text-muted mb-0 small">
                                {creatorProfile.experience ? 
                                  creatorProfile.experience.charAt(0).toUpperCase() + creatorProfile.experience.slice(1) : 
                                  'Adventure Enthusiast'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted">Creator information unavailable</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="card border-0 shadow-sm rounded-4">
                      <div className="card-body">
                        <h5 className="card-title mb-3">Join This Trip</h5>
                        <p className="text-muted mb-3 small">
                          {trip.spots > 0 
                            ? `${trip.spots} spots remaining out of ${trip.spots + (trip.participants?.length || 0)}` 
                            : 'This trip is currently full'}
                        </p>
                        
                        <button 
                          className="btn w-100 fw-bold" 
                          style={{ backgroundColor: trip.spots > 0 ? gold : '#f0f0f0', color: '#000' }}
                          disabled={trip.spots <= 0 || isJoining}
                          onClick={handleJoinTrip}
                        >
                          {isJoining ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Joining...
                            </>
                          ) : trip.spots > 0 ? (
                            'Join This Adventure'
                          ) : (
                            'Trip Full'
                          )}
                        </button>
                        
                        <div className="mt-3 text-center">
                          <Link href={`/trips/${trip.id}`} className="text-decoration-none" style={{ color: electricPurple }}>
                            <i className="bi bi-share me-1"></i>
                            Share this adventure
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
              
              {/* Participants Tab */}
              <Tab.Pane eventKey="participants">
                <h5 className="mb-3">Trip Participants</h5>
                
                {loading ? (
                  <div className="d-flex justify-content-center py-4">
                    <div className="spinner-border" style={{ width: '2rem', height: '2rem', color: electricPurple }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : participants.length > 0 ? (
                  <div className="row row-cols-1 row-cols-md-2 g-3">
                    {participants.map((participant, index) => (
                      <div key={index} className="col">
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-body d-flex">
                            <div className="flex-shrink-0">
                              <div className="rounded-circle overflow-hidden" style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0' }}>
                                {participant.photoURL ? (
                                  <Image 
                                    src={participant.photoURL} 
                                    alt={participant.displayName} 
                                    width={50}
                                    height={50}
                                  />
                                ) : (
                                  <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: lightPurple }}>
                                    <span className="text-white fw-bold">{participant.displayName.charAt(0).toUpperCase()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="mb-1">{participant.displayName}</h6>
                              <p className="text-muted mb-0 small">
                                {participant.experience ? 
                                  participant.experience.charAt(0).toUpperCase() + participant.experience.slice(1) : 
                                  'Adventure Enthusiast'}
                              </p>
                              {participant.bio && (
                                <p className="mt-2 small">{participant.bio}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4" style={{ backgroundColor: '#f9f9f9', borderRadius: '0.5rem' }}>
                    <div className="mb-3">
                      <i className="bi bi-people" style={{ fontSize: '48px', color: electricPurple }}></i>
                    </div>
                    <h5 style={{ color: electricPurple }}>No Participants Yet</h5>
                    <p className="text-muted mb-4">Be the first to join this adventure!</p>
                    <button 
                      className="btn btn-lg fw-bold" 
                      style={{ backgroundColor: gold, color: '#000' }}
                      disabled={trip.spots <= 0 || isJoining}
                      onClick={handleJoinTrip}
                    >
                      {isJoining ? 'Joining...' : 'Join This Adventure'}
                    </button>
                  </div>
                )}
              </Tab.Pane>
              
              {/* Comments Tab */}
              <Tab.Pane eventKey="comments">
                <h5 className="mb-3">Questions & Comments</h5>
                
                {/* Add Comment Form */}
                {user && (
                  <div className="mb-4">
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ask a question or leave a comment..." 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      />
                      <button 
                        className="btn" 
                        style={{ backgroundColor: electricPurple, color: 'white' }}
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Comments List */}
                {loading ? (
                  <div className="d-flex justify-content-center py-4">
                    <div className="spinner-border" style={{ width: '2rem', height: '2rem', color: electricPurple }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : comments.length > 0 ? (
                  <div className="comments-list">
                    {comments.map((comment) => (
                      <div key={comment.id} className="card border-0 shadow-sm mb-3">
                        <div className="card-body">
                          <div className="d-flex">
                            <div className="flex-shrink-0">
                              <div className="rounded-circle overflow-hidden" style={{ width: '40px', height: '40px', backgroundColor: '#f0f0f0' }}>
                                {comment.userPhoto ? (
                                  <Image 
                                    src={comment.userPhoto} 
                                    alt={comment.userName} 
                                    width={40}
                                    height={40}
                                  />
                                ) : (
                                  <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: lightPurple }}>
                                    <span className="text-white fw-bold">{comment.userName.charAt(0).toUpperCase()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <h6 className="mb-0">{comment.userName}</h6>
                                <small className="text-muted">
                                  {comment.createdAt instanceof Date 
                                    ? comment.createdAt.toLocaleDateString() 
                                    : 'Just now'}
                                </small>
                              </div>
                              <p className="mb-0">{comment.text}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4" style={{ backgroundColor: '#f9f9f9', borderRadius: '0.5rem' }}>
                    <div className="mb-3">
                      <i className="bi bi-chat" style={{ fontSize: '48px', color: electricPurple }}></i>
                    </div>
                    <h5 style={{ color: electricPurple }}>No Comments Yet</h5>
                    <p className="text-muted mb-3">Be the first to ask a question or leave a comment!</p>
                    {!user && (
                      <Link href="/login" className="btn" style={{ backgroundColor: electricPurple, color: 'white' }}>
                        Sign in to comment
                      </Link>
                    )}
                  </div>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Modal.Body>
      
      <Modal.Footer style={{ borderTop: 'none' }}>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        {trip.spots > 0 && (
          <Button 
            style={{ backgroundColor: gold, color: '#000', borderColor: gold }}
            disabled={isJoining}
            onClick={handleJoinTrip}
          >
            {isJoining ? 'Joining...' : 'Join This Adventure'}
          </Button>
        )}
      </Modal.Footer>
      
      <style jsx global>{`
        .trip-detail-modal .modal-content {
          border: none;
          border-radius: 1rem;
          overflow: hidden;
        }
        
        .trip-detail-modal .nav-tabs .nav-link {
          border: 1px solid transparent;
        }
        
        .trip-detail-modal .nav-tabs .nav-link.active {
          border-color: #dee2e6 #dee2e6 #fff;
          border-top: 2px solid ${electricPurple};
          color: ${electricPurple};
        }
      `}</style>
    </Modal>
  );
}
