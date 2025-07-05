import { Target, Trophy, Edit, Trash2, PlusCircle, Calendar, BarChart2, Repeat, Activity } from 'lucide-react';

// Objectifs mockés pour la démo
const objectifsMock = [
  {
    id: 1,
    type: 'Performance',
    nom: 'Squat 100kg x 5 reps',
    progression: 80,
    deadline: '2024-07-31',
    badge: '🏋️‍♂️',
  },
  {
    id: 2,
    type: 'Récurrence',
    nom: "M'entraîner 4x/semaine pendant 1 mois",
    progression: 60,
    deadline: '2024-07-15',
    badge: '🔥',
  },
  {
    id: 3,
    type: 'Habitude',
    nom: 'Faire 10k pas par jour pendant 30 jours',
    progression: 40,
    deadline: null,
    badge: '🚶‍♂️',
  },
  {
    id: 4,
    type: 'Poids',
    nom: 'Atteindre 70kg avec 15% de masse grasse',
    progression: 60,
    deadline: null,
    badge: '⚖️',
  },
];

const badgesMock = [
  { id: 1, label: 'Objectif squat atteint !', icon: '🏅' },
  { id: 2, label: '30 jours de constance', icon: '🏆' },
];

export default function ObjectifsPage() {
  // Pour la démo, on utilise les mocks
  const objectifs = objectifsMock;
  const objectifsActifs = objectifs.filter(obj => obj.progression < 100);
  const objectifsAtteints = objectifs.filter(obj => obj.progression >= 100);
  const progressionGenerale = objectifs.length > 0 
    ? Math.round(objectifs.reduce((acc, obj) => acc + obj.progression, 0) / objectifs.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <Target size={32} className="text-blue-500" />
            <h1 className="text-3xl font-extrabold">Tes Objectifs</h1>
          </div>
          <div className="text-gray-600 text-lg mb-4">Avance chaque jour vers tes ambitions.</div>
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-sm text-gray-500">{objectifs.length} objectifs actifs</span>
              <span className="text-sm text-blue-600 font-bold">{progressionGenerale}% complétés</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-3 bg-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${progressionGenerale}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Objectifs actifs */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart2 size={22} className="text-orange-500" />
            Objectifs actifs
          </h2>
          <div className="grid gap-4">
            {objectifsActifs.map(obj => (
              <div key={obj.id} className="bg-white rounded-2xl shadow p-5 flex flex-col sm:flex-row sm:items-center gap-4 relative">
                <div className="absolute top-3 right-3 flex gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition" title="Modifier">
                    <Edit size={18} className="text-blue-400" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition" title="Supprimer">
                    <Trash2 size={18} className="text-red-400" />
                  </button>
                </div>
                <div className="flex-shrink-0 text-3xl">{obj.badge}</div>
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1">{obj.nom}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    {obj.type === 'Performance' && <Activity size={16} className="text-orange-400" />}
                    {obj.type === 'Récurrence' && <Repeat size={16} className="text-purple-400" />}
                    {obj.type === 'Habitude' && <Repeat size={16} className="text-green-400" />}
                    {obj.type === 'Poids' && <Trophy size={16} className="text-yellow-500" />}
                    <span>{obj.type}</span>
                    {obj.deadline && (
                      <span className="flex items-center gap-1 ml-2"><Calendar size={14} /> {obj.deadline}</span>
                    )}
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${obj.progression}%`, background: obj.progression >= 100 ? '#22c55e' : '#3b82f6' }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400">Progression : {obj.progression}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Ajouter un objectif */}
        <div className="flex justify-center">
          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg text-lg transition">
            <PlusCircle size={22} />
            Ajouter un objectif
          </button>
        </div>

        {/* Objectifs atteints (badges) */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy size={22} className="text-yellow-500" />
            Objectifs atteints
          </h2>
          <div className="flex flex-wrap gap-4">
            {badgesMock.map(badge => (
              <div key={badge.id} className="flex items-center gap-2 bg-white rounded-xl shadow px-4 py-2 text-lg">
                <span className="text-2xl">{badge.icon}</span>
                <span className="font-medium text-gray-700">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 