import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Parse from "parse";
import { Button, TextField } from '@mui/material';

const CODE_LENGTH = 6;
const ROOM_CODE_CHARSET = 'abcdefghijklmnopqrstuvwxyz';

function makeRoomCode() {
  let code = '';
  const length = CODE_LENGTH;
  const charsetLength = ROOM_CODE_CHARSET.length;
  for ( var i = 0; i < length; i++ ) {
    code += ROOM_CODE_CHARSET.charAt(Math.floor(Math.random() * charsetLength));
  }
  return code;
}

export const HomeComponent = () => {

  const [rooms, setRooms] = useState(new Set());
  const [roomCodeField, setRoomCodeField] = useState("");
  const navigate = useNavigate();

  function createNewRoomCode() {
    if (rooms.size === Math.pow(ROOM_CODE_CHARSET.length, CODE_LENGTH)) {
      throw new Error("All room codes are currently used!");
    }

    while (true) {
      const code = makeRoomCode();
      if (!rooms.has(code)) {
        return code;
      }
    }
  }

  async function createRoom() {
    
    // Generate a random room code
    let code = null;
    try {
      code = createNewRoomCode();
    } catch (error) {
      alert("Error creating new room: " + error);
      return;
    }
    
    try {

      const Room = new Parse.Object('Room');

      Room.set('code', code);
      Room.set('images', []);
      Room.set('text', []);
      Room.set('elementTierMap', {});
      // Default tiers
      Room.set('tiers', [
        {'color': 'red', 'tag': 'S'},
        {'color': 'orange', 'tag': 'A'},
        {'color': 'khaki', 'tag': 'B'},
        {'color': 'green', 'tag': 'C'},
        {'color': 'blue', 'tag': 'D'},
        {'color': 'purple', 'tag': 'E'},
        {'color': 'pink', 'tag': 'F'}
      ]);

      await Room.save();
    } catch (error) {
      console.log('Error saving new room: ', error);
      return;
    }

    const newRooms = new Set(rooms);
    newRooms.add(code);
    setRooms(newRooms);
    joinRoom(code);
  }

  function checkRoomCodeField(code) {
    const regex = new RegExp("^[a-z]{" + CODE_LENGTH + "}$");
    return regex.test(code);
  }

  async function joinRoom(code) {
    
    if (!checkRoomCodeField(code)) {
      alert("Code is invalid!");
      return;
    }

    let roomQuery = new Parse.Query("Room");
    roomQuery.contains("code", code);
    let results = await roomQuery.find();
    if (results.length === 1) {
      navigate("/room/" + code);
    } else {
      alert("Room could not be found!");
    }
  }

  function handleRoomCodeFieldChange(e) {
    setRoomCodeField(e.target.value);
  }

  return (
    <div>
      <Button variant="contained" onClick={createRoom}>Create Room</Button>
      <Button variant="contained" onClick={(() => joinRoom(roomCodeField))}>Join Room</Button>
      <TextField id="room-code-field" type="text" onChange={handleRoomCodeFieldChange} />
    </div>
  );
};