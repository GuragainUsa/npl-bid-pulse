import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

import BNK from "../../assets/club_logo/BNK.webp";
import CHR from "../../assets/club_logo/CHR.webp";
import JAB from "../../assets/club_logo/JAB.webp";
import KAG from "../../assets/club_logo/KAGnew.jpeg";
import KAY from "../../assets/club_logo/KAY.webp";
import LUL from "../../assets/club_logo/LULnew.jpg";
import POA from "../../assets/club_logo/POA.webp";
import SPR from "../../assets/club_logo/SPR.webp";

interface Player {
  id: number;
  first_name: string;
  last_name: string;
  category: "A" | "B" | "C" | "S" | "LT";
  player_type: string;
  wicket_keeper: boolean;
  sold_price?: number;
  team_name?: string;
  status?: "sold" | "unsold" | "retained";
}

interface Team {
  id: number;
  name: string;
  display_name: string;
  remaining_purse: number;
  grade_a_count: number;
  grade_b_count: number;
  grade_c_count: number;
  marquee_count: number;
  local_talent_count: number;
}

interface TeamsOverviewProps {
  teams: Team[];
  players: Player[];
}

export function TeamsOverview({ teams, players }: TeamsOverviewProps) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const teamColors: Record<string, string> = {
    janakpur_bolts: "team-1",
    sudurpaschim_royals: "team-2",
    karnali_yaks: "team-3",
    chitwan_rhinos: "team-4",
    kathmandu_gurkhas: "team-5",
    biratnagar_kings: "team-6",
    pokhara_avengers: "team-7",
    lumbini_lions: "team-8",
  };

  const teamLogos: Record<string, string> = {
    janakpur_bolts: JAB,
    sudurpaschim_royals: SPR,
    karnali_yaks: KAY,
    chitwan_rhinos: CHR,
    kathmandu_gurkhas: KAG,
    biratnagar_kings: BNK,
    pokhara_avengers: POA,
    lumbini_lions: LUL,
  };

  const getTeamPlayers = (teamName: string) =>
    players.filter((player) => player.team_name === teamName);

  const sortPlayersByRole = (players: Player[]) => {
    const categoryOrder = { S: 0, A: 1, B: 2, C: 3, LT: 4 };
    const roleOrder = ["Batsman", "Wicket Keeper", "All-rounder", "Bowler"];
    return players.sort((a, b) => {
      const categoryDiff =
        (categoryOrder[a.category] ?? 5) - (categoryOrder[b.category] ?? 5);
      if (categoryDiff !== 0) return categoryDiff;
      const roleA = a.wicket_keeper ? "Wicket Keeper" : a.player_type;
      const roleB = b.wicket_keeper ? "Wicket Keeper" : b.player_type;
      return roleOrder.indexOf(roleA) - roleOrder.indexOf(roleB);
    });
  };

  const getCategoryDisplayName = (category: Player["category"]) => {
    switch (category) {
      case "S":
        return "Marquee";
      case "A":
        return "A";
      case "B":
        return "B";
      case "C":
        return "C";
      case "LT":
        return "Local Talent";
      default:
        return category;
    }
  };

  const TeamDetails = ({
    team,
    showRole,
  }: {
    team: Team;
    showRole: boolean;
  }) => {
    const teamPlayers = getTeamPlayers(team.name);
    const sortedPlayers = sortPlayersByRole(teamPlayers);
    const teamLogo = teamLogos[team.name];
    const teamColorClass = teamColors[team.name] || "primary";

    return (
      <Card
        className={cn(
          "h-full border border-gray-300",
          `bg-${teamColorClass}/10`
        )}
      >
        {/* Header */}
        <CardHeader
          className={cn(
            "text-center text-white relative overflow-hidden p-4",
            `bg-${teamColorClass}`
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <img src={teamLogo} alt={`${team.display_name} Logo`} className="w-16 h-16 object-contain rounded-full bg-white p-1" />
            <CardTitle className="text-lg font-bold">
              {team.display_name}
            </CardTitle>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-4 bg-white">
          {/* Player Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1 text-left">Name</th>
                  {showRole && (
                    <th className="border px-2 py-1 text-left">Role</th>
                  )}
                  <th className="border px-2 py-1">Category</th>
                  <th className="border px-2 py-1">Price</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={showRole ? 4 : 3}
                      className="text-center p-4 text-gray-500"
                    >
                      No players acquired
                    </td>
                  </tr>
                ) : (
                  sortedPlayers.map((player) => (
                    <tr key={player.id}>
                      <td className="border px-2 py-1">
                        {player.first_name} {player.last_name}
                      </td>
                      {showRole && (
                        <td className="border px-2 py-1">
                          {player.wicket_keeper
                            ? "Wicket Keeper"
                            : player.player_type}
                        </td>
                      )}
                      <td className="border px-2 py-1 text-center">
                        {getCategoryDisplayName(player.category)}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {((player.sold_price || 0) / 100000).toFixed(1)}L
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* 4 teams per row */}
      <div className="grid grid-cols-4 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            onClick={() => setSelectedTeam(team)}
            className="cursor-pointer"
          >
            <TeamDetails team={team} showRole={false} />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedTeam && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedTeam(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTeam(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <TeamDetails team={selectedTeam} showRole={true} />
          </div>
        </div>
      )}
    </>
  );
}
