import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Mode simulation - retourner des données simulées
    const challenges = [
      {
        id: "weekly_workouts",
        title: "Challenge de la semaine",
        description: "5 séances en 7 jours",
        current: 3,
        target: 5,
        progress: 60,
        completed: false,
        type: "workout_count",
        period: "week",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "monthly_workouts",
        title: "Challenge du mois",
        description: "20 séances en 30 jours",
        current: 12,
        target: 20,
        progress: 60,
        completed: false,
        type: "workout_count",
        period: "month",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return NextResponse.json(challenges);

  } catch (error) {
    console.error("Erreur API challenges:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
