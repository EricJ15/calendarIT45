import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './home.css';

export const Home = () => {
  useEffect(() => {
    // Fetch weather data
    fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric')
      .then(response => response.json())
      .then(data => {
        document.getElementById('weather').innerText = `${data.main.temp}°C`;
      });

    // Fetch news data
    fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY')
      .then(response => response.json())
      .then(data => {
        const newsSection = document.querySelector('.news-section');
        newsSection.innerHTML = '<div class="news-title">Latest News</div>';
        data.articles.forEach(article => {
          const newsItem = document.createElement('div');
          newsItem.className = 'news-item';
          newsItem.innerHTML = `
            <div class="news-title">${article.title}</div>
            <div class="news-description">${article.description}</div>
          `;
          newsSection.appendChild(newsItem);
        });
      });
  }, []);

  return (
    <div className="container">
      <div className="header">
        <div className="flex items-center">
          <img alt="Calendar Icon" height="50" src="https://storage.googleapis.com/a1aa/image/URnBX3wbNf24DShZ0Inbf8cMZ8hqCzMCOujwY22H6OwohgwTA.jpg" width="50" />
          <div className="title">CalTask</div>
        </div>
        <div className="search-bar">
          <i className="fas fa-bell"></i>
          <input placeholder="Search" type="text" />
        </div>
        <div className="icons">
          <div className="weather">
            <img alt="Weather Icon" height="50" src="https://storage.googleapis.com/a1aa/image/15tQFQkpXipfSyqcn1DNkmfNwGQWzPbIRzLP8edz9EwVDBhnA.jpg" width="50" />
            <div className="temp" id="weather">21°C</div>
          </div>
          <i className="fas fa-sign-out-alt"></i>
        </div>
      </div>
      <div className="main-content">
        <div className="calendar-section">
          <div className="flex justify-between items-center">
            <div className="month">September</div>
            <div className="buttons">
              <button className="schedule-button">My Schedule</button>
              <button className="create-button">Create Event/Task</button>
            </div>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={[
              { title: 'Event 1', start: '2023-09-01' },
              { title: 'Event 2', start: '2023-09-05', end: '2023-09-07' }
            ]}
          />
        </div>
        <div className="news-section">
          <div className="news-title">Latest News</div>
          {/* News items will be appended here dynamically */}
        </div>
      </div>
    </div>
  );
};

export default Home;
