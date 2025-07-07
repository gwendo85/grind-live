import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseClient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Mode simulation pour tous les cas (table favorites n'existe pas encore)
    const mockFavorites = [
      {
        id: "1",
        user_id: userId || "mock-user",
        workout_id: "3",
        created_at: "2024-01-15T10:00:00Z",
        workout: {
          id: "3",
          name: "Séance Jambes - Quadriceps/Ischios",
          description: "Séance complète pour les jambes",
          created_at: "2024-01-17T08:00:00Z",
          user_id: userId || "mock-user",
          estimated_duration: 90,
          exercise_count: 8
        }
      },
      {
        id: "2",
        user_id: userId || "mock-user",
        workout_id: "5",
        created_at: "2024-01-14T15:30:00Z",
        workout: {
          id: "5",
          name: "Séance Haut du Corps - Pectoraux/Triceps",
          description: "Séance pour le haut du corps",
          created_at: "2024-01-16T09:00:00Z",
          user_id: userId || "mock-user",
          estimated_duration: 75,
          exercise_count: 6
        }
      }
    ];

    return NextResponse.json({ favorites: mockFavorites });
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des favoris" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, workoutId } = await request.json();

    // Mode simulation pour tous les cas (table favorites n'existe pas encore)
    const mockFavorite = {
      id: Date.now().toString(),
      user_id: userId || "mock-user",
      workout_id: workoutId,
      created_at: new Date().toISOString(),
      workout: {
        id: workoutId,
        name: `Séance ${workoutId}`,
        description: "Séance simulée ajoutée aux favoris",
        created_at: new Date().toISOString(),
        user_id: userId || "mock-user",
        estimated_duration: 60,
        exercise_count: 5
      }
    };

    return NextResponse.json({ favorite: mockFavorite });
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout aux favoris" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const workoutId = searchParams.get("workoutId");

    // Mode simulation pour tous les cas (table favorites n'existe pas encore)
    console.log(`🧪 Simulation: Suppression du favori workoutId=${workoutId} pour userId=${userId}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression des favoris:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression des favoris" },
      { status: 500 }
    );
  }
}
