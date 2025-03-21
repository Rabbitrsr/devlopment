const API = {
    matches: [
      { id: '1', name: 'MI vs RCB' },
      { id: '2', name: 'CSK vs KKR' },
      { id: '3', name: 'DC vs PBKS' },
    ],
  
    teams: [
      { id: '1', name: 'Mumbai Indians' },
      { id: '2', name: 'Royal Challengers Bangalore' },
      { id: '3', name: 'Chennai Super Kings' },
      { id: '4', name: 'Kolkata Knight Riders' },
      { id: '5', name: 'Delhi Capitals' },
      { id: '6', name: 'Punjab Kings' },
    ],
  
    playersByTeam: {
      1: [
        { id: 101, name: 'Rohit Sharma' },
        { id: 102, name: 'Ishan Kishan' },
        { id: 103, name: 'Suryakumar Yadav' },
        { id: 104, name: 'Jasprit Bumrah' },
        { id: 105, name: 'Tim David' },
      ],
      2: [
        { id: 201, name: 'Virat Kohli' },
        { id: 202, name: 'Faf du Plessis' },
        { id: 203, name: 'Glenn Maxwell' },
        { id: 204, name: 'Mohammed Siraj' },
        { id: 205, name: 'Dinesh Karthik' },
      ],
      3: [
        { id: 301, name: 'MS Dhoni' },
        { id: 302, name: 'Ruturaj Gaikwad' },
        { id: 303, name: 'Moeen Ali' },
        { id: 304, name: 'Deepak Chahar' },
        { id: 305, name: 'Shivam Dube' },
      ],
      4: [
        { id: 401, name: 'Shreyas Iyer' },
        { id: 402, name: 'Andre Russell' },
        { id: 403, name: 'Varun Chakravarthy' },
        { id: 404, name: 'Sunil Narine' },
        { id: 405, name: 'Nitish Rana' },
      ],
      5: [
        { id: 501, name: 'David Warner' },
        { id: 502, name: 'Prithvi Shaw' },
        { id: 503, name: 'Axar Patel' },
        { id: 504, name: 'Kuldeep Yadav' },
        { id: 505, name: 'Rilee Rossouw' },
      ],
      6: [
        { id: 601, name: 'Shikhar Dhawan' },
        { id: 602, name: 'Liam Livingstone' },
        { id: 603, name: 'Arshdeep Singh' },
        { id: 604, name: 'Sam Curran' },
        { id: 605, name: 'Shahrukh Khan' },
      ],
    },
  
    banners: [
      require('../assets/images/banner1.png'),
      require('../assets/images/banner1.png'),
      require('../assets/images/banner1.png'),
    ],
  
    liveMatches: [
      {
        id: 1,
        team1: { name: 'MI' },
        team2: { name: 'RCB' },
        score: 'MI 158/4 (20)',
        status: 'Live - MI leads',
        matchId: 1,
      },
      {
        id: 2,
        team1: { name: 'CSK' },
        team2: { name: 'KKR' },
        score: 'CSK 175/5 (20)',
        status: 'Match Finished',
        matchId: 2,
      },
    ],
  
    recentMatches: [
      {
        id: 1,
        team1: { name: 'MI', score: '158/4' },
        team2: { name: 'RCB', score: '142/6' },
        winner: 'MI won by 16 runs',
      },
      {
        id: 2,
        team1: { name: 'CSK', score: '175/5' },
        team2: { name: 'KKR', score: '168/9' },
        winner: 'CSK won by 7 runs',
      },
    ],
  
    upcomingMatches: [
      {
        id: 1,
        date: '25 Mar 2025',
        time: '7:30 PM IST',
        team1: { name: 'MI', players: ['Rohit Sharma', 'Ishan Kishan'] },
        team2: { name: 'CSK', players: ['MS Dhoni', 'Ruturaj Gaikwad'] },
        venue: 'Wankhede Stadium, Mumbai',
      },
      {
        id: 2,
        date: '27 Mar 2025',
        time: '7:30 PM IST',
        team1: { name: 'RCB', players: ['Virat Kohli', 'Faf du Plessis'] },
        team2: { name: 'KKR', players: ['Shreyas Iyer', 'Andre Russell'] },
        venue: 'M. Chinnaswamy Stadium, Bengaluru',
      },
    ],
  
    events: [
      {
        id: 1,
        title: 'RCC Premier League 2025',
        place: 'Chennai',
        date: '10th April - 20th April 2025',
        fee: 'Entry Fee: ₹5000 per team',
        banner: require('../assets/images/banner1.png'),
      },
      {
        id: 2,
        title: 'Summer Knockout Cup',
        place: 'Bangalore',
        date: '5th May - 15th May 2025',
        fee: 'Entry Fee: ₹4000 per team',
        banner: require('../assets/images/banner1.png'),
      },
    ],
  };
  
  export default API;
  