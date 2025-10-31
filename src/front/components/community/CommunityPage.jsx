import React, { useState } from 'react';
import '../../styles/CommunityPage.css';
import { Tab, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Importa los nuevos componentes de pestañas
import LeaderboardTab from '../components/community/LeaderboardTab.jsx';
import AddFriendsTab from '../components/community/AddFriendsTab.jsx';

function CommunityPage() {
  const [key, setKey] = useState('leaderboard');
  const navigate = useNavigate();

  return (
    <div className="community-page-container">
      <h1 className="page-title">Community</h1>
      
      <Tab.Container id="community-tabs" activeKey={key} onSelect={(k) => setKey(k)}>
        <Nav variant="pills" className="community-nav-pills">
          <Nav.Item>
            <Nav.Link eventKey="leaderboard">Leaderboard</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="add-friends">Add Friends</Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content className="mt-4">
          <Tab.Pane eventKey="leaderboard" unmountOnExit>
            <LeaderboardTab />
          </Tab.Pane>
          <Tab.Pane eventKey="add-friends" unmountOnExit>
            <AddFriendsTab />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

export default CommunityPage;