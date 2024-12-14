import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ref, push, onValue, remove, update, off } from 'firebase/database';
import { database } from '../config/firebase-config';
import EventModal from './EventModal';
import ScheduleModal from './ScheduleModal';
import SearchResults from './SearchResults';
import './home.css';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from './LoadingOverlay';
import SettingsModal from './SettingsModal';
import PublicEvents from './PublicEvents';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase-config';
import { observer } from 'mobx-react-lite';
import { makeAutoObservable, runInAction } from 'mobx';

class CalendarStore {
  events = [];
  weatherData = { temp: '--' };
  newsItems = [];
  isLoading = true;

  constructor() {
    makeAutoObservable(this);
  }

  setEvents(events) {
    this.events = events;
  }

  setWeatherData(data) {
    this.weatherData = data;
  }

  setNewsItems(items) {
    this.newsItems = items;
  }

  setLoading(state) {
    this.isLoading = state;
  }

  get totalEvents() {
    return this.events.length;
  }

  get publicEventsCount() {
    return this.events.filter(event => event.isPublic).length;
  }
}

const calendarStore = new CalendarStore();

export const Home = observer(({ userEmail }) => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [calendarApi, setCalendarApi] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loadedItems, setLoadedItems] = useState({
    events: false,
    weather: false,
    news: false
  });
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [themeColor, setThemeColor] = useState(
    localStorage.getItem('themeColor') || '#17726d'
  );
  const [backgroundColor, setBackgroundColor] = useState(
    localStorage.getItem('backgroundColor') || '#eae4d2'
  );
  const [isPublicEventsOpen, setIsPublicEventsOpen] = useState(false);
  const [weatherTemp, setWeatherTemp] = useState('--');
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    if (!userEmail) {
      navigate('/login');
      return;
    }
  }, [userEmail, navigate]);

  useEffect(() => {
    const eventsRef = ref(database, 'events');
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const eventsList = Object.entries(data)
          .filter(([_, event]) => {
            const isInterested = Array.isArray(event.interestedEmails) && 
                                event.interestedEmails.includes(userEmail);
            return event.email === userEmail || isInterested;
          })
          .map(([id, event]) => ({
            id,
            title: event.title,
            start: new Date(event.date).toISOString().split('T')[0],
            description: event.description,
            location: event.location,
            email: event.email,
            isPublic: event.isPublic || false,
            imageUrl: event.imageUrl || '',
            interested: event.interested || 1,
            interestedEmails: Array.isArray(event.interestedEmails) ? event.interestedEmails : [event.email],
            allDay: true
          }));
        setEvents(eventsList);
      } else {
        setEvents([]);
      }
      setLoadedItems(prev => ({ ...prev, events: true }));
    });

    fetch('https://api.openweathermap.org/data/2.5/weather?q=Dumaguete&appid=8a57ae803b2cbae0711b6c69e7da27cd&units=metric')
      .then(response => response.json())
      .then(data => {
        setWeatherTemp(`${Math.round(data.main.temp)}°C`);
        setLoadedItems(prev => ({ ...prev, weather: true }));
      })
      .catch(error => {
        console.error('Error fetching weather:', error);
        setWeatherTemp('N/A');
        setLoadedItems(prev => ({ ...prev, weather: true }));
      });

    fetch('https://newsapi.org/v2/everything?q=philippines&language=en&sortBy=publishedAt&apiKey=85458797d59f4618be48ff9e2ee208fc', {
      headers: {
        'Authorization': '85458797d59f4618be48ff9e2ee208fc'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('News API response:', data);
      if (data.articles && data.articles.length > 0) {
        const filteredArticles = data.articles
          .filter(article => 
            article.title && 
            article.description && 
            !article.title.includes('[Removed]') && 
            !article.description.includes('[Removed]')
          )
          .slice(0, 5);
        console.log('Filtered articles:', filteredArticles);
        setNewsItems(filteredArticles);
      } else {
        console.log('No articles found in response');
        setNewsItems([]);
      }
      setLoadedItems(prev => ({ ...prev, news: true }));
    })
    .catch(error => {
      console.error('Error fetching news:', error);
      setNewsItems([]);
      setLoadedItems(prev => ({ ...prev, news: true }));
    });

    return () => {
      const eventsRef = ref(database, 'events');
      off(eventsRef);
    };
  }, [userEmail]);

  useEffect(() => {
    if (loadedItems.events && loadedItems.weather && loadedItems.news) {
      setIsLoading(false);
    }
  }, [loadedItems]);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', themeColor);
    document.documentElement.style.setProperty('--background-color', backgroundColor);
    document.body.style.backgroundColor = themeColor;
    localStorage.setItem('themeColor', themeColor);
    localStorage.setItem('backgroundColor', backgroundColor);
  }, [themeColor, backgroundColor]);

  useEffect(() => {
    runInAction(() => {
      calendarStore.setEvents(events);
      calendarStore.setLoading(isLoading);
    });
  }, [events, isLoading]);

  useEffect(() => {
    runInAction(() => {
      calendarStore.setWeatherData({ temp: weatherTemp });
    });
  }, [weatherTemp]);

  useEffect(() => {
    runInAction(() => {
      calendarStore.setNewsItems(newsItems);
    });
  }, [newsItems]);

  const handleEventClick = (clickInfo) => {
    const event = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      date: clickInfo.event.startStr,
      description: clickInfo.event.extendedProps.description,
      location: clickInfo.event.extendedProps.location,
      isPublic: clickInfo.event.extendedProps.isPublic || false,
      imageUrl: clickInfo.event.extendedProps.imageUrl || '',
      interested: clickInfo.event.extendedProps.interested || 1,
      interestedEmails: clickInfo.event.extendedProps.interestedEmails || [],
      email: clickInfo.event.extendedProps.email
    };
    setSelectedEvent(event);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedEvent(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleSaveEvent = (eventData) => {
    const eventsRef = ref(database, 'events');
    const formattedEvent = {
      ...eventData,
      date: new Date(eventData.date).toISOString().split('T')[0],
      email: userEmail,
      isPublic: eventData.isPublic || false,
      imageUrl: eventData.imageUrl || '',
      interested: 1,
      interestedEmails: [userEmail]
    };

    if (!formattedEvent.email) {
      alert('User email is required');
      return;
    }

    push(eventsRef, formattedEvent);
  };

  const handleUpdateEvent = (eventData) => {
    if (!eventData.id) return;
    const eventRef = ref(database, `events/${eventData.id}`);
    const formattedEvent = {
      title: eventData.title,
      description: eventData.description,
      date: new Date(eventData.date).toISOString().split('T')[0],
      location: eventData.location,
      email: userEmail,
      isPublic: eventData.isPublic || false,
      imageUrl: eventData.imageUrl || '',
      interested: eventData.isPublic ? (eventData.interested || 1) : 1,
      interestedEmails: [userEmail]
    };

    if (!formattedEvent.email) {
      alert('User email is required');
      return;
    }

    update(eventRef, formattedEvent);
    setModalMode('view');
  };

  const handleDeleteEvent = (eventId) => {
    const eventRef = ref(database, `events/${eventId}`);
    remove(eventRef);
    setModalOpen(false);
  };

  const handleScheduleClick = () => {
    setScheduleModalOpen(true);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      const results = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm)
      );
      setSearchResults(results);
      setSearchModalOpen(true);
    }
  };

  const handleSearchResultClick = (event) => {
    if (calendarApi) {
      calendarApi.gotoDate(event.start);
      calendarApi.changeView('dayGridDay');
    }
    setSearchModalOpen(false);
    setSearchTerm('');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      document.documentElement.style.setProperty('--theme-color', '#17726d');
      document.documentElement.style.setProperty('--background-color', '#eae4d2');
      document.body.style.backgroundColor = '#17726d';
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleThemeChange = ({ themeColor, backgroundColor }) => {
    setThemeColor(themeColor);
    setBackgroundColor(backgroundColor);
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div className="container">
        <div className="header">
          <div className="flex items-center">
            <img 
              src="https://storage.googleapis.com/a1aa/image/URnBX3wbNf24DShZ0Inbf8cMZ8hqCzMCOujwY22H6OwohgwTA.jpg" 
              alt="CalTask Logo" 
              width="50" 
              height="50" 
            />
            <div className="title">CalTask</div>
          </div>
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input 
              placeholder="Search events... (Press Enter to search)" 
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              onKeyPress={handleSearchKeyPress}
            />
          </div>
          <div className="icons">
            <div className="weather">
              <img 
                src="https://storage.googleapis.com/a1aa/image/15tQFQkpXipfSyqcn1DNkmfNwGQWzPbIRzLP8edz9EwVDBhnA.jpg" 
                alt="Current Weather" 
                width="50" 
                height="50" 
              />
              <div className="temp">{weatherTemp}</div>
            </div>
            <button 
              className="settings-button" 
              onClick={() => setSettingsModalOpen(true)}
              aria-label="Settings"
            >
              <i className="fas fa-cog"></i>
            </button>
            <button 
              className="logout-button" 
              onClick={handleLogout}
              aria-label="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
        <div className="main-content">
          <div className="calendar-section">
            <div className="flex justify-between items-center">
              <div className="month">
                {new Date().toLocaleString('default', { month: 'long' })}
              </div>
              <div className="buttons">
                <button 
                  className="schedule-button" 
                  onClick={handleScheduleClick}
                  aria-label="View My Schedules"
                >
                  My Schedules
                </button>
                <button 
                  className="schedule-button" 
                  onClick={() => setIsPublicEventsOpen(true)}
                  aria-label="View Public Events"
                >
                  Public Events
                </button>
                <button 
                  className="create-button" 
                  onClick={handleCreateClick}
                  aria-label="Create Event or Task"
                >
                  Create Event/Task
                </button>
              </div>
            </div>
            <FullCalendar
              ref={calendarRef => {
                if (calendarRef) {
                  setCalendarApi(calendarRef.getApi());
                }
              }}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay'
              }}
              height="auto"
              eventColor={themeColor}
              eventTextColor="white"
              eventBackgroundColor={themeColor}
              eventBorderColor={themeColor}
            />
          </div>
          <div className="news-section">
            <div className="news-title">Latest News from Philippines</div>
            {newsItems.length > 0 ? (
              newsItems.map((article, index) => (
                <div key={index} className="news-item">
                  <div className="news-title">{article.title}</div>
                  <div className="news-description">{article.description}</div>
                </div>
              ))
            ) : (
              <p>No news available at the moment</p>
            )}
          </div>
        </div>

        <EventModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          event={selectedEvent}
          onSave={handleSaveEvent}
          onUpdate={handleUpdateEvent}
          onDelete={handleDeleteEvent}
          mode={modalMode}
          setModalMode={setModalMode}
          setModalOpen={setModalOpen}
        />

        <ScheduleModal
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          events={events}
        />

        <SearchResults
          isOpen={searchModalOpen}
          onClose={() => {
            setSearchModalOpen(false);
            setSearchTerm('');
          }}
          searchResults={searchResults}
          onEventClick={handleSearchResultClick}
        />

        <SettingsModal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          currentTheme={themeColor}
          onThemeChange={handleThemeChange}
        />

        <PublicEvents
          isOpen={isPublicEventsOpen}
          onClose={() => setIsPublicEventsOpen(false)}
          userEmail={userEmail}
        />
      </div>
    </>
  );
});

export default Home;
