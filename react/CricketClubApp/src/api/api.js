const API = {
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
          matchId: 1,  // link to matchDetails data
        },
        {
          id: 2,
          team1: { name: 'CSK' },
          team2: { name: 'KKR' },
          score: 'CSK 175/5 (20)',
          status: 'Match Finished',
          matchId: 1,
        },
    ],
    recentMatches: [
      {
        id: 1,
        matchId: 1, 
        team1: { name: 'MI', score: '158/4' },
        team2: { name: 'RCB', score: '142/6' },
        winner: 'MI won by 16 runs',
      },
      {
        id: 2,
        matchId: 1, 
        team1: { name: 'CSK', score: '175/5' },
        team2: { name: 'KKR', score: '168/9' },
        winner: 'CSK won by 7 runs',
      },
    ],
    matchDetails: {
      1: {
        matchSummary: 'MI won by 16 runs',
        innings: [
          {
            battingTeam: 'MI',
            battingScore: '158/4 (20)',
            batting: [
              { name: 'Rohit Sharma', runs: 75, balls: 45, fours: 8, sixes: 3, sr: 166.6 },
              { name: 'Ishan Kishan', runs: 35, balls: 28, fours: 2, sixes: 1, sr: 125.0 },
            ],
            fow: '1-35 (Ishan), 2-78 (Rohit), 3-115 (Surya)',
            bowlingAgainst: [
              { name: 'Siraj', overs: 4, runs: 30, wickets: 1, eco: 7.5 },
              { name: 'Harshal Patel', overs: 4, runs: 38, wickets: 2, eco: 9.5 },
            ],
          },
          {
            battingTeam: 'RCB',
            battingScore: '142/6 (20)',
            batting: [
              { name: 'Faf du Plessis', runs: 48, balls: 36, fours: 4, sixes: 2, sr: 133.3 },
              { name: 'Virat Kohli', runs: 40, balls: 30, fours: 3, sixes: 1, sr: 133.3 },
            ],
            fow: '1-24 (Kohli), 2-70 (Faf)',
            bowlingAgainst: [
              { name: 'Bumrah', overs: 4, runs: 22, wickets: 4, eco: 5.5 },
              { name: 'Chawla', overs: 4, runs: 33, wickets: 1, eco: 8.2 },
            ],
          },
        ],
      },
    },
    clubInfo: 'RCC is one of the leading cricket clubs hosting yearly tournaments and nurturing talent.',
    upcomingMatches: [
        {
          id: 1,
          date: '25 Mar 2025',
          time: '7:30 PM IST',
          team1: { name: 'MI', players: ['Rohit Sharma', 'Ishan Kishan', 'Suryakumar Yadav', 'Bumrah'] },
          team2: { name: 'CSK', players: ['MS Dhoni', 'Ruturaj Gaikwad', 'Moeen Ali', 'Deepak Chahar'] },
          venue: 'Wankhede Stadium, Mumbai',
        },
        {
          id: 2,
          date: '27 Mar 2025',
          time: '7:30 PM IST',
          team1: { name: 'RCB', players: ['Virat Kohli', 'Faf du Plessis', 'Maxwell', 'Siraj'] },
          team2: { name: 'KKR', players: ['Shreyas Iyer', 'Andre Russell', 'Varun Chakravarthy', 'Sunil Narine'] },
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
  