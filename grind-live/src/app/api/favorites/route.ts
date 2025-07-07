import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseClient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Mode simulation si pas d'userId
    if (!userId) {
      const mockFavorites = [
        {
          id: "1",
          user_id: "mock-user",
          workout_id: "3",
          created_at: "2024-01-15T10:00:00Z",
          workout: {
            id: "3",
            name: "Séance Jambes - Quadriceps/Ischios",
            description: "Séance complète pour les jambes",
            created_at: "2024-01-17T08:00:00Z",
            user_id: "mock-user",
            estimated_duration: 90,
            exercise_count: 8
          }
        }
      ];

      return NextResponse.json({ favorites: mockFavorites });
    }

    const { data, error } = await supabaseServer
      .from("favorites")
      .select('*')
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ favorites: data });
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

    // Mode simulation si pas d'userId ou si userId est mock-user
    if (!userId || !workoutId || userId === "mock-user") {
      const mockFavorite = {
        id: Date.now().toString(),
        user_id: "mock-user",
        workout_id: workoutId,
        created_at: new Date().toISOString(),
        workout: {
          id: workoutId,
          name: `Séance ${workoutId}`,
          description: "Séance simulée",
          created_at: new Date().toISOString(),
          user_id: "mock-user",
          estimated_duration: 60,
          exercise_count: 5
        }
      };

      return NextResponse.json({ favorite: mockFavorite });
    }

    const { data, error } = await supabaseServer
      .from("favorites")
      .insert({
        user_id: userId,
        workout_id: workoutId
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ favorite: data });
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

    // Mode simulation si pas d'userId ou si userId est mock-user
    if (!userId || !workoutId || userId === "mock-user") {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabaseServer
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("workout_id", workoutId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression des favoris:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression des favoris" },
      { status: 500 }
    );
  }
}
