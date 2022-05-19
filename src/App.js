import './App.css';
import {initializeParse } from '@parse/react';
import Parse from "parse";
import { HomeComponent } from './components/HomeComponent';
import { RoomComponent } from './components/RoomComponent';
import { Routes, Route } from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Your Parse initialization configuration goes here
const PARSE_APPLICATION_ID = 'ke5t8AB1SbDdbzppfb0QlOEqRLkmyw6ffuMiPblr';
// const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
const PARSE_JAVASCRIPT_KEY = 'Hood1HojX8boukiWsrJpkATKToXDtGc464kIGXlr';
const PARSE_LIVE_QUERY_URL = "https://tierlistcollab.b4a.io/";
initializeParse(PARSE_LIVE_QUERY_URL, PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.enableLocalDatastore();

const RoomComponentWrapper = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <RoomComponent />
    </DndProvider>
  );
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="room/:code" element={<RoomComponentWrapper />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
