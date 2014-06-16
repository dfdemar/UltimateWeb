/*
	Explanations for ULtiAnalytics calculations
	
	Copyright 2014 Summit Hill Software, Inc., all rights reserved
*/

if (!window.UltiAnalytics) {
	UltiAnalytics = {};
}

UltiAnalytics.explanations = 
[
 {"name" : "plusMinus", "explanations" : [{"lang" : "en", 
	 "title" : "+/-", 
	 "description" : "<ul><li>+1 for a goal.</li><li>+1 for an assist.</li><li>+1 for a D.</li><li>-1 for a drop.</li><li>-1 for a passer turnover (throwaway, stalled, misc. penalty).</li><li>+2 for a callahan (+1 for D and +1 for goal).</li><li>-1 for being callahaned.</li></ul>"}]
 },
 {"name" : "pointsPlayed", "explanations" : [{"lang" : "en", 
	 "title" : "points played", 
	 "description" : "<ul><li>total number of points played.  A player that subs in/out is credited half a point.</li></ul>"}]
 },
 {"name" : "oLinePointsPlayed", "explanations" : [{"lang" : "en", 
	 "title" : "o-line points played", 
	 "description" : "<ul><li>total number of o-linepoints the player played.  A player that subs in/out is credited a half point.</li></ul>"}]
 },
 {"name" : "dLinePointsPlayed", "explanations" : [{"lang" : "en", 
	 "title" : "d-line points played", 
	 "description" : "<ul><li>total number of o-linepoints the player played.  A player that subs in/out is credited a half point.</li></ul>"}]
 }, 
 {"name" : "oLineEfficiency", "explanations" : [{"lang" : "en", 
	 "title" : "o-Line officiency", 
	 "description" : "<ul><li>+1 for an O-line<sup>2</sup> goal for a point in which the player was on the field<sup>1</sup>.</li><li>-1 for an opponent score against the O-line<sup>2</sup> (a break) in which the player was on the field<sup>1</sup>.</li></ul>"}]
 },
 {"name" : "dLineEfficiency", "explanations" : [{"lang" : "en", 
	 "title" : "d-Line efficiency", 
	 "description" : "<li>+1 for a D-line<sup>2</sup> goal (a break) for a point in which the player was on the field<sup>1</sup>.</li><li>-1 for an opponent score against the D-line<sup>2</sup> for a point in which the player was on the field<sup>1</sup>.</li>"}]
 },
 {"name" : "minutesPlayed", "explanations" : [{"lang" : "en", 
	 "title" : "minutes played", 
	 "description" : "<ul><li>total number of minutes played by the player.  A player that subs in/out is credited half the point time.  <br> NOTE: If the elapsed time for a point appears amiss (> 1 hour) then it is assumed the game was adjusted outside of actual bounds and the default time per point (5 minutes) is credited.</li></ul>"}]
 },
 {"name" : "touches", "explanations" : [{"lang" : "en", 
	 "title" : "touches", 
	 "description" : "<ul><li>+1 when offense player picks up or catches a disc after the pull.</li><li>+1 when player recieves a pass.  No additional count when this player subsequently passes.</li><li>+1 when player catches a goal.</li><li>+1 when player has a callahan.</li></ul>"}]
 },
 {"name" : "catches", "explanations" : [{"lang" : "en", 
	 "title" : "catches", 
	 "description" : "<ul><li>+1 when offense player catches the disc (including for a goal) passed from another player.</li></ul>"}]
 },
 {"name" : "throws", "explanations" : [{"lang" : "en", 
	 "title" : "throws", 
	 "description" : "<ul><li>+1 when offense player passes to another player (including for a goal) regardless of whether the pass is caught, i.e., includes drops and throwaways.</li></ul>"}]
 },
 {"name" : "throwPercent", "explanations" : [{"lang" : "en", 
	 "title" : "throw %", 
	 "description" : "<ul><li>(throws - passer turnovers) &#247; throws</li></ul>"}]
 },
 {"name" : "catchPercent", "explanations" : [{"lang" : "en", 
	 "title" : "catch %", 
	 "description" : "<ul><li>catches &#247; (catches + drops)</li></ul>"}]
 },
 {"name" : "teamOffensiveProductivity", "explanations" : [{"lang" : "en", 
	 "title" : "offensive productivity", 
	 "description" : "<ul><li># of goals &divide; # of O-line<sup>2</sup> points</li></ul>"}]
 },
 {"name" : "teamConversionRate", "explanations" : [{"lang" : "en", 
	 "title" : "conversion rate", 
	 "description" : "<ul><li>where opportunities =  # of O-line points<sup>2</sup> + # of the other team's turnovers...</br># of goals / ( opportunities + goals )</li></ul>"}]
 }
];

UltiAnalytics.explanationFootnotes = 
[
 {"number" : "1", "note" : "Players substituted out before the goal are not affected."},
 {"number" : "2", "note" : "O-line refers to a point when the team receives a pull.   D-line refers to a point when the team pulls."}, 
]
