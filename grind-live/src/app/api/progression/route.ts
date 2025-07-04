import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Mode simulation - retourner des données simulées
    const mockProgression = {
      sessionsDone: 3,
      sessionsGoal: 5,
      sessionsPercent: 60,
      volumeDone: 6500,
      volumeGoal: 10000,
      volumePercent: 65,
      timeDone: 4.5,
      timeGoal: 8,
      timePercent: 56,
    };

    return NextResponse.json(mockProgression);

  } catch (error) {
    console.error("Erreur API progression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
